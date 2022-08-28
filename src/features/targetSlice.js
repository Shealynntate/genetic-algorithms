/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: 'hello friend',
};

export const targetSlice = createSlice({
  name: 'target',
  initialState,
  reducers: {
    setTarget: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { setTarget } = targetSlice.actions;

export default targetSlice.reducer;
