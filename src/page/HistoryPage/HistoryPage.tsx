import React, { useEffect, useState } from 'react';

import { Box, Divider, Grid, Stack, Typography, useTheme } from '@mui/material';

import { ErrorBoundary } from '_components/error-boundary';
import * as apiQueries from '_state/features/api/slice';

import { HistoryEntriesList } from './components/HistoryEntriesList';
import { HistoryEntryView } from './components/HistoryEntryView';

export const HistoryPage = () => {
  const theme = useTheme();

  const { data, isLoading, isSuccess } = apiQueries.useGetHistoryQuery();

  const [selected, setSelected] = useState<string | undefined>();

  useEffect(() => {
    if (isSuccess) {
      setSelected(Object.values(data)[0]?.prompt[1]);
    }
  }, [isSuccess]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const entries = Object.values(data || {}).sort((a, b) => a.prompt[0] - b.prompt[0]);
  const selectedItem = data && selected ? data[selected] : undefined;

  return (
    <Grid container columns={24} flexShrink={0} height="calc(100%)" width="100vw">
      <Grid item xs={8} md={8} lg={6} flexShrink={0} height="100%" overflow="hidden">
        <Box
          sx={{ overflowY: 'auto', height: '100%', borderRight: '1px solid', borderRightColor: theme.palette.divider }}
        >
          <ErrorBoundary>
            <HistoryEntriesList entries={entries} selected={selected} onSelect={(id: string) => setSelected(id)} />
          </ErrorBoundary>
        </Box>
      </Grid>
      <Grid item xs={16} md={16} lg={18} flexShrink={0} height="100%" overflow="hidden">
        <Stack gap={1} overflow="hidden" sx={{ height: '100%' }}>
          <ErrorBoundary>
            <Box sx={{ overflowY: 'auto', height: '100%' }}>
              {selectedItem && <HistoryEntryView entry={selectedItem} />}
            </Box>
          </ErrorBoundary>
        </Stack>
      </Grid>
    </Grid>
  );
};

export const HistoryAppBarWidgets = () => {
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
