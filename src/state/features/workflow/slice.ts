import type { Edge, Node } from 'reactflow';

import { createAction, createSlice } from '@reduxjs/toolkit';
import { Patch } from 'immer';
import * as uuid from 'uuid';

import { NodeStateData } from '_state/features/workflow/types';

import * as reducers from './reducers';

export type WorkflowState = {
  id: string;
  nodes: Node<NodeStateData>[];
  edges: Edge[];
  changes: {
    index: number;
    stack: Array<{
      nodes?: { apply: Patch[]; rollback: Patch[] };
      edges?: { apply: Patch[]; rollback: Patch[] };
    }>;
  };
};

const initialState: WorkflowState = {
  id: uuid.v4(),
  nodes: [],
  edges: [],
  changes: {
    index: -1,
    stack: [],
  },
};

export const randomTick = createAction('workflow/random-tick');
export const queuePrompt = createAction('workflow/queue-prompt');
export const resizeToSnapGrid = createAction('workflow/resize-to-snap-grid');
export const selectAll = createAction('workflow/select-all');
export const exportToFile = createAction('workflow/export-to-file');
export const importFromFile = createAction('workflow/import-from-file');

const workflowSlice = createSlice({
  name: 'workflow',
  initialState,
  reducers,
});

export const {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  updateEdge,
  removeEdgesToNode,
  addNodeWidget,
  removeNodeWidget,
  updateNodeWidgetValue,
  updateNodeWidgetOptions,
  updateNodeColor,
  resetNodeColor,
  resetNodesColor,
  toggleNodeCollapsed,
  toggleNodeResizing,
  addNodeTag,
  removeNodeTag,
  addNodeError,
  resolveNodeError,
  undo,
  redo,
} = workflowSlice.actions;

export default workflowSlice;
