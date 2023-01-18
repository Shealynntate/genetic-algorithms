import { createContext } from 'react';
import theme from '../theme';

const defaultColor = theme.palette.primary.main;

const lineColors = [
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
  theme.palette.success.dark,
];

let index = 0;
const colorMap = {};

const addColor = (id) => {
  colorMap[id] = lineColors[index];
  index = (index + 1) % lineColors.length;
};

const removeColor = (id) => {
  delete colorMap[id];
};

const getColor = (id) => colorMap[id] || defaultColor;

const context = createContext({
  addColor,
  getColor,
  removeColor,
});

export default context;
