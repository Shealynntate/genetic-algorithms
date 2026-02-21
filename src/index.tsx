import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { RouterProvider } from 'react-router-dom'
import './styles.css'
import store from './store'
import theme from './theme'
import poulationService, {
  PopulationContext
} from './population/population-context'
import router from './router/router'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PopulationContext.Provider value={poulationService}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <RouterProvider
            router={router}
            fallbackElement={<div>Loading...</div>}
          />
        </ThemeProvider>
      </PopulationContext.Provider>
    </Provider>
  </React.StrictMode>
)
