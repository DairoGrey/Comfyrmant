import type { NodeChange } from 'reactflow';
import * as ReactFlow from 'reactflow';

import { Draft, PayloadAction } from '@reduxjs/toolkit';
import { produce } from 'immer';

import type { WorkflowState } from '../slice';

import { updateChangesStack } from './changes';

const nodeChangeFilter = (changes: NodeChange[]) =>
  changes.filter((change) => {
    if (change.type === 'add') {
      return true;
    }

    if (change.type === 'position' && change.position) {
      return true;
    }

    if (change.type === 'dimensions' && change.dimensions) {
      return true;
    }

    return false;
  });

export const applyNodeChanges = (state: Draft<WorkflowState>, action: PayloadAction<NodeChange[]>) => {
  const nodes = ReactFlow.applyNodeChanges(action.payload, state.nodes);

  produce(
    state.nodes,
    (nodes) => ReactFlow.applyNodeChanges(nodeChangeFilter(action.payload), nodes),
    updateChangesStack(state, 'nodes'),
  );

  state.nodes = nodes;
};
