import React from 'react'
import { Link, Stack, Typography } from '@mui/material'
import Panel from '../common/Panel'
import Keyword from '../common/Keyword'
import SectionTitle from '../common/SectionTitle'
import { projectUrl } from '../constants/constants'

function ProjectPanel (): JSX.Element {
  return (
    <Panel label="This Project" px={2}>
      <SectionTitle>Things I&apos;ve Learned</SectionTitle>
      <Typography>
        <Keyword pl="0rem">Plateaus</Keyword>
        - Most images of any complexity seem to experience a fitness plateau around the 97%
        mark. I tried so many things to avoid this and all of them just made things worse...
      </Typography>
      <Stack py={1} pl={2} spacing={0.8}>
        <Typography>
          - &quot;Speciation&quot; - splitting the population in to subgroups and letting them
          evolve separately. Then when the fitness stagnated I&apos;d have the two
          populations mate with each other.
        </Typography>
        <Typography>
          - &quot;Disruption Events&quot; if stagnation was detected,
          i.e. A brief period of increased mutation rates in an attempt to shake the population
          out of a local optimum.
        </Typography>
        <Typography>
          - Mitosis mechanism -
          if a chromosome tried to add a point, but was already at the max, it would
          instead split into two new polygons. Conversely, if it tried to remove a point and was
          already at the minimum it would delete the chromosome.
          Here I thought I was being clever... I was not, it mostly seemed to cause these cyclical
          dips in fitness variation every few generations.
        </Typography>
      </Stack>
      <Typography>
        I think when it&apos;s that close to the target, most mutations are going to be deleterious,
        so achieving those last few percentage points are going to be slow no matter what.
      </Typography>
      <Typography pt={0.6}>
        <Keyword pl="0rem">Crossover</Keyword>
        - My tests showed that having crossover was important, but it didn&apos;t really seem to
        matter which type. I could get comparable results with all of them. Probably this is related
        to the fact that mutation includes permutation of the chromosome order.
      </Typography>
      <Typography pt={0.6}>
        <Keyword pl="0rem">Population Size</Keyword>
        - Increasing population size wasn&apos;t as impactful as I was hoping. Often the results
        from a 200 run would look indistinguishable from a 300 or 400 run. Generally larger
        sizes make the increase over time smoother, but it definitely isn&apos;t
        a linear relationship.
      </Typography>

      <SectionTitle>The Site</SectionTitle>
      <Typography>
        If you&apos;d like more info on the website itself and/or you want to view the source code,
        check it out on the
        <Link
          href={projectUrl}
          underline="hover"
          pl={1}
        >
          Github repo!
        </Link>
      </Typography>
    </Panel>
  )
}

export default ProjectPanel
