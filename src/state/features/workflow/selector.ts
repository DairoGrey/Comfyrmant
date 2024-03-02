import { createSelector } from '@reduxjs/toolkit';

import { PromptRequest } from '_state/features/api/types';
import { NodeColor, NodeOutput, NodeWidgetState } from '_state/features/workflow/types';
import type { RootState } from '_state/store';

import { getClientId } from '../hub/selector';

import { buildPrompt, getConnectedSourceNode } from './helpers';
import slice from './slice';

const getFlow = (state: RootState) => state[slice.name];

export const getNodes = createSelector(getFlow, (flow) => flow.nodes);
export const getEdges = createSelector(getFlow, (flow) => flow.edges);
const getChanges = createSelector(getFlow, (flow) => flow.changes);

const getIsChangesEmpty = createSelector(getChanges, (changes) => changes.stack.length === 0);
const getCanPickNextRollback = createSelector(getChanges, (changes) => changes.index > -1);
const getCanPickNextApply = createSelector(
  getChanges,
  (changes) => changes.index < changes.stack.length && changes.index != changes.stack.length - 1,
);

export const getCanUndo = createSelector(
  [getIsChangesEmpty, getCanPickNextRollback],
  (isEmpty, canPickNextRollback) => !isEmpty && canPickNextRollback,
);
export const getCanRedo = createSelector(
  [getIsChangesEmpty, getCanPickNextApply],
  (isEmpty, canPickNextApply) => !isEmpty && canPickNextApply,
);

/**
 * Get output definition of current node
 *
 * @param {RootState} state
 * @param {string} id current node id
 * @param {string} [output] output name of current node
 *
 * @returns {NodeOutput | undefined}
 **/
export const getNodeOutput: (state: RootState, id: string, output?: string) => NodeOutput | undefined = createSelector(
  [getNodes, (_, id: string, output?: string) => [id, output]],
  (nodes, [id, output]) => {
    if (!output) {
      return;
    }

    const node = nodes.find((node) => node.id === id);

    if (node) {
      return node.data.outputs[output];
    }
  },
);

/**
 * Get value of current node
 *
 * @function
 * @param {RootState} state
 * @param {string} id current node id
 * @param {string} output output name of current node
 *
 * @returns {unknown | undefined}
 **/
export const getNodeOutputValue: (state: RootState, id: string, output: string) => unknown | undefined = createSelector(
  [getNodes, (_, id: string, output: string) => [id, output]],
  (nodes, [id, output]) => {
    const node = nodes.find((node) => node.id === id);

    if (node) {
      return node.data.values?.[output];
    }
  },
);

/**
 * Get output definition from node connected to an input of node with passed id
 *
 * @function
 * @param {RootState} state
 * @param {string} id current node id
 * @param {string} input input name of current node
 *
 * @returns {NodeOutput | undefined}
 **/
export const getOutputOfConnectedSourceNode: (state: RootState, id: string, input: string) => NodeOutput | undefined =
  createSelector([getNodes, getEdges, (_, id: string, input: string) => [id, input]], (nodes, edges, [id, input]) => {
    const [sourceNode, sourceHandle] = getConnectedSourceNode(id, input, nodes, edges);

    if (!sourceNode || !sourceHandle) {
      return;
    }

    return sourceNode.data.outputs[sourceHandle];
  });

/**
 * Get value from node connected to specified input of node with passed id or from input widget
 *
 * @function
 * @param {RootState} state
 * @param {string} id current node id
 * @param {string} input input name of current node
 *
 * @returns {unknown | undefined}
 **/
export const getInputValueFromConnectedSourceNode = createSelector(
  [getNodes, getEdges, (_, id: string, input: string) => [id, input]],
  (nodes, edges, [id, input]) => {
    const [sourceNode, sourceHandle] = getConnectedSourceNode(id, input, nodes, edges);

    if (!sourceNode || !sourceHandle) {
      const node = nodes.find((node) => node.id === id);

      if (!node) {
        return;
      }

      return node.data.values?.[input];
    }

    return sourceNode.data.values?.[sourceHandle];
  },
);

export const getNodeColor: (state: RootState, id: string) => NodeColor | undefined = createSelector(
  [getNodes, (_, id: string) => id],
  (nodes, id) => {
    const node = nodes.find((node) => node.id === id);

    if (node) {
      return node.data.color;
    }
  },
);

export const getNodeResizing: (state: RootState, id: string) => boolean = createSelector(
  [getNodes, (_, id: string) => id],
  (nodes, id) => {
    const node = nodes.find((node) => node.id === id);

    return Boolean(node?.data.resizing);
  },
);

export const getNodeCollapsed: (state: RootState, id: string) => boolean = createSelector(
  [getNodes, (_, id: string) => id],
  (nodes, id) => {
    const node = nodes.find((node) => node.id === id);

    return Boolean(node?.data.collapsed);
  },
);

export const getNodeTags: (state: RootState, id: string) => string[] | undefined = createSelector(
  [getNodes, (_, id: string) => id],
  (nodes, id) => {
    const node = nodes.find((node) => node.id === id);

    return node?.data.tags;
  },
);

export const getIsNodeInputConnected: (state: RootState, id: string, input: string) => boolean = createSelector(
  [getEdges, (_, id: string, input: string) => [id, input] as const],
  (edges, [id, input]) => {
    return edges.some((edge) => edge.target === id && edge.targetHandle === input);
  },
);

export const getIsNodeOutputConnected: (state: RootState, id: string, output: string) => boolean = createSelector(
  [getEdges, (_, id: string, output: string) => [id, output] as const],
  (edges, [id, output]) => {
    return edges.some((edge) => edge.source === id && edge.source === output);
  },
);

/**
 * Check if prompt can be created
 *
 * @function
 * @param {RootState} state
 *
 * @returns {PromptRequest | undefined}
 **/
export const getCanBuildPrompt: (state: RootState) => boolean = createSelector(
  [getNodes, getEdges, getClientId],
  (nodes, edges, clientId) => {
    if (!clientId) {
      return false;
    }

    return nodes.length > 0 && edges.length > 0;
  },
);

/**
 * Get prompt
 *
 * @function
 * @param {RootState} state
 *
 * @returns {PromptRequest | undefined}
 **/
export const getPrompt: (state: RootState) => PromptRequest | undefined = createSelector(
  [getNodes, getEdges, getClientId],
  (nodes, edges, clientId) => {
    if (!clientId) {
      return;
    }

    const prompt = buildPrompt(nodes, edges);

    return {
      client_id: clientId,
      prompt,
    } satisfies PromptRequest;
  },
);

export const getNodesWithRandomWidgets = createSelector(getNodes, (nodes) => {
  return nodes.reduce((result: Array<[string, string]>, node) => {
    const widgets = Object.values(node.data.widgets || {});

    const reduceWidgets = (list: Array<[string, string]>, widget: NodeWidgetState) => {
      if (widget.options?.['random']) {
        return [...list, [node.id, widget.name] as [string, string]];
      }

      return list;
    };

    return [...result, ...widgets.reduce(reduceWidgets, [])];
  }, []);
});
