import React, { FC } from 'react';
import { NodeProps } from 'reactflow';

import { NodeStateData } from '_state/features/workflow/types';

import { Node } from '../node';

export const STRING_NODE_DATA: NodeStateData = {
  nodeType: {
    type: 'String',
    title: 'String',
    category: 'primitive',
    isOutput: false,
    inputs: {},
    outputs: {
      STRING: {
        index: 0,
        name: 'STRING',
        type: 'STRING',
        isList: false,
      },
    },
  },
  inputs: {},
  outputs: {
    STRING: {
      index: 0,
      name: 'STRING',
      type: 'STRING',
      isList: false,
    },
  },
  widgets: {
    value: {
      name: 'value',
      type: 'output',
      options: {
        multiline: true,
      },
      id: 'STRING',
    },
  },
};

export const StringNode: FC<NodeProps> = (props) => {
  return <Node {...props} data={STRING_NODE_DATA} />;
};
