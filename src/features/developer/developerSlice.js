import { createAction } from '@reduxjs/toolkit';

export const REHYDRATE = 'developer/rehydrate';
export const DOWNLOAD = 'developer/download';

export const rehydrate = createAction(
  REHYDRATE,
  (state) => ({
    type: REHYDRATE,
    payload: state,
  }),
);

export const download = createAction(
  DOWNLOAD,
  (fileName, state) => ({
    type: DOWNLOAD,
    payload: { fileName, state },
  }),
);
