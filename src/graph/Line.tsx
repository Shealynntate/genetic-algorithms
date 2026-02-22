import { curveMonotoneY } from '@visx/curve'
import { LinePath } from '@visx/shape'

import { type GenerationStatsRecord } from '../population/types'
import theme from '../theme'

interface LineProps {
  data: GenerationStatsRecord[]
  x: (value: GenerationStatsRecord) => number
  y: (value: GenerationStatsRecord) => number
  color: string
  type: string
  width: number
}

Line.defaultProps = {
  data: [],
  type: 'solid',
  width: 1,
  color: theme.palette.primary.main
}

function Line({ data, x, y, color, type, width }: LineProps): JSX.Element {
  return (
    <LinePath<GenerationStatsRecord>
      data={data}
      x={x}
      y={y}
      curve={curveMonotoneY}
      shapeRendering="geometricPrecision"
      stroke={color}
      strokeWidth={width}
      strokeDasharray={type === 'dashed' ? '1,3' : undefined}
    />
  )
}

export default Line
