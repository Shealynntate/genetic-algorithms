import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import App from '../components/App';
import Gallery from '../components/gallery/Gallery';
import Simulations from '../components/simulations/Simulations';
import Progress from '../components/progress/Progress';
import About from '../components/about/About';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Gallery />,
      },
      {
        path: '/experiment',
        element: <Simulations />,
      },
      {
        path: '/your-art',
        element: <Progress />,
      },
      {
        path: '/about',
        element: <About />,
      },
    ],
  },
]);

export default router;
