import { NodeStateData } from './types';

export const DISPLAY_NODE_DATA: NodeStateData = {
  nodeType: {
    type: 'Display',
    title: 'Display',
    category: 'editor/builtin/utils',
    isOutput: true,
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
  widgets: {},
};

export const NOTE_NODE_DATA: NodeStateData = {
  nodeType: {
    type: 'Note',
    title: 'Note',
    category: 'editor/builtin/utils',
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

export const builtinNodeTypes = {
  [DISPLAY_NODE_DATA.nodeType.type]: DISPLAY_NODE_DATA.nodeType,
  [NOTE_NODE_DATA.nodeType.type]: NOTE_NODE_DATA.nodeType,
};

export const builtinNodeData = {
  [DISPLAY_NODE_DATA.nodeType.type]: DISPLAY_NODE_DATA,
  [NOTE_NODE_DATA.nodeType.type]: NOTE_NODE_DATA,
};
