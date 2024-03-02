import React, { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';

import { IconButton, Tooltip } from '@mui/material';

import FormatColorResetIcon from '@mui/icons-material/FormatColorReset';

import * as settingsSel from '_state/features/settings/selector';
import * as workflowAct from '_state/features/workflow/slice';
import type { AppDispatch } from '_state/store';

export const ResetAllColors = () => {
  const dispatch: AppDispatch = useDispatch();

  const workflowSnapGrid = useSelector(settingsSel.getWorkflowSnapGrid);

  const tooltip = (
    <FormattedMessage
      id="ui.quick-actions.reset-all-colors.tooltip"
      description="ResetAllColors button description tooltip"
      defaultMessage="Reset all colors"
    />
  );

  const handleClick = useCallback(() => {
    dispatch(workflowAct.resetNodesColor());
  }, [workflowSnapGrid]);

  return (
    <Tooltip title={tooltip}>
      <IconButton color="inherit" onClick={handleClick}>
        <FormatColorResetIcon />
      </IconButton>
    </Tooltip>
  );
};
