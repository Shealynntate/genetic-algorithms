import React from 'react'
import { Stack, Typography } from '@mui/material'
import Panel from '../common/Panel'
import SectionTitle from '../common/SectionTitle'
import Keyword from '../common/Keyword'
import ExampleText from '../common/ExampleText'

function OverviewPanel (): JSX.Element {
  return (
    <Panel label="Overview" px={2} pb={2}>
      <SectionTitle>Metaheuristics</SectionTitle>
      <Typography>
        A set of techniques that are useful for solving a hard problem
        that typically has these characteristics:
      </Typography>
      <Stack pt={0.6} pl={1} pb={0.6} spacing={0.6}>
        <Typography>
          - It&apos;s not obvious how to find a solution to the problem
        </Typography>
        <Typography>
          - But it&apos;s easy to check if a solution is good, or at least better than another one
        </Typography>
        <Typography>
          - The solution space is so large that simple brute force, trial and error isn&apos;t
          going to work
        </Typography>
      </Stack>
      <Typography>
        Metaheuristics are a type of
        <Keyword>stochastic optimization</Keyword>
        - algorithms that use some randomness to find a solution.
      </Typography>
      <Typography>
        Many of them can be boiled down to a simple concept called
        <Keyword>hill climbing:</Keyword>
      </Typography>
      <Stack pt={0.6} pl={1} spacing={0.6}>
        <Typography>
          - Pick a random solution as your starting point
          (it&apos;ll probably be bad, that&apos;s okay)
        </Typography>
        <Typography>
          - Randomly tweak it a bit to get a slightly different solution
        </Typography>
        <Typography>
          - Is the new one better? Awesome, keep it, otherwise keep the original
        </Typography>
        <Typography>
          - Repeat until you&apos;ve &quot;climbed the hill&quot; to a good solution
        </Typography>
      </Stack>
      <SectionTitle>Genetic Algorithms</SectionTitle>
      <Typography sx={{ display: 'inline-block' }}>
        A subcategory of Metaheuristics that borrows concepts from evolutionary biology.
        Rather than testing a single solution at a time, these use a population of candidate
        solutions and through a process of not-so-natural selection &quot;evolve&quot;
        a good solution.
      </Typography>
      <br />
      <br />
      <Typography>
        Let&apos;s walk through what that means below using this project as an example.
        <ExampleText>The example text will be in this color.</ExampleText>
      </Typography>
    </Panel>
  )
}

export default OverviewPanel
