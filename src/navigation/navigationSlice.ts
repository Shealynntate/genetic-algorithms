/* eslint-disable @typescript-eslint/no-dynamic-delete */
/* eslint-disable @typescript-eslint/no-invalid-void-type */
import { type PayloadAction, createSlice } from '@reduxjs/toolkit'
import _ from 'lodash'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { type NavigationState } from './types'
import firestoreApi from '../firebase/firestoreApi'
import { firestore, experimentRecordConverter, storage } from '../firebase/firebase'
import { type SimulationReport } from '../database/types'
import { lineColors } from '../constants/constants'
import { clearCurrentSimulation } from '../simulation/simulationSlice'
import { addDoc, collection, doc, getDocs, serverTimestamp, updateDoc } from 'firebase/firestore'
import { NavTag } from '../common/types'
import { type GenerationStatsRecord } from '../population/types'
import { type ExperimentRecord } from '../firebase/types'
import { convertBase64ToFile } from '../utils/imageUtils'
import { GIF_FILE, TARGET_IMAGE_FILE } from '../firebase/config'

const initialState: NavigationState = {
  simulationState: 'none',
  // Show the create simulation tooltip when the app is first loaded
  showCreateSimulationModal: true,
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
    setShowCreateSimulationModal: (state, action) => {
      state.showCreateSimulationModal = action.payload
    },
    runSimulations: (state) => {
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

const simulationReportToExperimentRecord = (record: SimulationReport): ExperimentRecord => {
  const parameters = record.simulation.parameters
  return {
    createdOn: serverTimestamp(),
    lastModified: serverTimestamp(),
    simulationName: record.simulation.name,
    simulationId: record.simulation.id ?? -1,
    gif: '',
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
          // Upload the simulation report to firestore
          const experimentResult = await addDoc(
            experimentsRef,
            simulationReportToExperimentRecord(report)
          )
          const recordId = experimentResult.id
          // Next upload the target image and gif to storage
          const targetFilePath = `experiments/${recordId}/${TARGET_IMAGE_FILE}`
          const gifFilePath = `experiments/${recordId}/${GIF_FILE}`

          const target = report.simulation.parameters.population.target
          const targetImage = await convertBase64ToFile(target, TARGET_IMAGE_FILE)
          const targetRef = ref(storage, targetFilePath)
          const targetResult = await uploadBytes(targetRef, targetImage)
          console.log({ targetResult })
          if (report.gif != null) {
            const gif = await convertBase64ToFile(report.gif, GIF_FILE)
            const gifStorageRef = ref(storage, gifFilePath)
            const gifResult = await uploadBytes(gifStorageRef, gif)
            console.log({ gifResult })
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
          console.log({ updatedRecords })
          return { data: updatedRecords }
        } catch (error: any) {
          console.error(error)

          return { error: error.message }
        }
      },
      providesTags: (result) => (result != null)
        ? [{ type: NavTag.SIMULATION_REPORTS, id: 'LIST' }]
        : [{ type: NavTag.SIMULATION_REPORTS, id: 'LIST' }]
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
  runSimulations,
  pauseSimulations,
  resumeSimulations,
  endSimulations,
  endSimulationEarly,
  deleteRunningSimulation,
  addGraphEntry,
  removeGraphEntry,
  setShowCreateSimulationModal
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
  useFetchAllExperimentsQuery
} = navigationApi

export default navigationSlice.reducer
