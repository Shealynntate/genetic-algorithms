import React from 'react'
import { createBrowserRouter } from 'react-router-dom'
import App from '../navigation/App'
import Gallery from '../gallery/Gallery'
import Simulations from '../simulation/Simulations'
import Progress from '../progress/Progress'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Gallery />
      },
      {
        path: '/experiment',
        element: <Simulations />
      },
      {
        path: '/your-art',
        element: <Progress />
      }
    ]
  }
])

export default router
