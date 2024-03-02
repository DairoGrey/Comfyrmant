import { Draft, PayloadAction } from '@reduxjs/toolkit';

import type { WorkflowState } from '../slice';
import { NodeColor } from '../types';

export const updateNodeColor = (
  state: Draft<WorkflowState>,
  action: PayloadAction<{ id: string; color: NodeColor }>,
) => {
  const { id, color } = action.payload;

  const nodeData = state.nodes.find((node) => node.id === id)?.data;

  if (nodeData) {
    nodeData.color = color;
  }
};
