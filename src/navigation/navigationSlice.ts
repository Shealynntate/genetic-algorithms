/* eslint-disable @typescript-eslint/no-dynamic-delete */
/* eslint-disable @typescript-eslint/no-invalid-void-type */
import { type PayloadAction, createSlice } from '@reduxjs/toolkit'
import _ from 'lodash'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { type NavigationState } from './types'
import firestoreApi from '../firebase/firestoreApi'
import { firestore, experimentRecordConverter, storage } from '../firebase/firebase'
import { type Simulation, type SimulationReport } from '../database/types'
import { lineColors } from './config'
import { clearCurrentSimulation } from '../simulation/simulationSlice'
import { addDoc, collection, deleteDoc, doc, getCountFromServer, getDocs, serverTimestamp, updateDoc, writeBatch } from 'firebase/firestore'
import { NavTag } from '../common/types'
import { type GenerationStatsRecord } from '../population/types'
import { type ExperimentRecord } from '../firebase/types'
import { convertBase64ToFile } from '../utils/imageUtils'
import { GIF_FILE, TARGET_IMAGE_FILE } from '../firebase/config'

const initialState: NavigationState = {
  simulationState: 'none',
  // Map of simulation id to color value for the graph
  simulationGraphColors: {},
  // Map of simulation id to color index, for internal bookkeeping
  simulationGraphIndices: {},
  isAuthenticated: false,
  errorSnackbarOpen: false,
  successSnackbarOpen: false,
  errorSnackbarMessage: '',
  successSnackbarMessage: ''
}

