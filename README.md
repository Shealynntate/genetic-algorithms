
# Genetic Algorithms Demo
![](/src/assets/readme/mona_lisa.gif)
![](/src/assets/readme/son_of_man.gif)
![](/src/assets/readme/marilyn_diptych.gif)

#### *Reproducing images by evolving populations of polygons*

<br>

## Visit the [site](https://genetic-algorithms-demo.vercel.app) to learn more and try it yourself!

<br>

# Running The Code
Install the project's packages by running `npm install`.

Run the project locally with `npm start`, by default it will be served on `localhost:3000`

Use `npm run build` to build a production version of the site for deployment.

## Troubleshooting

### Mac
The first time you run `npm install` you might come across a `node-canvas` error:
```
node-pre-gyp ERR!
```

Using the advice on [this thread](https://github.com/Automattic/node-canvas/issues/1825) I was able to fix that by installing `cairo` on OSX, it's pretty straight forward and [this page](https://github.com/Automattic/node-canvas/wiki/Installation%3A-Mac-OS-X) walks you through it.

# Site Architecture
This entirely client-side app was written in `React` using `Redux` for state management and `React Sagas` for asynchronous logic handling.

To help speed up some of the most time intensive calculations
I used React18's new webworker feature to split up parallelizable work into separate workers.

Data from previous and pending simulation runs is stored in IndexedDB using Dexie. This allows it to persist between page reloads.

All of the Genetic Algorithm code I've tried to keep isolated in the `models` folder.
### Site Structure
```
> src
  > assets
    - Images & Json for tests and demos
  > components
    - All the react components
  > contexts
  > features
  > globals
  > models
    - Most all of the Genetic Algorithm specific code
  > test
  > web-workers
    - Phenotype - i.e. the fitness evaluation computations
```