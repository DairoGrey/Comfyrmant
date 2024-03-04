import { DISPLAY_NODE_DATA, INTEGER_NODE_DATA, NOTE_NODE_DATA, STRING_NODE_DATA } from '_state/features/workflow/data';

import { DisplayNode } from './DisplayNode';
import { IntegerNode } from './IntegerNode';
import { NoteNode } from './NoteNode';
import { StringNode } from './StringNode';

export const builtinNodes = {
  [DISPLAY_NODE_DATA.nodeType.type]: DisplayNode,
  [INTEGER_NODE_DATA.nodeType.type]: IntegerNode,
  [STRING_NODE_DATA.nodeType.type]: StringNode,
  [NOTE_NODE_DATA.nodeType.type]: NoteNode,
};
