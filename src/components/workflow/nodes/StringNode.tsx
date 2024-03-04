import React, { FC } from 'react';
import { NodeProps } from 'reactflow';

import { STRING_NODE_DATA } from '_state/features/workflow/data';

import { Node } from '../node';

export const StringNode: FC<NodeProps> = (props) => {
  return <Node {...props} data={STRING_NODE_DATA} />;
};
