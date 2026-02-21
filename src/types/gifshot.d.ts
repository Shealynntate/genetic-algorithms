declare module 'gifshot' {
  declare function createGIF(
    options: {
      images?: string[] | HTMLImageElement[]
      gifWidth?: number
      gifHeight?: number
      interval?: number
      numFrames?: number
      frameDuration?: number
      fontWeight?: string
      fontSize?: string
      fontFamily?: string
      fontColor?: string
      textAlign?: string
      textBaseline?: string
      sampleInterval?: number
      numWorkers?: number
      progressCallback?: (captureProgress: number) => void
      completeCallback?: (obj: {
        image: string
        cameraStream: MediaStream
        error: string
      }) => void
      saveRenderingContexts?: boolean
      savedRenderingContexts?: CanvasRenderingContext2D[]
      crossOrigin?: string
      fontWeightNormal?: string
      fontWeightBold?: string
      fontPixelSize?: number
      textAlignLeft?: string
      textAlignCenter?: string
      textAlignRight?: string
      textBaselineTop?: string
      textBaselineMiddle?: string
      textBaselineBottom?: string
      textBaselineAlphabetic?: string
      textBaselineHanging?: string
      textBaselineIdeographic?: string
    },
    callback: (obj: {
      image: string
      cameraStream: MediaStream
      error: boolean
      errorCode: number
      errorMsg: string
    }) => void
  ): void
}
