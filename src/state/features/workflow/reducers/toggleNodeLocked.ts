import { Draft, PayloadAction } from '@reduxjs/toolkit';

import type { WorkflowState } from '../slice';

export const toggleNodeLocked = (state: Draft<WorkflowState>, action: PayloadAction<string>) => {
  const id = action.payload;

  const node = state.nodes.find((node) => node.id === id);

  if (node) {
    node.data.locked = !node.data.locked;

    node.connectable = !node.data.locked;
    node.deletable = !node.data.locked;
    node.draggable = !node.data.locked;
    node.focusable = !node.data.locked;
  }
};
