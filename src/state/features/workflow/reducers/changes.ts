import { Draft } from '@reduxjs/toolkit';
import { Patch } from 'immer';

import type { WorkflowState } from '../slice';

export const updateChangesStack =
  (state: Draft<WorkflowState>, type: 'edges' | 'nodes') => (apply: Patch[], rollback: Patch[]) => {
    if (process.env.CHANGES === 'off') {
      return;
    }

    const changes = { [type]: { apply, rollback } };

    if (state.changes.index === state.changes.stack.length - 1) {
      state.changes.stack.push(changes);
    } else {
      state.changes.stack = [...state.changes.stack.slice(0, state.changes.index), changes];
    }

    state.changes.index = state.changes.stack.length - 1;
  };
