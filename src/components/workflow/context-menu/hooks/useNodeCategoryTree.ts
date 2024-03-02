import { useMemo } from 'react';

import get from 'lodash/get';
import has from 'lodash/has';
import set from 'lodash/set';

import { builtinNodeTypes } from '_components/workflow/nodes';
import { NodeType, NodeTypes } from '_state/features/workflow/types';

import { NodeOption, Tree } from '../types';

type UseNodeCategoryTreeHook = [Tree<NodeType>, NodeType[], NodeOption[]];

export const useNodeCategoryTree = (data: NodeTypes | undefined) => {
  return useMemo((): UseNodeCategoryTreeHook => {
    if (!data) {
      return [{}, [], []];
    }

    const allNodes = Object.values(data);

    allNodes.push(...Object.values(builtinNodeTypes));

    const nodes = allNodes.sort((a, b) => a.category.toLocaleLowerCase().localeCompare(b.category.toLocaleLowerCase()));

    const types = allNodes.map((node) => ({ label: node.title, category: node.category, type: node.type }));

    const tree: Tree<NodeType> = nodes.reduce((result, node) => {
      const path = node.category.replaceAll('/', '.');

      if (!has(result, path)) {
        set(result, path, { __root__: [], __id__: node.category });
      }

      get(result, path).__root__.push(node);

      return result;
    }, {} as Tree<NodeType>);

    return [tree, nodes, types] as const;
  }, [data]);
};
