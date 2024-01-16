
# Genetic Algorithms
<p align="center" width="100%">
  <img src="/src/assets/readme/mona_lisa.gif" />
  <img src="/src/assets/readme/son_of_man.gif" />
  <img src="/src/assets/readme/marilyn_diptych.gif" />
  <h5 align="center">Reproducing images by evolving populations of polygons</h5>
  <p align="center">Visit the <a href="https://genetic-algorithms-demo.vercel.app">site</a> to learn more and try it yourself!</p>
</p>

# Resources
Full credit to Robert Johansson for this project idea. Check it out at [Genetic Programming: Evolution of the Mona Lisa](https://rogerjohansson.blog/2008/12/07/genetic-programming-evolution-of-mona-lisa/)

Here&apos;s a list of other resources I used while working on this project:

[Essentials of Metaheuristics](https://cs.gmu.edu/~sean/book/metaheuristics/Essentials.pdf)

[Analyzing Mutation Schemes for Real-Parameter Genetic Algorithms](https://www.egr.msu.edu/~kdeb/papers/k2012016.pdf)

[Choosing Mutation and Crossover Ratios for Genetic Algorithms](https://pdfs.semanticscholar.org/5a25/a4d30528160eef96adbce1d7b03507ebd3d7.pdf)

[Analyzing the Performance of Mutation Operators to Solve the Traveling Salesman Problem](https://arxiv.org/pdf/1203.3099.pdf)
          
[Initial Population for Genetic Algorithms: A Metric Approach](https://www.researchgate.net/publication/220862320_Initial_Population_for_Genetic_Algorithms_A_Metric_Approach)
      
[Self-Adaptive Simulated Binary Crossover for Real-Parameter Optimization](https://www.researchgate.net/publication/220742263_Self-adaptive_simulated_binary_crossover_for_real-parameter_optimization)

[Genetic Programming Needs Better Benchmarks](http://gpbenchmarks.org/wp-content/uploads/2019/08/paper1.pdf)

[A Genetic Algorithm for Image Recreation — Can it Paint the Mona Lisa?](https://medium.com/@sebastian.charmot/genetic-algorithm-for-image-recreation-4ca546454aaa)

# Genetic Algorithms Overview
## Metaheuristics
A set of techniques that are useful for solving a hard problem that typically has these characteristics:
- It&apos;s not obvious how to find a solution to the problem
- It&apos;s easy to check if a solution is good, or at least better than another one
- The solution space is so large that simple brute force, trial and error isn&apos;t going to work

Metaheuristics are a type of _stochastic optimization_, algorithms that use some randomness to find a solution.<br>
Many of them can be boiled down to a simple concept called **hill climbing**:<br>
- Pick a random solution as your starting point (it&apos;ll probably be bad, that&apos;s okay)
- Randomly tweak it a bit to get a slightly different solution
- Is the new one better? Awesome, keep it, otherwise keep the original
- Repeat until you&apos;ve &quot;climbed the hill&quot; to a good solution

## Genetic Algorithms
A subcategory of Metaheuristics that borrows concepts from evolutionary biology.<br>
Rather than testing a single solution at a time, these use a population of candidate solutions and through a process of not-so-natural selection &quot;evolve&quot; a good solution.<br>
Let&apos;s walk through what that means below using this project as an example.
### Goal
The algorithm stops when one of two things happens: we reach our ideal solution or (more likely) we run out of time, here measured in generations.
>Given a target image, e.g. The Mona Lisa, we want to recreate it as closely as possible using a number of colored polygons.
### Setup
We start with a _population_ of candidate solutions called _organisms_.<br>
Each organism has a set of _chromosomes_ that represent its attempt at a solution.<br>
The first generation is created randomly.
>In our case, each chromosome encodes a single polygon - a list of (x,y) points and a color. Each organism has a list of chromosomes that comprise its solution.
### Evaluation
We then apply a _fitness function_ to each organism, assigning it a score based on how good of a solution it is.
>Here that means rendering an organism&apos;s polygons to a canvas and then comparing that canvas pixel by pixel to the target image. At each pixel we subtract the difference between what the value should be and what the organism produced.
### Selection
Once everybody has a score, it&apos;s time to reproduce!<br>
Using a _selection_ algorithm, we choose organisms from the population, typically two, as parent(s) and breed them to produce two new offspring. There are a variety of selection methods out there.
>In this project you can choose between Tournament Selection, Roulette Selection, and Stochastic Universal Sampling. More info on each can be found in the Resources section.
### Reproduction
Breeding our newly chosen parents consists of two operations:<br>
_Crossover_ - a recombination of the parents&apos; chromosomes to produce two new sets in their offspring.
>We randomly choose an index (or multiple indices) in the list of polygons as a crossover point and swap the polygons after that point.

_Mutation_ - randomly tweaking values in the offspring&apos;s chromosomes to introduce more variety<br>
>Here we have a number of ways to mutate chromosomes:
>- Tweaking the position and color of each polygon
>- Adding or removing sides from a polygon
>- Adding or removing a polygon all together
>- Permuting the order of polygons

### Replacement
Lastly, we replace the previous generation of organisms with the new generation of children.<br>
This process repeats until an organism in the population hits our target or run out of time.


# The Demo Site
TL;DR: We&apos;re trying to randomly &quot;evolve&quot; a bunch of polygons to look like the Mona Lisa.
Think the Mona Lisa is overrated? Got you covered, just drag n&apos; drop any image to be a target!
## Site Tour
The *Gallery* page shows example runs of famous works of art. You can download the gif timelapses of any.
The *Experiment* tab lets you set up and run new simulations. Queue up as many as you like and hit "play" to watch them go.
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
    - All the React components
  > constants
    - Type definitions and config values
  > contexts
    - PopulationService
  > features
    - Redux slices, hooks, and sagas
  > global
    - database service
  > models
    - Most all of the Genetic Algorithm specific code
  > test
  > utils
  > web-workers
    - fitnessEvaluator - i.e. the fitness evaluation computations
```
