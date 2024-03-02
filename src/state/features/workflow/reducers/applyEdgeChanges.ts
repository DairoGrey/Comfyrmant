import type { EdgeChange } from 'reactflow';
import * as ReactFlow from 'reactflow';

import { Draft, PayloadAction } from '@reduxjs/toolkit';
import { produce } from 'immer';

import type { WorkflowState } from '../slice';

import { updateChangesStack } from './changes';

const edgeChangeFilter = (changes: EdgeChange[]) =>
  changes.filter((change) => {
    if (change.type === 'add') {
      return true;
    }

    if (change.type === 'reset') {
      return true;
    }

    if (change.type === 'remove') {
      return true;
    }

    return false;
  });

export const applyEdgeChanges = (state: Draft<WorkflowState>, action: PayloadAction<EdgeChange[]>) => {
  const edges = ReactFlow.applyEdgeChanges(action.payload, state.edges);

  produce(
    state.edges,
    (edges) => ReactFlow.applyEdgeChanges(edgeChangeFilter(action.payload), edges),
    updateChangesStack(state, 'edges'),
  );

  state.edges = edges;
};
