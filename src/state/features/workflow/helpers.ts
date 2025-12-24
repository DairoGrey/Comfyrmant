import { Edge, getConnectedEdges, Node } from 'reactflow';

import { isEqual } from 'lodash';

import { PromptNodeData } from '_state/features/api/types';
import { NodeInputState, NodeStateData } from '_state/features/workflow/types';

type DeductItem<T> = T extends (infer I)[] ? I : T extends { [key: string]: infer M } ? M : never;

type ItemOf<T, K extends keyof T> = T[K] extends NonNullable<infer U> ? DeductItem<U> : DeductItem<NonNullable<T[K]>>;

type DefaultValue<T> = T extends NonNullable<T> ? undefined : NonNullable<T>;

type ExtraArgs<T, K extends keyof T> =
  T[K] extends NonNullable<T[K]> ? [defaultValue?: never] : [defaultValue: NonNullable<T[K]>];

const getValues = <T, K extends keyof T, Data extends T[K]>(data: T, selector: K, defaultValue: DefaultValue<Data>) => {
  const value: Data = data[selector] as Data;
  // @ts-expect-error complex typing
  return Object.values<E>(value ?? defaultValue);
};

const forEachNodeDataEntity =
  <T extends NodeStateData, K extends keyof T, E extends ItemOf<T, K>>(selector: K, ...args: ExtraArgs<T, K>) =>
  (data: T, cb: (entity: E) => void) => {
    getValues(data, selector, args[0] as DefaultValue<T[K]>).forEach(cb);
  };

export const forEachInput = forEachNodeDataEntity('inputs');
export const forEachOutput = forEachNodeDataEntity('outputs');
export const forEachWidget = forEachNodeDataEntity('widgets', {});

const mapNodeDataEntity =
  <T extends NodeStateData, K extends keyof T, E extends ItemOf<T, K>>(selector: K, ...args: ExtraArgs<T, K>) =>
  <R>(data: T, cb: (entity: E) => R) => {
    return getValues(data, selector, args[0] as DefaultValue<T[K]>).map(cb);
  };

export const mapInputs = mapNodeDataEntity('inputs');
export const mapOutputs = mapNodeDataEntity('outputs');
export const mapWidgets = mapNodeDataEntity('widgets', {});

const someNodeDataEntity =
  <T extends NodeStateData, K extends keyof T, E extends ItemOf<T, K>>(selector: K, ...args: ExtraArgs<T, K>) =>
  (data: T, cb: (entity: E) => boolean) => {
    return getValues(data, selector, args[0] as DefaultValue<T[K]>).some(cb);
  };

export const someInputs = someNodeDataEntity('inputs');
export const someOutputs = someNodeDataEntity('outputs');
export const someWidgets = someNodeDataEntity('widgets', {});

const everyNodeDataEntity =
  <T extends NodeStateData, K extends keyof T, E extends ItemOf<T, K>>(selector: K, ...args: ExtraArgs<T, K>) =>
  (data: T, cb: (entity: E) => boolean) => {
    return getValues(data, selector, args[0] as DefaultValue<T[K]>).every(cb);
  };

export const everyInput = everyNodeDataEntity('inputs');
export const everyOutput = everyNodeDataEntity('outputs');
export const everyWidget = everyNodeDataEntity('widgets', {});

const getBypassInputForOutput = (node: Node<NodeStateData>, id: string) => {
  const output = node.data.outputs[id];

  if (!output) {
    return;
  }

  return Object.values(node.data.inputs).find((input) => isEqual(input.type, output.type))?.name;
};

export const getConnectedSourceNodeSimple = (
  id: string,
  input: string,
  nodes: Node<NodeStateData>[],
  edges: Edge[],
): [Node<NodeStateData>, string] | [undefined, undefined] => {
  const targetNode = nodes.find((node) => node.id === id);

  if (targetNode) {
    const connectedEdges = getConnectedEdges([targetNode], edges);
    const valueEdge = connectedEdges.filter((edge) => edge.source !== id).find((edge) => edge.targetHandle === input);

    if (!valueEdge || !valueEdge.sourceHandle) {
      return [undefined, undefined];
    }

    const sourceHandle = valueEdge.sourceHandle;
    const sourceNode = nodes.find((node) => node.id === valueEdge.source);

    if (!sourceNode) {
      return [undefined, undefined];
    }

    return [sourceNode, sourceHandle];
  }

  return [undefined, undefined];
};

export const getConnectedSourceNode = (
  id: string,
  input: string,
  nodes: Node<NodeStateData>[],
  edges: Edge[],
): [Node<NodeStateData>, string] | [undefined, undefined] => {
  const result = getConnectedSourceNodeSimple(id, input, nodes, edges);
  const [sourceNode, sourceHandle] = result;

  if (sourceNode?.data.bypass) {
    let bypassInput = getBypassInputForOutput(sourceNode, sourceHandle);

    if (!bypassInput) {
      return [undefined, undefined];
    }

    let [connectedNode, connectedHandle] = getConnectedSourceNodeSimple(sourceNode.id, bypassInput, nodes, edges);

    while (connectedHandle && connectedNode && connectedNode.data.bypass) {
      bypassInput = getBypassInputForOutput(connectedNode, connectedHandle);

      if (!bypassInput) {
        return [undefined, undefined];
      }

      [connectedNode, connectedHandle] = getConnectedSourceNodeSimple(connectedNode.id, bypassInput, nodes, edges);
    }

    if (!connectedNode || !connectedHandle) {
      return [undefined, undefined];
    }

    return [connectedNode, connectedHandle];
  }

  return result;
};

export const getSourceNode = () => {};

export const getInputDefaultValue = (input: NodeInputState) => {
  const defaultValue = input.options?.default;

  if (defaultValue === undefined && Array.isArray(input.type)) {
    return input.type[0];
  }

  return defaultValue;
};

export const buildPrompt = (nodes: Node<NodeStateData>[], edges: Edge[]): Record<string | number, PromptNodeData> => {
  const getInputConnection = (id: string, input: string) => {
    const [sourceNode, sourceHandle] = getConnectedSourceNode(id, input, nodes, edges);

    if (sourceNode && sourceHandle) {
      if (sourceNode.data.nodeType.category === 'primitive') {
        return sourceNode.data.values?.[sourceHandle];
      }

      return [sourceNode.id, sourceNode.data.outputs[sourceHandle].index];
    }
  };

  const data: Record<string | number, PromptNodeData> = nodes
    .filter((node) => !['primitive', 'utils'].includes(node.data.nodeType.category))
    .filter((node) => !node.data.bypass)
    .reduce((result, node) => {
      const nodeData = node.data;

      return {
        ...result,
        [node.id]: {
          class_type: nodeData.nodeType.type,
          inputs: Object.values(nodeData.inputs).reduce((result, input) => {
            const value = nodeData.values?.[input.name];

            return {
              ...result,
              [input.name]:
                value !== undefined ? value : getInputConnection(node.id, input.name) || getInputDefaultValue(input),
            };
          }, {}),
        },
      };
    }, {});

  return data;
};
