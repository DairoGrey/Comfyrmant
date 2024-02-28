import { FC } from 'react';
import React from 'react';
import { NodeResizer } from 'reactflow';

import { useTheme } from '@mui/material';

type Props = {
  visible: boolean;
};

export const Resizer: FC<Props> = ({ visible }) => {
  const theme = useTheme();

  return (
    <NodeResizer
      minWidth={150}
      minHeight={50}
      isVisible={visible}
      handleStyle={{ width: 8, height: 8, border: 'none' }}
      lineStyle={{ borderWidth: 1 }}
      color={theme.palette.secondary.main}
    />
  );
};
