import * as ReactFlow from 'reactflow';
import { Connection, Edge, UpdateEdgeOptions } from 'reactflow';

import { Draft, PayloadAction } from '@reduxjs/toolkit';
import { produce } from 'immer';

import type { WorkflowState } from '../slice';

import { updateChangesStack } from './changes';

export const updateEdge = (
  state: Draft<WorkflowState>,
  action: PayloadAction<{ edge: Edge; connection: Connection; options?: UpdateEdgeOptions }>,
) => {
  const edges = produce(
    state.edges,
    (edges) => ReactFlow.updateEdge(action.payload.edge, action.payload.connection, edges, action.payload.options),
    updateChangesStack(state, 'edges'),
  );

  state.edges = edges;
};
