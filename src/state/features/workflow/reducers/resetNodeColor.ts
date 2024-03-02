import { Draft, PayloadAction } from '@reduxjs/toolkit';

import type { WorkflowState } from '../slice';

export const resetNodeColor = (state: Draft<WorkflowState>, action: PayloadAction<{ id: string }>) => {
  const { id } = action.payload;

  const nodeData = state.nodes.find((node) => node.id === id)?.data;

  if (nodeData?.color) {
    delete nodeData.color;
  }
};
