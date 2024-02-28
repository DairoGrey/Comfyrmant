import React, { FC } from 'react';
import { NodeProps } from 'reactflow';

import { NodeStateData } from '_state/features/workflow/types';

import { Node } from '../node';

export const ApiNode: FC<NodeProps<NodeStateData>> = (props) => {
  return <Node {...props} />;
};
