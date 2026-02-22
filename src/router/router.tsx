import { createBrowserRouter } from 'react-router-dom'

import Admin from '../admin/Admin'
import Gallery from '../gallery/Gallery'
import LocalGallery from '../local-gallery/LocalGallery'
import App from '../navigation/App'
import Simulations from '../simulation/Simulations'

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
        element: <LocalGallery />
      },
      {
        path: '/admin',
        element: <Admin />
      }
    ]
  }
])

export default router
