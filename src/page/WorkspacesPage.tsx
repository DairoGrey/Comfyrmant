import React from 'react';

import { Divider, Stack, Typography } from '@mui/material';

export const WorkspacesPage = () => {
  return <div>Hello</div>;
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
