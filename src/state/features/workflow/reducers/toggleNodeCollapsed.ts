import { Draft, PayloadAction } from '@reduxjs/toolkit';

import type { WorkflowState } from '../slice';

export const toggleNodeCollapsed = (state: Draft<WorkflowState>, action: PayloadAction<string>) => {
  const id = action.payload;

  const node = state.nodes.find((node) => node.id === id);
  const nodeData = node?.data;

  if (node) {
    delete node.style;
  }

  if (nodeData) {
    nodeData.collapsed = !nodeData.collapsed;
  }
};
