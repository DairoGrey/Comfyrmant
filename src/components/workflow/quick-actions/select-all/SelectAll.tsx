import React, { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch } from 'react-redux';

import { IconButton, Tooltip } from '@mui/material';

import DoneAllIcon from '@mui/icons-material/DoneAll';

import * as workflowAct from '_state/features/workflow/slice';
import type { AppDispatch } from '_state/store';

export const SelectAll = () => {
  const dispatch: AppDispatch = useDispatch();

  const tooltip = (
    <FormattedMessage
      id="ui.quick-actions.select-all.tooltip"
      description="SelectAll button description tooltip"
      defaultMessage="Select all"
    />
  );

  const handleClick = useCallback(() => {
    dispatch(workflowAct.selectAll());
  }, []);

  return (
    <Tooltip title={tooltip}>
      <IconButton color="inherit" onClick={handleClick}>
        <DoneAllIcon />
      </IconButton>
    </Tooltip>
  );
};
