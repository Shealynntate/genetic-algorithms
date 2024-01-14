import React from 'react'
import { Stack, Typography } from '@mui/material'
import Panel from '../common/Panel'
import ExampleText from '../common/ExampleText'
import Keyword from '../common/Keyword'
import SectionTitle from '../common/SectionTitle'

function AlgorithmPanel (): JSX.Element {
  return (
    <Panel label="The Algorithm" px={2} pb={2}>
      <SectionTitle>Goal</SectionTitle>
      <Typography>
        The alorithm stops when one of two things happens: we reach our ideal solution or
        (more likely) we run out of time, here measured in generations.
        <ExampleText>
          Given a target image, e.g. The Mona Lisa, we want to recreate it as closely
          as possible using a number of colored polygons.
        </ExampleText>
      </Typography>
      <SectionTitle>Setup</SectionTitle>
      <Typography>
        We start with a
        <Keyword>Population</Keyword>
        of candidate solutions called
        <Keyword>Organisms</Keyword>
        . Each organism has a set of
        <Keyword>Chromosomes</Keyword>
        that represent its attempt at a solution. The first generation is created randomly.
        <ExampleText>
          In our case, each chromosome encodes a single polygon - a list of (x,y) points
          and a color. Each organism has a list of chromosomes that comprise its solution.
        </ExampleText>
      </Typography>
      <SectionTitle>Evaluation</SectionTitle>
      <Typography>
        We then apply a
        <Keyword>Fitness Function</Keyword>
        to each organism - assigning
        it a score based on how good of a solution it is.
        <ExampleText>
          Here that means rendering an organism&apos;s polygons to a canvas and then comparing
          that canvas pixel by pixel to the target image. At each pixel we subtract the difference
          between what the value should be and what the organism produced.
        </ExampleText>
      </Typography>
      <SectionTitle>Selection</SectionTitle>
      <Typography>
        Once everybody has a score, it&apos;s time to reproduce! Using a
        <Keyword>Selection</Keyword>
        algorithm, we choose organisms from the population, typically two, as parent(s)
        and breed them to produce two new offspring.
        There are a variety of selection methods out there.
        <ExampleText>
          In this project you can choose between Tournament Selection, Roulette Selection, and
          Stochastic Universal Sampling. More info on each can be found in the Resources section.
        </ExampleText>
      </Typography>
      <SectionTitle>Reproduction</SectionTitle>
      <Typography>
        Breeding our newly chosen parents consists of two operations:
      </Typography>
      <Typography>
        <Keyword pl="0">Crossover</Keyword>
        - a recombination of the parents&apos; chromosomes to produce two new sets
        in their offspring.
        <ExampleText>
          We randomly choose an index (or multiple indices) in the list of polygons as a crossover
          point and swap the polygons after that point.
        </ExampleText>
      </Typography>
      <Typography>
        <Keyword pl="0">Mutation</Keyword>
        - randomly tweaking values in the offspring&apos;s chromosomes to introduce more variety
        <ExampleText>
          Here we have a number of ways to mutate chromosomes:
        </ExampleText>
      </Typography>
      <Stack pt={0.6} pl={1} spacing={0.6}>
        <ExampleText>
          - Tweaking the position and color of each polygon
        </ExampleText>
        <ExampleText>
          - Adding or removing sides from a polygon
        </ExampleText>
        <ExampleText>
          - Adding or removing a polygon all together
        </ExampleText>
        <ExampleText>
          - Permuting the order of polygons
        </ExampleText>
      </Stack>
      <SectionTitle>Replacement</SectionTitle>
      <Typography>
        Lastly, we replace the previous generation of organisms with the new generation of children.
        This process repeats until an organism in the population hits our target or run out of time.
      </Typography>
    </Panel>
  )
}

export default AlgorithmPanel
