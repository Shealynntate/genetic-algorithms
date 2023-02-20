
# Genetic Algorithms Demo
![](/src/assets/readme/mona_lisa.gif)
![](/src/assets/readme/son_of_man.gif)
![](/src/assets/readme/marilyn_diptych.gif)

#### *Reproducing images by evolving populations of polygons*

## Visit the [site](https://genetic-algorithms-demo.vercel.app) to try it yourself!

The About Section contains an explanation of Genetic Algorithms and links to more resources on the topic.

# Running The Code
This site was made with `React` using `create-react-app`. All the normal commands and quirks that come with that apply.
Use `npm install` to download all the packages and then `npm start` from the project directory to run this project
on `localhost:3000`.

## Troubleshooting
The first time you try to `npm install` you might come across this `node-canvas` error (at least I did on a Mac)
`node-pre-gyp ERR!`

I was able to fix that using the advice on [this thread](https://github.com/Automattic/node-canvas/issues/1825)

Which was just to install `cairo` on OSX, [this page](https://github.com/Automattic/node-canvas/wiki/Installation%3A-Mac-OS-X) walks you through it.

# Site Architecture
This site uses Redux for state management and React Sagas for asynchronous logic handling.

All the computations are done client-side, in the browser. To help speed up some of the most time intensive calculations
I used React18's new webworker feature to split up parallelizable work into separate workers.

Data from previous and pending simulation runs is stored in IndexedDB using Dexie. This allows it to persist between page reloads.

All of the Genetic Algorithm code I've tried to keep isolated in the `models` folder.