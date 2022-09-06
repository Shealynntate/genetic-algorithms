/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: [],
};

export const generationSlice = createSlice({
  name: 'selectedGeneration',
  initialState,
  reducers: {
    setGeneration: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { setGeneration } = generationSlice.actions;

export default generationSlice.reducer;
