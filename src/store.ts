import { configureStore } from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga'
import parametersReducer from './parameters/parametersSlice'
import populationService from './population/population-context'
import rootSaga from './rootSaga'
import simulationReducer from './simulation/simulationSlice'
import navigationReducer from './navigation/navigationSlice'

const sagaMiddleware = createSagaMiddleware({
  context: {
    population: populationService
  }
})

const store = configureStore({
  reducer: {
    parameters: parametersReducer,
    simulation: simulationReducer,
    navigation: navigationReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(sagaMiddleware)
})

export type RootState = ReturnType<typeof store.getState>

sagaMiddleware.run(rootSaga)

export default store
