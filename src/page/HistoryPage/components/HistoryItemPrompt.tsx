import React, { FC, useState } from 'react';

import isEqual from 'lodash/isEqual';
import isObject from 'lodash/isObject';
import transform from 'lodash/transform';

import TabContext from '@mui/lab/TabContext';
import TabPanel from '@mui/lab/TabPanel';

import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Button,
  Stack,
  Tab,
  Tabs,
} from '@mui/material';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { ScrollableArea } from '_components/scrollable-area';
import { SyntaxHighlighter } from '_components/syntax-highlighter';
import { PromptNodeData } from '_state/features/api/types';

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
  currentPrompt: Record<string, PromptNodeData>;
  itemPrompt: Record<string, PromptNodeData>;
};

export const HistoryItemPrompt: FC<Props> = ({ currentPrompt, itemPrompt }) => {
  const [tab, setTab] = useState('0');

  return (
    <Accordion component={Stack}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>Prompt</AccordionSummary>
      <AccordionDetails>
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
      </AccordionDetails>
      <AccordionActions>
        <Button>Use prompt data</Button>
      </AccordionActions>
    </Accordion>
  );
};
