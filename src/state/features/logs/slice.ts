import { createSlice } from '@reduxjs/toolkit';

type LogsState = Record<string, unknown>;

const initialState: LogsState = {};

const logsSlice = createSlice({
  name: 'logs',
  initialState,
  reducers: {},
});

export default logsSlice;
