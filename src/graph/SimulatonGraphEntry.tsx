import React, { memo } from 'react'
import { type GenerationStatsRecord } from '../population/types'
import DeviationLine from './DeviationLine'
import Line from './Line'
import theme from '../theme'

const meanLineWidth = 0.8
const minLineWidth = 0.4

interface SimulationGraphEntryProps {
  color?: string
  id: number
  graphHeight: number
  data: GenerationStatsRecord[]
  showDeviation?: boolean
  showMean?: boolean
  showMin?: boolean
  xScale: (value: number) => number
  yScale: (value: number) => number
}

function SimulationGraphEntry({
  color = theme.palette.primary.main,
  data,
  id,
  graphHeight,
  showDeviation = false,
  showMean = false,
  showMin = false,
  xScale,
  yScale
}: SimulationGraphEntryProps): JSX.Element | null {
  return (
    <>
      {showMean && (
        <Line
          data={data}
          x={({ stats }) => xScale(stats.gen)}
          y={({ stats }) => yScale(stats.meanFitness)}
          color={color}
          type="dashed"
          width={meanLineWidth}
        />
      )}
      {showDeviation && (
        <DeviationLine
          id={id}
          data={data}
          color={color}
          xScale={xScale}
          yScale={yScale}
          yMax={graphHeight}
        />
      )}
      {showMin && (
        <Line
          data={data}
          x={({ stats }) => xScale(stats.gen)}
          y={({ stats }) => yScale(stats.minFitness)}
          color={color}
          width={minLineWidth}
        />
      )}
      <Line
        data={data}
        color={color}
        x={({ stats }) => xScale(stats.gen)}
        y={({ stats }) => yScale(stats.maxFitness)}
      />
    </>
  )
}

export default memo(SimulationGraphEntry)
