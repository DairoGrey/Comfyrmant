import { NodeStateData } from './types';

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

export const builtinNodeTypes = {
  [DISPLAY_NODE_DATA.nodeType.type]: DISPLAY_NODE_DATA.nodeType,
  [INTEGER_NODE_DATA.nodeType.type]: INTEGER_NODE_DATA.nodeType,
  [STRING_NODE_DATA.nodeType.type]: STRING_NODE_DATA.nodeType,
  [NOTE_NODE_DATA.nodeType.type]: NOTE_NODE_DATA.nodeType,
};
