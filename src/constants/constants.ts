import theme from '../theme'

// ------------------------------------------------------------
export const maxColorValue = 255

export const numColorChannels = 4

export const canvasParameters = {
  width: 200,
  height: 200
}

export const defaultLineColor = theme.palette.primary.main

export const lineColors = [
  theme.palette.primary.main,
  theme.palette.secondary.main,
  theme.palette.error.main,
  theme.palette.warning.main,
  theme.palette.info.main,
  theme.palette.success.main,

  theme.palette.primary.light,
  theme.palette.secondary.light,
  theme.palette.error.light,
  theme.palette.warning.light,
  theme.palette.info.light,
  theme.palette.success.light,

  theme.palette.primary.dark,
  theme.palette.secondary.dark,
  theme.palette.error.dark,
  theme.palette.warning.dark,
  theme.palette.info.dark,
  theme.palette.success.dark
]
