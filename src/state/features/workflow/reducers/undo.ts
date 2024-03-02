import { Draft } from '@reduxjs/toolkit';
import { applyPatches } from 'immer';

import type { WorkflowState } from '../slice';

export const undo = (state: Draft<WorkflowState>) => {
  if (state.changes.index < 0) {
    return;
  }

  const patch = state.changes.stack[state.changes.index];

  if (patch.edges) {
    state.edges = applyPatches(state.edges, patch.edges.rollback);
  }

  if (patch.nodes) {
    state.nodes = applyPatches(state.nodes, patch.nodes.rollback);
  }

  state.changes.index--;
};