export const navigationSlice = createSlice({
  name: 'navigation',
  initialState,
  reducers: {
    setAppState: (state, action) => {
      state.simulationState = action.payload
    },
    runSimulation: (state, action: PayloadAction<Simulation>) => {
      state.simulationState = 'running'
    },
    pauseSimulations: (state) => {
      state.simulationState = 'paused'
    },
    resumeSimulations: (state) => {
      state.simulationState = 'running'
    },
    endSimulations: (state) => {
      state.simulationState = 'complete'
    },
    endSimulationEarly: (state) => {
      // This is called from a PAUSED state, resume running to process the next run
      state.simulationState = 'complete'
    },
    deleteRunningSimulation: (state) => {
      // This is called from a PAUSED state, resume running to process the next run
      state.simulationState = 'none'
    },
    setIsAuthenticated (state, action) {
      state.isAuthenticated = action.payload
    },
    openErrorSnackbar (state, action) {
      state.errorSnackbarOpen = true
      state.errorSnackbarMessage = action.payload
    },
    openSuccessSnackbar (state, action) {
      state.successSnackbarOpen = true
      state.successSnackbarMessage = action.payload
    },
    closeErrorSnackbar (state) {
      state.errorSnackbarOpen = false
      state.errorSnackbarMessage = ''
    },
    closeSuccessSnackbar (state) {
      state.successSnackbarOpen = false
      state.successSnackbarMessage = ''
    },
    // Graph Entries
    addGraphEntry: (state, action: PayloadAction<number>) => {
      const id = action.payload
      if (id in state.simulationGraphColors) return
      // Determine line color index
      const indices: number[] = Object.values(state.simulationGraphIndices)
      indices.sort((a, b) => a - b)
      let next = indices[0] === 0 ? indices.length % lineColors.length : 0
      for (let i = 1; i < indices.length; ++i) {
        const prev = indices[i - 1]
        if (indices[i] !== prev && indices[i] - 1 !== prev) {
          next = prev + 1
          break
        }
      }
      state.simulationGraphColors[id] = lineColors[next]
      state.simulationGraphIndices[id] = next
    },
    removeGraphEntry: (state, action: PayloadAction<number>) => {
      const key = action.payload
      delete state.simulationGraphColors[key]
      delete state.simulationGraphIndices[key]
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(clearCurrentSimulation, (state) => {
        state.simulationState = 'complete'
      })
  }
})

const simulationReportToExperimentRecord = (record: SimulationReport, order: number): ExperimentRecord => {
  const parameters = record.simulation.parameters
  return {
    createdOn: serverTimestamp(),
    lastModified: serverTimestamp(),
    simulationName: record.simulation.name,
    simulationId: record.simulation.id ?? -1,
    gif: '',
    order,
    parameters: {
      ...parameters,
      population: {
        ...parameters.population,
        target: ''
      }
    },
    results: record.results.map(({ threshold, stats }: GenerationStatsRecord) => ({
      threshold,
      stats: _.omit(stats, ['maxFitOrganism', 'isGlobalBest'])
    })),
    maxFitOrganism: record.results[record.results.length - 1].stats.maxFitOrganism
  }
}

// Async Api
// ------------------------------------------------------------
export const navigationApi = firestoreApi.injectEndpoints({
  endpoints: (builder) => ({
    uploadExperimentReport: builder.mutation<string, SimulationReport>({
      async queryFn (report: SimulationReport) {
        try {
          const experimentsRef = collection(firestore, 'experiments')
          if (experimentsRef == null) {
            throw new Error('[uploadSimulationReport] ref is null')
          }
          const experimentsSnapshot = await getCountFromServer(experimentsRef)
          const order = experimentsSnapshot.data().count
          // Upload the simulation report to firestore
          const experimentResult = await addDoc(
            experimentsRef,
            simulationReportToExperimentRecord(report, order)
          )
          const recordId = experimentResult.id
          // Next upload the target image and gif to storage
          const targetFilePath = `experiments/${recordId}/${TARGET_IMAGE_FILE}`
          const gifFilePath = `experiments/${recordId}/${GIF_FILE}`

          const target = report.simulation.parameters.population.target
          const targetImage = await convertBase64ToFile(target, TARGET_IMAGE_FILE)
          const targetRef = ref(storage, targetFilePath)
          await uploadBytes(targetRef, targetImage)

          if (report.gif != null) {
            const gif = await convertBase64ToFile(report.gif, GIF_FILE)
            const gifStorageRef = ref(storage, gifFilePath)
            await uploadBytes(gifStorageRef, gif)
          }
          // Update the experiment record with the new paths
          const updatedRef = doc(firestore, 'experiments', recordId)
          await updateDoc(updatedRef, {
            gif: report.gif != null ? gifFilePath : '',
            'parameters.population.target': targetFilePath
          })

          return { data: recordId }
        } catch (error: any) {
          console.error(error)

          return { error: error.message }
        }
      },
      invalidatesTags: [NavTag.SIMULATION_REPORTS]
    }),
    fetchAllExperiments: builder.query<ExperimentRecord[], void>({
      queryFn: async () => {
        try {
          const collectionRef = collection(firestore, 'experiments').withConverter(experimentRecordConverter)
          const snapshot = await getDocs(collectionRef)
          const records = snapshot.docs.map((doc) => doc.data())
          // Replace the relative paths with the actual image urls
          const updatedRecords = await Promise.all(
            records.map(async (record): Promise<ExperimentRecord> => {
              const targetPath = record.parameters.population.target
              const gifPath = record.gif
              if (targetPath !== '') {
                const storageRef = ref(storage, targetPath)
                const url = await getDownloadURL(storageRef)
                record.parameters.population.target = url
              }
              if (gifPath !== '') {
                const storageRef = ref(storage, gifPath)
                const url = await getDownloadURL(storageRef)
                record.gif = url
              }
              return record
            })
          )

          return { data: updatedRecords }
        } catch (error: any) {
          console.error(error)

          return { error: error.message }
        }
      },
      providesTags: (result) => (result != null)
        ? [{ type: NavTag.SIMULATION_REPORTS, id: 'LIST' }]
        : [{ type: NavTag.SIMULATION_REPORTS, id: 'LIST' }]
    }),
    updateExperiments: builder.mutation<ExperimentRecord[], ExperimentRecord[]>({
      async queryFn (records: ExperimentRecord[]) {
        try {
          const collectionRef = collection(firestore, 'experiments')
          if (collectionRef == null) {
            throw new Error('[updateExperiments] ref is null')
          }
          const batch = writeBatch(firestore)
          records.forEach((record) => {
            if (record.id == null) {
              throw new Error('[updateExperiments] record id is null')
            }
            const docRef = doc(firestore, 'experiments', record.id).withConverter(experimentRecordConverter)
            // Update the lastModified timestamp
            const entry = { ...record, lastModified: serverTimestamp() }
            batch.set(docRef, entry)
          })
          await batch.commit()
          // TODO: Return the updated records
          return { data: records }
        } catch (error: any) {
          console.error(error)

          return { error: error.message }
        }
      },
      invalidatesTags: [NavTag.SIMULATION_REPORTS]
    }),
    deleteExperiment: builder.mutation<void, string>({
      async queryFn (id: string) {
        try {
          const ref = doc(firestore, 'experiments', id)
          if (ref == null) {
            throw new Error('[deleteExperiment] ref is null')
          }
          await deleteDoc(ref)
          return { data: undefined }
        } catch (error: any) {
          console.error(error)

          return { error: error.message }
        }
      },
      invalidatesTags: [NavTag.SIMULATION_REPORTS]
    })
  })
})

// Actions
// ------------------------------------------------------------
export const {
  setAppState,
  setIsAuthenticated,
  openErrorSnackbar,
  openSuccessSnackbar,
  closeErrorSnackbar,
  closeSuccessSnackbar,
  runSimulation,
  pauseSimulations,
  resumeSimulations,
  endSimulations,
  endSimulationEarly,
  deleteRunningSimulation,
  addGraphEntry,
  removeGraphEntry
} = navigationSlice.actions

// Selectors
// ------------------------------------------------------------
export const selectIsAuthenticated =
  (state: { navigation: NavigationState }): boolean => state.navigation.isAuthenticated

export const selectErrorSnackbarOpen =
  (state: { navigation: NavigationState }): boolean => state.navigation.errorSnackbarOpen

export const selectSuccessSnackbarOpen =
  (state: { navigation: NavigationState }): boolean => state.navigation.successSnackbarOpen

export const selectErrorSnackbarMessage =
  (state: { navigation: NavigationState }): string => state.navigation.errorSnackbarMessage

export const selectSuccessSnackbarMessage =
  (state: { navigation: NavigationState }): string => state.navigation.successSnackbarMessage

export const {
  useUploadExperimentReportMutation,
  useFetchAllExperimentsQuery,
  useDeleteExperimentMutation,
  useUpdateExperimentsMutation
} = navigationApi

export default navigationSlice.reducer
