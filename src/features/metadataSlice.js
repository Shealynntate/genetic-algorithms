/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import square from '../assets/red_square_test.png';

const initialState = {
  populationSize: 10,
  mutationRate: 0.01,
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
  },
});

export const {
  setMutationRate,
  setPopulationSize,
  setTarget,
} = metadataSlice.actions;

export default metadataSlice.reducer;
