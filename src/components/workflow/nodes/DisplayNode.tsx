import React, { FC } from 'react';
import { NodeProps } from 'reactflow';

import { DISPLAY_NODE_DATA } from '_state/features/workflow/data';

import { Node } from '../node';

export const DisplayNode: FC<NodeProps> = (props) => {
  return <Node {...props} data={DISPLAY_NODE_DATA} />;
};
