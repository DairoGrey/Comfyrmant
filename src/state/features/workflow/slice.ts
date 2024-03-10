import type { Edge, Node } from 'reactflow';

import { createAction, createSlice } from '@reduxjs/toolkit';
import { Patch } from 'immer';
import * as uuid from 'uuid';

import { ExportedWorkflow, NodeStateData } from '_state/features/workflow/types';

import * as reducers from './reducers';

export type WorkflowState = {
  id: string;
  title?: string;
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

export const randomTick = createAction('workflow/randomTick');
export const queuePrompt = createAction('workflow/queuePrompt');
export const resizeToSnapGrid = createAction('workflow/resizeToSnapGrid');
export const selectAll = createAction('workflow/selectAll');
export const exportToFile = createAction<{ fileName: string; includeSettings: boolean }>('workflow/exportToFile');
export const importFromFile = createAction<{ workflow: ExportedWorkflow; includeSettings: boolean }>(
  'workflow/importFromFile',
);

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
  toggleNodeLocked,
  toggleNodeBypass,
  addNodeTag,
  removeNodeTag,
  addNodeError,
  resolveNodeError,
  updateTitle,
  cloneNode,
  undo,
  redo,
} = workflowSlice.actions;

export default workflowSlice;
