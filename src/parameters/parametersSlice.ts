import { type PayloadAction, createSlice } from '@reduxjs/toolkit'

import { defaultParameters } from './config'
import { type ParametersState } from './types'

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
      state.population.minGenomeSize = action.payload
    },
    setMaxPolygons: (state, action) => {
      state.population.maxGenomeSize = action.payload
    },
    setPolygons: (state, action) => {
      state.population.minGenomeSize = action.payload.minPolygons
      state.population.maxGenomeSize = action.payload.maxPolyGons
    },
    // Crossover
    setCrossoverType: (state, action) => {
      state.population.crossover.type = action.payload
    },
    // Mutation
    setColorSigma: (state, action) => {
      state.population.mutation.distributions.colorSigma = action.payload
    },
    setPointSigma: (state, action) => {
      state.population.mutation.distributions.pointSigma = action.payload
    },
    // Selection
    setSelectionType: (state, action) => {
      state.population.selection.type = action.payload
    },
    setEliteCount: (state, action) => {
      const count = action.payload
      const popSize = state.population.size
      if (count > popSize) {
        throw new Error(
          `Elite count ${count} cannot exceed population size ${popSize}`
        )
      }
      state.population.selection.eliteCount = count
    },
    setTournamentSize: (state, action) => {
      state.population.selection.tournamentSize = action.payload
    },
    setSimulationParameters: (
      state,
      action: PayloadAction<ParametersState>
    ) => {
      const parameters = action.payload
      state.population = parameters.population
      state.stopCriteria = parameters.stopCriteria
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
