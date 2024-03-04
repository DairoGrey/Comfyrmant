import * as ReactFlow from 'reactflow';
import { Connection, Edge } from 'reactflow';

import { Draft, PayloadAction } from '@reduxjs/toolkit';
import { produce } from 'immer';

import type { WorkflowState } from '../slice';
import { NodeErrorType } from '../types';

import { updateChangesStack } from './changes';

export const addEdge = (state: Draft<WorkflowState>, action: PayloadAction<Edge | Connection>) => {
  const edges = produce(
    state.edges,
    (edges) => {
      const { source, sourceHandle, target, targetHandle } = action.payload;

      const id = `${source}:${sourceHandle}->${target}:${targetHandle}`;
      const newEdges = ReactFlow.addEdge({ ...action.payload, id }, edges);

      const edgesToInput = newEdges.filter(
        (edge) => edge.target === action.payload.target && edge.targetHandle === action.payload.targetHandle,
      );

      if (edgesToInput.length > 1) {
        return newEdges.filter((edge) => {
          if (edge.target !== action.payload.target || edge.targetHandle !== action.payload.targetHandle) {
            return true;
          }

          return edge.source === action.payload.source;
        });
      }

      return newEdges;
    },
    updateChangesStack(state, 'edges'),
  );

  state.edges = edges;

  state.nodes
    .filter((node) => node.data.errors && Object.values(node.data.errors).length > 0)
    .forEach((node) => {
      const errors = node.data.errors!;

      if (errors[action.payload.sourceHandle!]?.type === NodeErrorType.RequiredInputMissing) {
        delete errors[action.payload.sourceHandle!];
      }

      if (errors[action.payload.targetHandle!]?.type === NodeErrorType.RequiredInputMissing) {
        delete errors[action.payload.targetHandle!];
      }
    });
};
