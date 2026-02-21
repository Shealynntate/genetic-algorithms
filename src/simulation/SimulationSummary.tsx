import React from 'react'
import { Box, Stack, Tooltip, Typography } from '@mui/material'
import Grid2 from '@mui/material/Unstable_Grid2/Grid2'
import { mutationProbabilityTypes } from '../population/types'
import { type Simulation } from '../database/types'
import NumberDisplay from '../common/NumberDisplay'
import TextDisplay from '../common/TextDisplay'
import { MutationProbabilityFormFields } from '../parameters/config'

interface SimulationSummaryProps {
  simulation: Simulation
}

function SimulationSummary({
  simulation
}: SimulationSummaryProps): JSX.Element {
  const { parameters } = simulation
  const imageHeight = 100
  const imageWidth = 100

  return (
    <Grid2 container>
      <Grid2 xs={6} md={6} pr={5}>
        <Typography color="primary" mb={1}>
          Population
        </Typography>
        <Box>
          <img
            src={parameters.population.target}
            height={imageHeight}
            width={imageWidth}
          />
        </Box>
        <Box>
          <NumberDisplay
            value={parameters.population.size}
            text="Size"
            tooltip="How many organisms are in the population"
          />
          <NumberDisplay
            value={parameters.population.minGenomeSize}
            text="Min △"
            tooltip="Min number of chromosomes (polygons) an organism can have"
          />
          <NumberDisplay
            value={parameters.population.maxGenomeSize}
            text="Max △"
            tooltip="Max number of chromosomes (polygons) an organism can have"
          />
          <NumberDisplay
            value={parameters.population.minPoints}
            text="Min Sides"
            tooltip="Min number of points a chromosome (polygon) can have"
          />
          <NumberDisplay
            value={parameters.population.maxPoints}
            text="Max Sides"
            tooltip="Max number of points a chromosome (polygon) can have"
          />
        </Box>
        <Typography color="primary" mt={1} mb={1}>
          Crossover
        </Typography>
        <TextDisplay value={parameters.population.crossover.type} text="Type" />
        <NumberDisplay
          value={parameters.population.crossover.probabilities.swap}
          text="Swap"
          tooltip="Probability of swapping chromosomes"
        />
        <Typography color="primary" my={1}>
          Stop Criteria
        </Typography>
        <NumberDisplay
          value={parameters.stopCriteria.targetFitness}
          text="Target Fitness"
        />
        <NumberDisplay
          value={parameters.stopCriteria.maxGenerations}
          text="Max Gens"
        />
      </Grid2>

      <Grid2 xs={12} md={6}>
        <Typography color="primary" mb={1}>
          Mutation
        </Typography>
        <Typography color="GrayText">Probabilities</Typography>
        <Stack>
          {mutationProbabilityTypes.map((key) => (
            <NumberDisplay
              key={key}
              value={parameters.population.mutation.probabilities[key]}
              text={MutationProbabilityFormFields[key].text}
              tooltip={MutationProbabilityFormFields[key].tooltip}
            />
          ))}
        </Stack>
        <Tooltip title="The sigma parameter for a normal distribution">
          <Typography color="GrayText">Distributions</Typography>
        </Tooltip>
        <NumberDisplay
          value={parameters.population.mutation.distributions.colorSigma}
          text="Color"
          tooltip="Should tweak mutations apply\nonce per gene or should each\npoint and color have a uniform\nchance of being tweaked"
        />
        <NumberDisplay
          value={parameters.population.mutation.distributions.pointSigma}
          text="Point"
          tooltip="How far a point (x,y) can get nudged"
        />
        <Typography color="primary" mb={1}>
          Selection
        </Typography>
        <TextDisplay
          value={parameters.population.selection.type}
          text="Type"
          tooltip={
            'Mechanism for selecting parents:\n-Tournament\n-Roulette\n-Stochastic Universal Sampling\n(more info on Github)'
          }
        />
        <NumberDisplay
          value={parameters.population.selection.eliteCount}
          text="Elites"
        />
        <NumberDisplay
          value={parameters.population.selection.tournamentSize}
          text="Tourney Size"
        />
      </Grid2>
    </Grid2>
  )
}

export default SimulationSummary
