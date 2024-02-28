import React, { FC, useState } from 'react';
import { useSelector } from 'react-redux';

import isEqual from 'lodash/isEqual';
import isObject from 'lodash/isObject';
import transform from 'lodash/transform';

import TabContext from '@mui/lab/TabContext';
import TabPanel from '@mui/lab/TabPanel';

import { Box, List, ListItem, ListItemText, Stack, Tab, Tabs, Typography, useTheme } from '@mui/material';

import { ScrollableArea } from '_components/scrollable-area';
import { SyntaxHighlighter } from '_components/syntax-highlighter';
import { HistoryItemResponse } from '_state/features/api/types';
import * as workflowSel from '_state/features/workflow/selector';

const difference = (object: any, base: any) => {
  const changes = (object: any, base: any) => {
    return transform(object, function (result: any, value: any, key: any) {
      if (!isEqual(value, base[key])) {
        result[key] = isObject(value) && isObject(base[key]) ? changes(value, base[key]) : value;
      }
    });
  };

  return changes(object, base);
};

type Props = {
  entry: HistoryItemResponse;
};

export const HistoryEntryView: FC<Props> = ({ entry }) => {
  const theme = useTheme();

  const [tab, setTab] = useState('0');

  const currentPrompt = useSelector(workflowSel.getPrompt)?.prompt;
  const itemPrompt = entry.prompt[2];

  return (
    <Box>
      <List sx={{ borderBottom: '1px solid', borderBottomColor: theme.palette.divider }}>
        <ListItem>
          <ListItemText primary={entry.prompt[1]} secondary="Id" />
        </ListItem>
        <ListItem>
          <ListItemText primary={entry.prompt[0]} secondary="Queue index" />
        </ListItem>
        <ListItem>
          <ListItemText primary={entry.prompt[4].length} secondary="Outputs" />
        </ListItem>
      </List>
      <Stack gap={1} p={2}>
        <Typography variant="subtitle1">Prompt</Typography>
        <TabContext value={tab}>
          <Tabs value={tab} onChange={(e, tab) => setTab(tab)} aria-label="basic tabs example">
            <Tab label="Current" value="0" />
            <Tab label="Difference" value="1" />
            <Tab label="Selected" value="2" />
          </Tabs>
          <TabPanel value="0">
            <ScrollableArea height={400}>
              <SyntaxHighlighter language="json" code={JSON.stringify(currentPrompt, undefined, 4)} />
            </ScrollableArea>
          </TabPanel>
          <TabPanel value="1">
            <ScrollableArea height={400}>
              <SyntaxHighlighter
                language="json"
                code={JSON.stringify(difference(itemPrompt, currentPrompt), undefined, 4)}
              />
            </ScrollableArea>
          </TabPanel>
          <TabPanel value="2">
            <ScrollableArea height={400}>
              <SyntaxHighlighter language="json" code={JSON.stringify(itemPrompt, undefined, 4)} />
            </ScrollableArea>
          </TabPanel>
        </TabContext>
      </Stack>
    </Box>
  );
};
