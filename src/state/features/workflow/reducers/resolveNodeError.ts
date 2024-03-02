import { Draft, PayloadAction } from '@reduxjs/toolkit';

import type { WorkflowState } from '../slice';

export const resolveNodeError = (state: Draft<WorkflowState>, action: PayloadAction<{ id: string; error: string }>) => {
  const { id, error } = action.payload;

  const nodeData = state.nodes.find((node) => node.id === id)?.data;

  if (!nodeData) {
    return;
  }

  if (!nodeData.errors) {
    return;
  }

  delete nodeData.errors[error];
};
