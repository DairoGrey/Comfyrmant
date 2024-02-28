import React, { FC } from 'react';
import { NodeProps } from 'reactflow';

import { NodeStateData } from '_state/features/workflow/types';

import { Node } from '../node';

export const NOTE_NODE_DATA: NodeStateData = {
  nodeType: {
    type: 'Note',
    title: 'Note',
    category: 'utils',
    isOutput: false,
    inputs: {
      NOTE: {
        index: 0,
        name: 'NOTE',
        type: 'NOTE',
      },
    },
    outputs: {},
  },
  inputs: {
    NOTE: {
      index: 0,
      name: 'NOTE',
      type: 'NOTE',
      hidden: true,
    },
  },
  outputs: {},
  widgets: {
    note: {
      name: 'note',
      type: 'input',
      options: {
        multiline: true,
      },
      id: 'NOTE',
    },
  },
};

export const NoteNode: FC<NodeProps> = (props) => {
  return <Node {...props} data={NOTE_NODE_DATA} />;
};
