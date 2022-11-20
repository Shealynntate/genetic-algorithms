/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import square from '../assets/red_square_test.png';

const initialState = {
  populationSize: 50,
  mutationRate: 0.1,
  triangleCount: 2,
  target: square,
};

export const metadataSlice = createSlice({
  name: 'metadata',
  initialState,
  reducers: {
    setPopulationSize: (state, action) => {
      state.populationSize = action.payload;
    },
    setMutationRate: (state, action) => {
      state.mutationRate = action.payload;
    },
    setTarget: (state, action) => {
      state.target = action.payload;
    },
    setTriangles: (state, action) => {
      state.triangleCount = action.payload;
    },
  },
});

export const {
  setMutationRate,
  setPopulationSize,
  setTarget,
  setTriangles,
} = metadataSlice.actions;

export default metadataSlice.reducer;
