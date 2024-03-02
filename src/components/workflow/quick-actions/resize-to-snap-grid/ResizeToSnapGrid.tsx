import React, { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch } from 'react-redux';

import { IconButton, Tooltip } from '@mui/material';

import Grid4x4Icon from '@mui/icons-material/Grid4x4';

import * as workflowAct from '_state/features/workflow/slice';
import type { AppDispatch } from '_state/store';

export const ResizeToSnapGrid = () => {
  const dispatch: AppDispatch = useDispatch();

  const tooltip = (
    <FormattedMessage
      id="ui.quick-actions.resize-to-snap-grip.tooltip"
      description="ResizeToSnapGrid button description tooltip"
      defaultMessage="Resize to snap grid"
    />
  );

  const handleClick = useCallback(() => {
    dispatch(workflowAct.resizeToSnapGrid());
  }, []);

  return (
    <Tooltip title={tooltip}>
      <IconButton color="inherit" onClick={handleClick}>
        <Grid4x4Icon />
      </IconButton>
    </Tooltip>
  );
};
