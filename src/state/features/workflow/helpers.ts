import { Edge, getConnectedEdges, Node } from 'reactflow';

import { PromptNodeData } from '_state/features/api/types';
import { NodeInputState, NodeStateData } from '_state/features/workflow/types';

type Tuple = [Node<NodeStateData> | undefined, string | undefined];

export const getConnectedSourceNode = (
  id: string,
  input: string,
  nodes: Node<NodeStateData>[],
  edges: Edge[],
): Tuple => {
  const targetNode = nodes.find((node) => node.id === id);

  if (targetNode) {
    const connectedEdges = getConnectedEdges([targetNode], edges);
    const valueEdge = connectedEdges.filter((edge) => edge.source !== id).find((edge) => edge.targetHandle === input);

    if (!valueEdge || !valueEdge.sourceHandle) {
      return [undefined, undefined];
    }

    const sourceNode = nodes.find((node) => node.id === valueEdge.source);

    if (!sourceNode) {
      return [undefined, undefined];
    }

    return [sourceNode, valueEdge.sourceHandle];
  }

  return [undefined, undefined];
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
