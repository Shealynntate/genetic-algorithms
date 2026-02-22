import { type GenerationTimings } from '../population/types'

/**
 * Accumulates GenerationTimings samples and computes aggregate statistics.
 */
export class PerformanceMetrics {
  private samples: GenerationTimings[] = []

  record(timings: GenerationTimings): void {
    this.samples.push(timings)
  }

  get count(): number {
    return this.samples.length
  }

  /**
   * Computes mean, median, and p95 across all timing fields.
   */
  aggregate(): Record<
    keyof GenerationTimings,
    { mean: number; median: number; p95: number }
  > {
    const fields: (keyof GenerationTimings)[] = [
      'selectionMs',
      'reproductionMs',
      'fitnessEvalMs',
      'statsMs',
      'totalMs'
    ]

    const result = {} as Record<
      keyof GenerationTimings,
      { mean: number; median: number; p95: number }
    >

    for (const field of fields) {
      const values = this.samples
        .map((s) => s[field])
        .sort((a, b) => a - b)
      const n = values.length

      if (n === 0) {
        result[field] = { mean: 0, median: 0, p95: 0 }
        continue
      }

      const sum = values.reduce((a, b) => a + b, 0)
      const mean = sum / n
      const median =
        n % 2 === 0
          ? (values[n / 2 - 1] + values[n / 2]) / 2
          : values[Math.floor(n / 2)]
      const p95Index = Math.min(Math.ceil(n * 0.95) - 1, n - 1)
      const p95 = values[p95Index]

      result[field] = {
        mean: round(mean),
        median: round(median),
        p95: round(p95)
      }
    }

    return result
  }

  /**
   * Formats aggregate metrics as a readable ASCII table for console output.
   */
  formatMetricsTable(): string {
    const agg = this.aggregate()
    const header = `Performance Metrics (${this.samples.length} generations)`
    const divider = '-'.repeat(60)
    const colHeader = padRow('Phase', 'Mean', 'Median', 'P95')

    const rows = [
      padRow('Selection', fmt(agg.selectionMs), fmt(agg.selectionMs, 'median'), fmt(agg.selectionMs, 'p95')),
      padRow('Reproduction', fmt(agg.reproductionMs), fmt(agg.reproductionMs, 'median'), fmt(agg.reproductionMs, 'p95')),
      padRow('Fitness Eval', fmt(agg.fitnessEvalMs), fmt(agg.fitnessEvalMs, 'median'), fmt(agg.fitnessEvalMs, 'p95')),
      padRow('Stats', fmt(agg.statsMs), fmt(agg.statsMs, 'median'), fmt(agg.statsMs, 'p95')),
      padRow('Total', fmt(agg.totalMs), fmt(agg.totalMs, 'median'), fmt(agg.totalMs, 'p95'))
    ]

    return [header, divider, colHeader, divider, ...rows, divider].join('\n')
  }

  reset(): void {
    this.samples = []
  }
}

function round(n: number): number {
  return Math.round(n * 1000) / 1000
}

function padRow(
  label: string,
  mean: string,
  median: string,
  p95: string
): string {
  return `${label.padEnd(16)} ${mean.padStart(10)} ${median.padStart(10)} ${p95.padStart(10)}`
}

function fmt(
  stats: { mean: number; median: number; p95: number },
  field: 'mean' | 'median' | 'p95' = 'mean'
): string {
  return `${stats[field].toFixed(3)}ms`
}
