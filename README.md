# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Troubleshooting

Issue: node-canvas error: `node-pre-gyp ERR!`
Fix (as noted here): https://github.com/Automattic/node-canvas/issues/1825
  https://github.com/Automattic/node-canvas/wiki/Installation%3A-Mac-OS-X

## Explanation

This site is made with React via create-react-app.
It also uses Redux and React Sagas for state management and site logic.
Everything is done client-side.
Data from previous and pending runs is stored in IndexedDB using Dexie.
You can check out the source code for everything on Github.