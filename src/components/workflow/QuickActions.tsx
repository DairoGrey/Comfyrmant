import React, { FC } from 'react';
import { Panel } from 'reactflow';

import { Box, Divider, Paper, Stack, Typography } from '@mui/material';

import BoltIcon from '@mui/icons-material/Bolt';

import { ResizeToSnapGrid } from './quick-actions/resize-to-snap-grid';
import { SelectAll } from './quick-actions/select-all';

export const QuickActions: FC = () => {
  return (
    <Panel position="top-right">
      <Stack component={Paper} variant="outlined">
        <Stack direction="row" gap={1} p={1}>
          <BoltIcon />
          <Typography variant="subtitle1">Quick actions</Typography>
        </Stack>
        <Divider />
        <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={1} p={1}>
          <ResizeToSnapGrid />
          <SelectAll />
        </Box>
      </Stack>
    </Panel>
  );
};
