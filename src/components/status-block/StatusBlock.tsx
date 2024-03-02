import React, { FC } from 'react';

import { Stack, Typography } from '@mui/material';

type Props = {
  value: React.ReactNode;
  label: React.ReactNode;
};

export const StatusBlock: FC<Props> = ({ value, label }) => {
  return (
    <Stack px={2} justifyContent="center">
      <Typography variant="subtitle1" fontWeight="bold" lineHeight={1} color="inherit">
        {value}
      </Typography>
      <Typography variant="caption" color="inherit" lineHeight={1} sx={{ opacity: 0.6 }}>
        {label}
      </Typography>
    </Stack>
  );
};
