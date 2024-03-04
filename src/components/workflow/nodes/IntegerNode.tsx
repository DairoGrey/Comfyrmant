import React, { FC } from 'react';
import { NodeProps } from 'reactflow';

import { INTEGER_NODE_DATA } from '_state/features/workflow/data';

import { Node } from '../node';

export const IntegerNode: FC<NodeProps> = (props) => {
  return <Node {...props} data={INTEGER_NODE_DATA} />;
};
