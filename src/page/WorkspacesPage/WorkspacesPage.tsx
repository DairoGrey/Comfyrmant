import React from 'react';

import { Box, Divider, Stack, Typography } from '@mui/material';

import { WorkflowDraftCard } from './components/WorkflowDraftCard';

export const WorkspacesPage = () => {
  return (
    <Box p={2} flexWrap="wrap">
      <WorkflowDraftCard />
    </Box>
  );
};

export const WorkspacesAppBarWidgets = () => {
  return (
    <>
      <Divider flexItem variant="middle" orientation="vertical" />
      <Stack direction="row" gap={1}>
        <Stack px={2} justifyContent="center">
          <Typography variant="subtitle1" fontWeight="bold" lineHeight={1} color="inherit">
            {0}
          </Typography>
          <Typography variant="caption" color="inherit" lineHeight={1} sx={{ opacity: 0.6 }}>
            Counter
          </Typography>
        </Stack>
      </Stack>
    </>
  );
};
