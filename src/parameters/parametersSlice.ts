/* eslint-disable no-param-reassign */
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
      state.population.minPolygons = action.payload
    },
    setMaxPolygons: (state, action) => {
      state.population.maxPolygons = action.payload
    },
    setPolygons: (state, action) => {
      state.population.minPolygons = action.payload.minPolygons
      state.population.maxPolygons = action.payload.maxPolyGons
    },
    // Crossover
    setCrossoverType: (state, action) => {
      state.crossover.type = action.payload
    },
    setCrossoverProbabilities: (state, action) => {
      state.crossover.probabilities = { ...state.crossover.probabilities, ...action.payload }
    },
    // Mutation
    setColorSigma: (state, action) => {
      state.mutation.distributions.colorSigma = action.payload
    },
    setPointSigma: (state, action) => {
      state.mutation.distributions.pointSigma = action.payload
    },
    setMutationProbabilities: (state, action) => {
      state.mutation.probabilities = { ...state.mutation.probabilities, ...action.payload }
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
  setCrossoverProbabilities,
  setColorSigma,
  setPointSigma,
  setMutationProbabilities,
  setSelectionType,
  setEliteCount,
  setSimulationParameters
} = parametersSlice.actions

export default parametersSlice.reducer
