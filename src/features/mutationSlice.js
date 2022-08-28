/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: 0.01,
};

export const mutationSlice = createSlice({
  name: 'mutation',
  initialState,
  reducers: {
    setMutation: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { setMutation } = mutationSlice.actions;

export default mutationSlice.reducer;
