import { Draft, PayloadAction } from '@reduxjs/toolkit';

import type { WorkflowState } from '../slice';

export const addNodeTag = (state: Draft<WorkflowState>, action: PayloadAction<{ id: string; tag: string }>) => {
  const { id, tag } = action.payload;

  const nodeData = state.nodes.find((node) => node.id === id)?.data;

  if (!nodeData) {
    return;
  }

  if (!nodeData.tags) {
    nodeData.tags = [];
  }

  nodeData.tags.push(tag);
};
