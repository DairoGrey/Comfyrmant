import { DISPLAY_NODE_DATA, DisplayNode } from './DisplayNode';
import { INTEGER_NODE_DATA, IntegerNode } from './IntegerNode';
import { NOTE_NODE_DATA, NoteNode } from './NoteNode';
import { STRING_NODE_DATA, StringNode } from './StringNode';

export const builtinNodeTypes = {
  [DISPLAY_NODE_DATA.nodeType.type]: DisplayNode,
  [INTEGER_NODE_DATA.nodeType.type]: IntegerNode,
  [STRING_NODE_DATA.nodeType.type]: StringNode,
  [NOTE_NODE_DATA.nodeType.type]: NoteNode,
};

export const builtinNodes = [
  DISPLAY_NODE_DATA.nodeType,
  INTEGER_NODE_DATA.nodeType,
  STRING_NODE_DATA.nodeType,
  NOTE_NODE_DATA.nodeType,
];
