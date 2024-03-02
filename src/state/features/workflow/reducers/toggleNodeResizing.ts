import { Draft, PayloadAction } from '@reduxjs/toolkit';

import type { WorkflowState } from '../slice';

export const toggleNodeResizing = (state: Draft<WorkflowState>, action: PayloadAction<string>) => {
  const id = action.payload;

  const nodeData = state.nodes.find((node) => node.id === id)?.data;

  if (nodeData) {
    nodeData.resizing = !nodeData.resizing;
  }
};
