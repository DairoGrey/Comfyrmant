import React, { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';

import { Box, IconButton, Tooltip } from '@mui/material';

import UndoIcon from '@mui/icons-material/Undo';

import * as workflowSel from '_state/features/workflow/selector';
import * as workflowAct from '_state/features/workflow/slice';

export const UndoButton = () => {
  const dispatch = useDispatch();

  const canUndo = useSelector(workflowSel.getCanUndo);

  const handleWorkflowUndo = useCallback(() => {
    dispatch(workflowAct.undo());
  }, []);

  return (
    <Tooltip title={<FormattedMessage id="ui.app-bar.widgets.workflow.button.undo" defaultMessage="Undo" />}>
      <Box display="flex" alignItems="center">
        <IconButton color="inherit" disabled={!canUndo} onClick={handleWorkflowUndo} sx={{ alignSelf: 'center' }}>
          <UndoIcon />
        </IconButton>
      </Box>
    </Tooltip>
  );
};
