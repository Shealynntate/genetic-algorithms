/* eslint-disable @typescript-eslint/no-dynamic-delete */
import { type PayloadAction, createSlice } from '@reduxjs/toolkit'
import { type NavigationState } from './types'
import firestoreApi from '../firebase/firestoreApi'
import { type ExperimentRecord, firestore, experimentRecordConverter } from '../firebase/firebase'
import { type SimulationReport } from '../database/types'
import { lineColors } from '../constants/constants'
import { clearCurrentSimulation } from '../simulation/simulationSlice'
import { addDoc, collection, doc, getDoc } from 'firebase/firestore'
import { NavTag } from '../common/types'

const initialState: NavigationState = {
  simulationState: 'none',
  // Show the create simulation tooltip when the app is first loaded
  showCreateSimulationModal: true,
  // Map of simulation id to color value for the graph
  simulationGraphColors: {},
  // Map of simulation id to color index, for internal bookkeeping
  simulationGraphIndices: {}
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

// Async Api
// ------------------------------------------------------------
export const navigationApi = firestoreApi.injectEndpoints({
  endpoints: (builder) => ({
    uploadExperimentReport: builder.mutation<ExperimentRecord, SimulationReport>({
      async queryFn (record: SimulationReport) {
        try {
          const ref = collection(firestore, 'experiments').withConverter(experimentRecordConverter)
          if (ref == null) {
            throw new Error('[uploadSimulationReport] ref is null')
          }
          const experimentRecord: ExperimentRecord = {
            createdOn: Date.now(),
            lastModified: Date.now(),
            simulationReport: record
          }
          const result = await addDoc(ref, experimentRecord)
          // Now that the simulation is uploaded, fetch it from firestore
          const docRef = doc(firestore, 'simulations', result.id)
          const docSnapshot = await getDoc(docRef)
          const data = docSnapshot.data() as ExperimentRecord
          console.log({ data })
          return { data }
        } catch (error: any) {
          console.error(error)

          return { error: error.message }
        }
      },
      invalidatesTags: [NavTag.SIMULATION_REPORTS]
    })
  })
})

export const {
  setAppState,
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

export const {
  useUploadExperimentReportMutation
} = navigationApi

export default navigationSlice.reducer
