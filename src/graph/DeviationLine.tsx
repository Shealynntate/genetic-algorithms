import { curveMonotoneX } from '@visx/curve'
import { Threshold } from '@visx/threshold'

import Line from './Line'
import { type GenerationStatsRecord } from '../population/types'

interface DeviationLineProps {
  id: number
  color: string
  data?: GenerationStatsRecord[]
  xScale: (value: number) => number
  yScale: (value: number) => number
  yMax: number
}

function DeviationLine({
  color,
  data = [],
  id,
  xScale,
  yScale,
  yMax
}: DeviationLineProps): JSX.Element {
  return (
    <>
      <Threshold
        id={`id-${id}`}
        data={data}
        x={({ stats }) => xScale(stats.gen)}
        y0={({ stats }) => yScale(stats.meanFitness - stats.deviation)}
        y1={({ stats }) => yScale(stats.meanFitness + stats.deviation)}
        curve={curveMonotoneX}
        clipAboveTo={0}
        clipBelowTo={yMax}
        belowAreaProps={{
          fill: color,
          fillOpacity: 0.1
        }}
        aboveAreaProps={{
          fill: color,
          fillOpacity: 0.1
        }}
      />
      <Line
        data={data}
        x={({ stats }) => xScale(stats.gen)}
        y={({ stats }) => yScale(stats.meanFitness - stats.deviation)}
        color={color}
        width={0.3}
      />
      <Line
        data={data}
        x={({ stats }) => xScale(stats.gen)}
        y={({ stats }) => yScale(stats.meanFitness + stats.deviation)}
        color={color}
        width={0.3}
      />
    </>
  )
}

export default DeviationLine
