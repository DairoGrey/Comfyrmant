import { Draft } from '@reduxjs/toolkit';
import { applyPatches } from 'immer';

import type { WorkflowState } from '../slice';

export const redo = (state: Draft<WorkflowState>) => {
  if (state.changes.index > state.changes.stack.length - 1) {
    return;
  }

  state.changes.index++;

  const patch = state.changes.stack[state.changes.index];

  if (patch.edges) {
    state.edges = applyPatches(state.edges, patch.edges.apply);
  }

  if (patch.nodes) {
    state.nodes = applyPatches(state.nodes, patch.nodes.apply);
  }
};
