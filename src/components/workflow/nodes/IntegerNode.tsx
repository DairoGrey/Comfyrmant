import React, { FC } from 'react';
import { NodeProps } from 'reactflow';

import { NodeStateData } from '_state/features/workflow/types';

import { Node } from '../node';

export const INTEGER_NODE_DATA: NodeStateData = {
  nodeType: {
    type: 'Integer',
    title: 'Integer',
    category: 'primitive',
    isOutput: false,
    inputs: {},
    outputs: {
      INT: {
        index: 0,
        name: 'INT',
        type: 'INT',
        isList: false,
      },
    },
  },
  inputs: {},
  outputs: {
    INT: {
      index: 0,
      name: 'INT',
      type: 'INT',
      isList: false,
    },
  },
  widgets: {
    value: {
      name: 'value',
      type: 'output',
      id: 'INT',
    },
  },
};

export const IntegerNode: FC<NodeProps> = (props) => {
  return <Node {...props} data={INTEGER_NODE_DATA} />;
};
