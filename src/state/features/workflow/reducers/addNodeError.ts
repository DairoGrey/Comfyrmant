import { Draft, PayloadAction } from '@reduxjs/toolkit';

import type { WorkflowState } from '../slice';
import { NodeErrorState } from '../types';

export const addNodeError = (
  state: Draft<WorkflowState>,
  action: PayloadAction<{ id: string; error: NodeErrorState }>,
) => {
  const { id, error } = action.payload;

  const nodeData = state.nodes.find((node) => node.id === id)?.data;

  if (!nodeData) {
    return;
  }

  if (!nodeData.errors) {
    nodeData.errors = {};
  }

  nodeData.errors[error.name] = error;
};
