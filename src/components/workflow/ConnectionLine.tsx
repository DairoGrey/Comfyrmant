import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { ConnectionLineComponentProps, HandleElement, Node, Position } from 'reactflow';

import { useTheme } from '@mui/material';

import * as settingsSel from '_state/features/settings/selector';
import { NodeStateData } from '_state/features/workflow/types';
import { useColorMode } from '_theme';

import { colorByType } from './utils/colorByType';
import { EDGE_TYPE } from './utils/edgeTypes';

const getConnectionType = (fromNode?: Node<NodeStateData>, fromHandle?: HandleElement) => {
  if (!fromNode || !fromHandle) {
    return;
  }

  const isOutput = fromHandle.position === Position.Right;
  const id = fromHandle.id;

  if (!id) {
    return;
  }

  return (isOutput ? fromNode.data.outputs : fromNode.data.inputs)[id].type;
};

const mapToPathProps = ({ fromX, fromY, fromPosition, toX, toY, toPosition }: ConnectionLineComponentProps) => ({
  sourceX: fromX,
  sourceY: fromY,
  targetX: toX,
  targetY: toY,
  sourcePosition: fromPosition,
  targetPosition: toPosition,
});

export const ConnectionLine: FC<ConnectionLineComponentProps> = ({ fromNode, fromHandle, ...props }) => {
  const theme = useTheme();
  const colorMode = useColorMode();

  const { toX, toY } = props;

  const edgeType = useSelector(settingsSel.getWorkflowEdgeType);

  const [path] = EDGE_TYPE[edgeType](mapToPathProps(props));

  const type = getConnectionType(fromNode, fromHandle);
  const color = type ? colorByType(type, colorMode) : theme.palette.divider;

  return (
    <g>
      <path fill="none" stroke={color} strokeWidth={1.5} d={path} />
      <circle cx={toX} cy={toY} fill={color} r={3} stroke={theme.palette.divider} strokeWidth={1.5} />
    </g>
  );
};
