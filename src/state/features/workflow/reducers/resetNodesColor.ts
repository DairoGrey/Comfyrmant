import { Draft } from '@reduxjs/toolkit';

import type { WorkflowState } from '../slice';

export const resetNodesColor = (state: Draft<WorkflowState>) => {
  state.nodes.forEach((node) => {
    if (node.data?.color) {
      delete node.data.color;
    }
  });
};
