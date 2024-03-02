import React from 'react';
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';
import { ReactFlowProvider } from 'reactflow';

import { Divider, Stack } from '@mui/material';

import { StatusBlock } from '_components/status-block';
import { Workflow } from '_components/workflow';
import * as apiQueries from '_state/features/api/slice';
import * as hubSel from '_state/features/hub/selector';

import { ExportToFileButton } from './WorkflowPage/components/ExportToFileButton';
import { ImportFromFileButton } from './WorkflowPage/components/ImportFromFileButton';
import { QueuePromptButton } from './WorkflowPage/components/QueuePromptButton';
import { RedoButton } from './WorkflowPage/components/RedoButton';
import { UndoButton } from './WorkflowPage/components/UndoButton';

export const WorkflowPage = () => {
  const { isLoading } = apiQueries.useGetObjectInfoQuery();

  if (isLoading) {
    return <div>Loading</div>;
  }

  return (
    <ReactFlowProvider>
      <Workflow />
    </ReactFlowProvider>
  );
};

export const WorkflowAppBarWidgets = () => {
  const remainingQueue = useSelector(hubSel.getRemainingQueue);
  const executedPrompts = useSelector(hubSel.getExecutedPrompts);

  return (
    <>
      <Divider flexItem variant="middle" orientation="vertical" />
      <Stack direction="row" gap={1}>
        <StatusBlock
          value={remainingQueue}
          label={
            <FormattedMessage
              id="ui.app-bar.widgets.workflow.status-block.remaining-queue"
              defaultMessage="Remaining queue"
            />
          }
        />
        <Divider flexItem variant="middle" orientation="vertical" />
        <StatusBlock
          value={executedPrompts}
          label={
            <FormattedMessage
              id="ui.app-bar.widgets.workflow.status-block.executed-prompts"
              defaultMessage="Executed prompts"
            />
          }
        />
        <Divider flexItem variant="middle" orientation="vertical" />
        <QueuePromptButton />
        <Divider flexItem variant="middle" orientation="vertical" />
        <ExportToFileButton />
        <ImportFromFileButton />
        <Divider flexItem variant="middle" orientation="vertical" />
        <UndoButton />
        <RedoButton />
      </Stack>
    </>
  );
};
