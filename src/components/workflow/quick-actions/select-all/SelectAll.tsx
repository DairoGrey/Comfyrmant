import React, { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { NodeChange, NodeSelectionChange, useNodes } from 'reactflow';

import { IconButton, Tooltip } from '@mui/material';

import DoneAllIcon from '@mui/icons-material/DoneAll';

import * as settingsSel from '_state/features/settings/selector';
import * as workflowAct from '_state/features/workflow/slice';
import type { AppDispatch } from '_state/store';

export const SelectAll = () => {
  const nodes = useNodes();

  const dispatch: AppDispatch = useDispatch();

  const workflowSnapGrid = useSelector(settingsSel.getWorkflowSnapGrid);

  const tooltip = (
    <FormattedMessage
      id="ui.quick-actions.select-all.tooltip"
      description="SelectAll button description tooltip"
      defaultMessage="Select all"
    />
  );

  const handleClick = useCallback(() => {
    const changes: NodeChange[] = nodes
      .filter((node) => node.width && node.height)
      .map(
        (node) =>
          ({
            id: node.id,
            type: 'select',
            selected: true,
          }) satisfies NodeSelectionChange,
      );

    dispatch(workflowAct.applyNodeChanges(changes));
  }, [nodes, workflowSnapGrid]);

  return (
    <Tooltip title={tooltip}>
      <IconButton color="inherit" onClick={handleClick}>
        <DoneAllIcon />
      </IconButton>
    </Tooltip>
  );
};
