import { createSlice } from '@reduxjs/toolkit';

type ChangesState = Record<string, unknown>;

const initialState: ChangesState = {};

const changesSlice = createSlice({
  name: 'changes',
  initialState,
  reducers: {},
});

export default changesSlice;
