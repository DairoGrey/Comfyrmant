import React, { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch } from 'react-redux';

import { Button } from '@mui/material';

import QueueIcon from '@mui/icons-material/Queue';

import * as workflowAct from '_state/features/workflow/slice';

export const QueuePromptButton = () => {
  const dispatch = useDispatch();

  const handleQueuePrompt = useCallback(() => {
    dispatch(workflowAct.queuePrompt());
  }, []);

  return (
    <Button color="inherit" startIcon={<QueueIcon />} onClick={handleQueuePrompt}>
      {<FormattedMessage id="ui.app-bar.widgets.workflow.button.queue-prompt" defaultMessage="Queue prompt" />}
    </Button>
  );
};
