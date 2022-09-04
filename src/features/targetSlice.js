/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';

const initialState = {
  value: 'hello',
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

export const useMaxFitness = () => {
  const target = useSelector((state) => state.target.value);
  return target.length;
};

export default targetSlice.reducer;
