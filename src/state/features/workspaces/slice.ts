import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import * as uuid from 'uuid';

type Workspace = {
  settings: unknown;
  workflow: unknown;
};

type WorkspacesState = Record<string, Workspace>;

const initialState: WorkspacesState = {};

const workspacesSlice = createSlice({
  name: 'workspaces',
  initialState,
  reducers: {
    create(state, action: PayloadAction<{ settings: unknown; workflow: unknown }>) {
      const { settings, workflow } = action.payload;

      const id = uuid.v4();
      state[id] = {
        settings,
        workflow,
      };
    },
    remove(state, action: PayloadAction<string>) {
      delete state[action.payload];
    },
  },
});

export default workspacesSlice;

export const { create, remove } = workspacesSlice.actions;
