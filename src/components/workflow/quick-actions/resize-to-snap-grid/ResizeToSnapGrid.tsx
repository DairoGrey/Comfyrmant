import React, { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { NodeChange, NodeDimensionChange, NodePositionChange, useNodes } from 'reactflow';

import { IconButton, Tooltip } from '@mui/material';

import Grid4x4Icon from '@mui/icons-material/Grid4x4';

import * as settingsSel from '_state/features/settings/selector';
import * as workflowAct from '_state/features/workflow/slice';
import type { AppDispatch } from '_state/store';

const alignToUp = (value: number, alignment: number) => alignment * Math.ceil(Math.abs(value / alignment));

export const ResizeToSnapGrid = () => {
  const nodes = useNodes();

  const dispatch: AppDispatch = useDispatch();

  const snapGrid = useSelector(settingsSel.getWorkflowSnapGrid);

  const tooltip = (
    <FormattedMessage
      id="ui.quick-actions.resize-to-snap-grip.tooltip"
      description="ResizeToSnapGrid button description tooltip"
      defaultMessage="Resize to snap grid"
    />
  );

  const handleClick = useCallback(() => {
    const changes: NodeChange[] = nodes
      .filter((node) => node.width && node.height)
      .flatMap((node) => [
        {
          id: node.id,
          type: 'dimensions',
          dimensions: {
            width: alignToUp(node.width!, snapGrid),
            height: alignToUp(node.height!, snapGrid),
          },
          resizing: true,
          updateStyle: true,
        } satisfies NodeDimensionChange,
        {
          id: node.id,
          type: 'position',
          position: {
            x: alignToUp(node.position.x!, snapGrid),
            y: alignToUp(node.position.y!, snapGrid),
          },
          dragging: false,
        } satisfies NodePositionChange,
      ]);

    dispatch(workflowAct.applyNodeChanges(changes));
  }, [nodes, snapGrid]);

  return (
    <Tooltip title={tooltip}>
      <IconButton color="inherit" onClick={handleClick}>
        <Grid4x4Icon />
      </IconButton>
    </Tooltip>
  );
};
