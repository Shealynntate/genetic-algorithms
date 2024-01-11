import { type PayloadAction, createSlice } from '@reduxjs/toolkit'
import { defaultParameters } from './config'
import { type ParametersState } from './types'
import { objectKeys } from '../utils/utils'

export const parametersSlice = createSlice({
  name: 'parameters',
  initialState: defaultParameters,
  reducers: {
    // Population
    setPopulationSize: (state, action) => {
      state.population.size = action.payload
    },
    setTarget: (state, action) => {
      state.population.target = action.payload
    },
    setMinPolygons: (state, action) => {
      state.minPolygons = action.payload
    },
    setMaxPolygons: (state, action) => {
      state.maxPolygons = action.payload
    },
    setPolygons: (state, action) => {
      state.minPolygons = action.payload.minPolygons
      state.maxPolygons = action.payload.maxPolyGons
    },
    // Crossover
    setCrossoverType: (state, action) => {
      state.crossover.type = action.payload
    },
    // Mutation
    setColorSigma: (state, action) => {
      state.mutation.distributions.colorSigma = action.payload
    },
    setPointSigma: (state, action) => {
      state.mutation.distributions.pointSigma = action.payload
    },
    // Selection
    setSelectionType: (state, action) => {
      state.selection.type = action.payload
    },
    setEliteCount: (state, action) => {
      const count = action.payload
      const popSize = state.population.size
      if (count > popSize) {
        throw new Error(`Elite count ${count} cannot exceed population size ${popSize}`)
      }
      state.selection.eliteCount = count
    },
    setTournamentSize: (state, action) => {
      state.selection.tournamentSize = action.payload
    },
    setSimulationParameters: (state, action: PayloadAction<ParametersState>) => {
      const parameters = action.payload
      objectKeys(parameters).forEach((key) => {
        state[key] = parameters[key]
      })
    }
  }
})

export const {
  setPopulationSize,
  setTarget,
  setMinPolygons,
  setMaxPolygons,
  setPolygons,
  setCrossoverType,
  setColorSigma,
  setPointSigma,
  setSelectionType,
  setEliteCount,
  setSimulationParameters
} = parametersSlice.actions

export default parametersSlice.reducer
