import React, { FC } from 'react';
import { NodeProps } from 'reactflow';

import { NOTE_NODE_DATA } from '_state/features/workflow/data';

import { Node } from '../node';

export const NoteNode: FC<NodeProps> = (props) => {
  return <Node {...props} data={NOTE_NODE_DATA} />;
};
