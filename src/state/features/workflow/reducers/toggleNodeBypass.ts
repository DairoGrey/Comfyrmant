import { Draft, PayloadAction } from '@reduxjs/toolkit';

import type { WorkflowState } from '../slice';

export const toggleNodeBypass = (state: Draft<WorkflowState>, action: PayloadAction<string>) => {
  const id = action.payload;

  const node = state.nodes.find((node) => node.id === id);
  const nodeData = node?.data;

  if (nodeData) {
    nodeData.bypass = !nodeData.bypass;
  }
};
