import React, { FC } from 'react';
import { useSelector } from 'react-redux';

import { Box, Grid, List, ListItem, ListItemText, Stack, useTheme } from '@mui/material';

import { HistoryEntry } from '_state/features/history/types';
import * as workflowSel from '_state/features/workflow/selector';

import { HistoryItemOutputs } from './HistoryItemOutputs';
import { HistoryItemPrompt } from './HistoryItemPrompt';

type Props = {
  entry: HistoryEntry;
};

export const HistoryEntryView: FC<Props> = ({ entry }) => {
  const theme = useTheme();

  const currentPrompt = useSelector(workflowSel.getPrompt)?.prompt;
  const itemPrompt = entry.info.prompt;

  return (
    <Box>
      <Grid container columns={18} sx={{ borderBottom: '1px solid', borderBottomColor: theme.palette.divider }}>
        <Grid item xs={6}>
          <List>
            <ListItem>
              <ListItemText primary={entry.info.id} secondary="Id" />
            </ListItem>
            <ListItem>
              <ListItemText primary={entry.info.number} secondary="Queue index" />
            </ListItem>
            <ListItem>
              <ListItemText primary={entry.info.outputNodes.length} secondary="Outputs" />
            </ListItem>
          </List>
        </Grid>
        <Grid item xs={6}></Grid>
      </Grid>

      <Stack p={2}>
        <HistoryItemPrompt currentPrompt={currentPrompt!} itemPrompt={itemPrompt} />
        <HistoryItemOutputs outputs={entry.outputs} />
      </Stack>
    </Box>
  );
};
