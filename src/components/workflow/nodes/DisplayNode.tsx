import React, { FC } from 'react';
import { NodeProps } from 'reactflow';

import { NodeStateData } from '_state/features/workflow/types';

import { Node } from '../node';

export const DISPLAY_NODE_DATA: NodeStateData = {
  nodeType: {
    type: 'Display',
    title: 'Display',
    category: 'utils',
    isOutput: false,
    inputs: {
      value: {
        index: 0,
        required: true,
        type: 'GENERIC',
        name: 'value',
      },
    },
    outputs: {},
  },
  inputs: {
    value: {
      index: 0,
      required: true,
      type: 'GENERIC',
      name: 'value',
    },
  },
  outputs: {},
  widgets: {
    value: {
      name: 'value',
      type: 'input',
      id: 'value',
    },
  },
};

export const DisplayNode: FC<NodeProps> = (props) => {
  return <Node {...props} data={DISPLAY_NODE_DATA} />;
};
