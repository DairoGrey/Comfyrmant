import type { Connection, Edge, EdgeChange, Node, NodeChange, UpdateEdgeOptions } from 'reactflow';
import * as ReactFlow from 'reactflow';

import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  NodeColor,
  NodeErrorState,
  NodeErrorType,
  NodeStateData,
  NodeWidgetState,
} from '_state/features/workflow/types';

type NodesState = {
  nodes: Node<NodeStateData>[];
  edges: Edge[];
};

const initialState: NodesState = {
  nodes: [],
  edges: [],
};

export const randomTick = createAction('workflow/random-tick');
export const queuePrompt = createAction('workflow/queue-prompt');

const workflowSlice = createSlice({
  name: 'workflow',
  initialState,
  reducers: {
    applyNodeChanges(state, action: PayloadAction<NodeChange[]>) {
      state.nodes = ReactFlow.applyNodeChanges(action.payload, state.nodes);
    },
    applyEdgeChanges(state, action: PayloadAction<EdgeChange[]>) {
      state.edges = ReactFlow.applyEdgeChanges(action.payload, state.edges);
    },
    addNodeWidget(state, action: PayloadAction<{ id: string; widget: NodeWidgetState }>) {
      const { id, widget } = action.payload;

      const nodeData = state.nodes.find((node) => node.id === id)?.data;

      if (!nodeData) {
        return;
      }

      if (!nodeData?.widgets) {
        nodeData.widgets = {};
      }

      const input = nodeData.inputs[widget.name];
      input.hidden = true;

      nodeData.widgets[widget.name] = widget;

      if (!nodeData.values) {
        nodeData.values = {};
      }

      if (nodeData.errors?.[input.name]) {
        delete nodeData.errors[input.name];
      }

      if (Array.isArray(input.type)) {
        nodeData.values[widget.name] = input.type[0];
      } else {
        nodeData.values[widget.name] = input?.options?.default;
      }
    },
    removeNodeWidget(state, action: PayloadAction<{ id: string; widget: string }>) {
      const { id, widget: widgetId } = action.payload;

      const nodeData = state.nodes.find((node) => node.id === id)?.data;
      const widget = nodeData?.widgets?.[widgetId];

      if (nodeData?.widgets && widget) {
        if (widget.type === 'input') {
          delete nodeData.inputs[widget.id].hidden;
        }

        delete nodeData.widgets[widget.name];

        if (nodeData.values) {
          delete nodeData.values[widget.id];
        }

        if (nodeData.errors?.[widget.id]) {
          delete nodeData.errors[widget.id];
        }
      }
    },
    addNodeError(state, action: PayloadAction<{ id: string; error: NodeErrorState }>) {
      const { id, error } = action.payload;

      const nodeData = state.nodes.find((node) => node.id === id)?.data;

      if (!nodeData) {
        return;
      }

      if (!nodeData.errors) {
        nodeData.errors = {};
      }

      nodeData.errors[error.name] = error;
    },
    resolveNodeError(state, action: PayloadAction<{ id: string; error: string }>) {
      const { id, error } = action.payload;

      const nodeData = state.nodes.find((node) => node.id === id)?.data;

      if (!nodeData) {
        return;
      }

      if (!nodeData.errors) {
        return;
      }

      delete nodeData.errors[error];
    },
    addEdge(state, action: PayloadAction<Edge | Connection>) {
      state.edges = ReactFlow.addEdge(action.payload, state.edges);

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
    },
    updateEdge(state, action: PayloadAction<{ edge: Edge; connection: Connection; options?: UpdateEdgeOptions }>) {
      state.edges = ReactFlow.updateEdge(
        action.payload.edge,
        action.payload.connection,
        state.edges,
        action.payload.options,
      );
    },
    removeEdgesToNode(state, action: PayloadAction<string>) {
      state.edges = state.edges.filter((edge) => edge.source !== action.payload && edge.target !== action.payload);
    },
    updateNodeWidgetValue(state, action: PayloadAction<{ id: string; pin: string; value: unknown }>) {
      const { id, pin, value } = action.payload;

      const nodeData = state.nodes.find((node) => node.id === id)?.data;

      if (nodeData?.values) {
        nodeData.values[pin] = value;

        if (nodeData.errors?.[pin]?.type === NodeErrorType.ValueSmallerThanMin) {
          delete nodeData.errors[pin];
        }
      }
    },
    updateNodeWidgetOptions(
      state,
      action: PayloadAction<{ id: string; pin: string; options: Record<string, unknown> }>,
    ) {
      const { id, pin, options } = action.payload;

      const nodeData = state.nodes.find((node) => node.id === id)?.data;

      if (nodeData?.widgets?.[pin]) {
        nodeData.widgets[pin].options = {
          ...nodeData.widgets[pin].options,
          ...options,
        };
      }
    },
    updateNodeColor(state, action: PayloadAction<{ id: string; color: NodeColor }>) {
      const { id, color } = action.payload;

      const nodeData = state.nodes.find((node) => node.id === id)?.data;

      if (nodeData) {
        nodeData.color = color;
      }
    },
    resetNodeColor(state, action: PayloadAction<{ id: string }>) {
      const { id } = action.payload;

      const nodeData = state.nodes.find((node) => node.id === id)?.data;

      if (nodeData?.color) {
        delete nodeData.color;
      }
    },
  },
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
  addNodeError,
  resolveNodeError,
} = workflowSlice.actions;

export default workflowSlice;
