
# Genetic Algorithms
<p align="center" width="100%">
  <img src="/src/assets/readme/mona_lisa.gif" />
  <img src="/src/assets/readme/son_of_man.gif" />
  <img src="/src/assets/readme/surprised_pikachu.gif" />
  <h5 align="center">Reproducing images by evolving populations of polygons</h5>
  <p align="center">Visit the <a href="https://genetic-algorithms-1.web.app/">site</a> to learn more and try it yourself!</p>
</p>

- [Genetic Algorithms](#genetic-algorithms)
- [Genetic Algorithms Overview](#genetic-algorithms-overview)
  - [Metaheuristics](#metaheuristics)
  - [Genetic Algorithms](#genetic-algorithms-1)
    - [Goal](#goal)
    - [Setup](#setup)
    - [Evaluation](#evaluation)
    - [Selection](#selection)
    - [Reproduction](#reproduction)
    - [Replacement](#replacement)
- [Things I've Learned Trying to Recreate the Mona Lisa](#things-ive-learned-trying-to-recreate-the-mona-lisa)
  - [Plateaus](#plateaus)
    - [Speciation](#speciation)
    - [Disruption Events](#disruption-events)
    - [Mitosis mechanism](#mitosis-mechanism)
  - [Crossover](#crossover)
  - [Population Size](#population-size)
- [This Site](#this-site)
  - [Site Tour](#site-tour)
    - [Gallery](#gallery)
    - [Your Art](#your-art)
    - [Experiment](#experiment)
- [Running The Code](#running-the-code)
  - [Troubleshooting](#troubleshooting)
    - [Mac](#mac)
- [Site Architecture](#site-architecture)
    - [Site Structure](#site-structure)
- [Resources](#resources)

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

# Things I've Learned Trying to Recreate the Mona Lisa
I spent a _lot_ of time trying to tune the hyperparameters of this particular Genetic Algorithm
demo in order reach a higher maximum. I knew I wouldn't ever get a small number of polygons
to perfectly recreate a painting (also there's something almost anticlimactic about it being a photocopy of the original, like "here's the image you gave me, but with a million more steps"), but it seemed like there was another percent or two to eek out of the model if I could only get the settings right.
Here are a few of my findings along the way.

## Plateaus
Most images of any complexity seem to experience a fitness plateau around the 95 - 97% mark, depending on the image.
This was good, but I had a strong suspicion it could be a percent or so better. Partly because it just didn't look good enough to me, and partly because even if I added 5 or 10 more polygons, the percent didn't seem to increase much at all. If the model was actually utilizing all the polygons decently, adding that many more should have made a difference.
I tried so many things to avoid this and all of them just made things worse...

### Speciation
I tried splitting the population in to subgroups and letting them evolve separately.
Then when the fitness stagnated I'd have the two populations mate with each other.

### Disruption Events
I tried adding disruption events if stagnation was detected,
i.e. a brief period of increased mutation rates in an attempt to shake the population out of a local optimum.

### Mitosis mechanism
If a chromosome tried to add a point, but was already at the max number, it would instead split into two new polygons.
Conversely, if it tried to remove a point and was already at the minimum it would delete the chromosome.
Here I thought I was being clever... I was not, it mostly seemed to cause these cyclical dips in fitness variation every few generations.

I think when it's that close to the target, most mutations are going to be deleterious, so achieving those last few percentage points are going to be slow no matter what.

## Crossover
My tests showed that having crossover was important, but it didn't really seem to
matter which type. I could get comparable results with all of them. Probably this is related
to the fact that mutation includes permutation of the chromosome order.
    
## Population Size
Increasing population size wasn't as impactful as I was hoping. Often the results
from a 200 run would look indistinguishable from a 300 or 400 run. Generally larger
sizes make the increase over time smoother, but it definitely isn't
a linear relationship.

# This Site
This is an interactive demo of Genetic Algorithms.
Our organisms' DNA is an array of semi-transparent polygons and we're trying to evolve them to look like the Mona Lisa
(or any other image of your choosing).

## Site Tour
### Gallery
This page shows a collection of example runs, along with some of their stats. You can download the gif timelapses of any.

### Your Art
The results from your experiments will be displayed here. You can download the gif timelapses here as well.

### Experiment
This page lets you set up and run new simulations. Queue up as many as you like and hit "play" to watch them go.
You can pause and end the run early or let it evolve until it hits a stopping point -
either it reaches the target fitness (yay) or max number of generations.

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

# Resources
Full credit to Robert Johansson for this project idea. [Genetic Programming: Evolution of the Mona Lisa](https://rogerjohansson.blog/2008/12/07/genetic-programming-evolution-of-mona-lisa/)

Here&apos;s a list of other resources I used while working on this project:

[Essentials of Metaheuristics](https://cs.gmu.edu/~sean/book/metaheuristics/Essentials.pdf)

[Analyzing Mutation Schemes for Real-Parameter Genetic Algorithms](https://www.egr.msu.edu/~kdeb/papers/k2012016.pdf)

[Choosing Mutation and Crossover Ratios for Genetic Algorithms](https://pdfs.semanticscholar.org/5a25/a4d30528160eef96adbce1d7b03507ebd3d7.pdf)

[Analyzing the Performance of Mutation Operators to Solve the Traveling Salesman Problem](https://arxiv.org/pdf/1203.3099.pdf)
          
[Initial Population for Genetic Algorithms: A Metric Approach](https://www.researchgate.net/publication/220862320_Initial_Population_for_Genetic_Algorithms_A_Metric_Approach)
      
[Self-Adaptive Simulated Binary Crossover for Real-Parameter Optimization](https://www.researchgate.net/publication/220742263_Self-adaptive_simulated_binary_crossover_for_real-parameter_optimization)

[Genetic Programming Needs Better Benchmarks](http://gpbenchmarks.org/wp-content/uploads/2019/08/paper1.pdf)

[A Genetic Algorithm for Image Recreation — Can it Paint the Mona Lisa?](https://medium.com/@sebastian.charmot/genetic-algorithm-for-image-recreation-4ca546454aaa)