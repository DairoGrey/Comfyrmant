import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import * as uuid from 'uuid';

type Workspace = {
  id: string;
  title: string;
  settings: Record<string, unknown>;
  nodes: unknown[];
  edges: unknown[];
  previewUrl?: string;
};

type WorkspacesState = Record<string, Workspace>;

const initialState: WorkspacesState = {};

const workspacesSlice = createSlice({
  name: 'workspaces',
  initialState,
  reducers: {
    create(
      state,
      action: PayloadAction<{ title: string; settings: any; nodes: any[]; edges: any[]; previewUrl?: string }>,
    ) {
      const { title, settings, nodes, edges, previewUrl } = action.payload;

      const id = uuid.v4();
      state[id] = {
        id,
        title,
        settings,
        nodes,
        edges,
        previewUrl,
      };
    },
    remove(state, action: PayloadAction<string>) {
      delete state[action.payload];
    },
  },
});

export default workspacesSlice;

export const { create, remove } = workspacesSlice.actions;
