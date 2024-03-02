import React, { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';

import { Box, IconButton, Tooltip } from '@mui/material';

import RedoIcon from '@mui/icons-material/Redo';

import * as workflowSel from '_state/features/workflow/selector';
import * as workflowAct from '_state/features/workflow/slice';

export const RedoButton = () => {
  const dispatch = useDispatch();

  const canRedo = useSelector(workflowSel.getCanRedo);

  const handleWorkflowRedo = useCallback(() => {
    dispatch(workflowAct.undo());
  }, []);

  return (
    <Tooltip title={<FormattedMessage id="ui.app-bar.widgets.workflow.button.redo" defaultMessage="Redo" />}>
      <Box display="flex" alignItems="center">
        <IconButton color="inherit" disabled={!canRedo} onClick={handleWorkflowRedo} sx={{ alignSelf: 'center' }}>
          <RedoIcon />
        </IconButton>
      </Box>
    </Tooltip>
  );
};
