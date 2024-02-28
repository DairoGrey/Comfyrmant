import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ReactFlowProvider } from 'reactflow';

import { Button, Divider, Stack, Typography } from '@mui/material';

import QueueIcon from '@mui/icons-material/Queue';

import { Workflow } from '_components/workflow';
import * as apiQueries from '_state/features/api/slice';
import * as hubSel from '_state/features/hub/selector';
import * as workflowAct from '_state/features/workflow/slice';

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

  const dispatch = useDispatch();

  const handleQueuePrompt = useCallback(() => {
    dispatch(workflowAct.queuePrompt());
  }, []);

  return (
    <>
      <Divider flexItem variant="middle" orientation="vertical" />
      <Stack direction="row" gap={1}>
        <Stack px={2} justifyContent="center">
          <Typography variant="subtitle1" fontWeight="bold" lineHeight={1} color="inherit">
            {remainingQueue}
          </Typography>
          <Typography variant="caption" color="inherit" lineHeight={1} sx={{ opacity: 0.6 }}>
            Remaining queue
          </Typography>
        </Stack>
        <Divider flexItem variant="middle" orientation="vertical" />
        <Stack px={2} justifyContent="center">
          <Typography variant="subtitle1" fontWeight="bold" lineHeight={1} color="inherit">
            {executedPrompts}
          </Typography>
          <Typography variant="caption" color="inherit" lineHeight={1} sx={{ opacity: 0.6 }}>
            Executed prompts
          </Typography>
        </Stack>
        <Divider flexItem variant="middle" orientation="vertical" />
        <Button color="inherit" startIcon={<QueueIcon />} onClick={handleQueuePrompt}>
          Queue prompt
        </Button>
      </Stack>
    </>
  );
};
