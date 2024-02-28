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

    return true;
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
