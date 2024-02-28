import React from 'react';
import { FC } from 'react';

import { Box } from '@mui/material';

export const ScrollableArea: FC<{ height: number; children: React.ReactNode }> = ({ height, children }) => {
  return (
    <Box height={height} width="100%">
      <Box height="100%" overflow="hidden">
        <Box sx={{ overflow: 'auto', height: '100%' }}>{children}</Box>
      </Box>
    </Box>
  );
};
