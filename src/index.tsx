import { StrictMode } from 'react'

import { CssBaseline, ThemeProvider } from '@mui/material'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { RouterProvider } from 'react-router-dom'

import './styles.css'
import poulationService, {
  PopulationContext
} from './population/population-context'
import router from './router/router'
import store from './store'
import theme from './theme'

const root = ReactDOM.createRoot(document.getElementById('root')!)
root.render(
  <StrictMode>
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
  </StrictMode>
)
