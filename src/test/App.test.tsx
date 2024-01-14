import React from 'react'
import { Provider } from 'react-redux'
import { ThemeProvider } from '@emotion/react'
import { CssBaseline } from '@mui/material'
import { render, screen } from '@testing-library/react'
import 'fake-indexeddb/auto'
import store from '../store'
import theme from '../theme'
import populationService, { PopulationContext } from '../population/population-context'
import { RouterProvider } from 'react-router-dom'
import router from '../router/router'

// import createWorker from '../web-workers/fitnessEvaluatorCreator';

// class Worker {
//   constructor(stringUrl) {
//     this.url = stringUrl;
//     this.onconnect = () => {};
//     this.port = {
//       start: () => {},
//       postMessage: () => {},
//       onmessage: () => {},
//     };
//   }
// }

jest.mock(
  '../web-workers/fitnessEvaluatorCreator',
  () => {
    const worker = {
      url: '',
      onconnect: () => {},
      port: {
        start: () => {},
        postMessage: () => {},
        onmessage: () => {}
      }
    }
    return worker
  }
)

test('renders title', async () => {
  render(
    <Provider store={store}>
      <PopulationContext.Provider value={populationService}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <RouterProvider
            router={router}
            fallbackElement={<div>Loading...</div>}
          />
        </ThemeProvider>
      </PopulationContext.Provider>
    </Provider>
  )

  // await new Promise((r) => { setTimeout(r, 1000); });
  const titleElement = screen.getByText(/genetic algorithms/i)
  expect(titleElement).toBeInTheDocument()
})
