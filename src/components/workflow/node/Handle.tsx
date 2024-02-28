import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { Handle as _Handle, HandleProps, Position } from 'reactflow';

import { Box, Stack, styled, Typography } from '@mui/material';

import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CircleIcon from '@mui/icons-material/Circle';
import HexagonIcon from '@mui/icons-material/Hexagon';
import SquareIcon from '@mui/icons-material/Square';

import * as settingsSel from '_state/features/settings/selector';
import { WorkflowHandleType } from '_state/features/settings/types';
import { NodeInput, NodeOutput } from '_state/features/workflow/types';
import { useColorMode } from '_theme';

import { colorByType } from '../utils/colorByType';

const HANDLE_TYPE: Record<WorkflowHandleType, typeof CircleIcon> = {
  [WorkflowHandleType.Circle]: CircleIcon,
  [WorkflowHandleType.Square]: SquareIcon,
  [WorkflowHandleType.Arrow]: ArrowForwardIosIcon,
  [WorkflowHandleType.Hexagon]: HexagonIcon,
};

const HandleMarker = styled(_Handle)(({ theme }) => ({
  '&.react-flow__handle': {
    display: 'flex',
    fontSize: theme.typography.fontSize,
    background: 'none',
  },
}));

type ExtraProps = { label?: string; color?: string };

const Handle: FC<HandleProps & ExtraProps> = ({ label, color, ...props }) => {
  const { position, id } = props;

  const isLeft = position === Position.Left;
  const isRight = position === Position.Right;

  const handleType = useSelector(settingsSel.getWorkflowHandleType);

  const HandleType = HANDLE_TYPE[handleType] || CircleIcon;

  return (
    <Stack direction={isLeft ? 'row' : 'row-reverse'} gap={0.5} alignItems="center" sx={{ pointerEvents: 'none' }}>
      <Box
        position="relative"
        width={18}
        height={18}
        left={isLeft ? 8 : undefined}
        right={isRight ? 8 : undefined}
        sx={{ pointerEvents: 'none' }}
      >
        <HandleMarker {...props} color={color}>
          <HandleType fontSize="inherit" sx={{ pointerEvents: 'none', fill: color }} />
        </HandleMarker>
      </Box>
      <Typography
        component="span"
        variant="body2"
        color="text.secondary"
        whiteSpace="nowrap"
        sx={{ pointerEvents: 'none' }}
      >
        {label ?? id}
      </Typography>
    </Stack>
  );
};

type InputProps = {
  input: NodeInput;

  isConnectable: boolean;
};

export const Input: FC<InputProps> = ({ input, isConnectable }) => {
  const colorMode = useColorMode();

  return (
    <Handle
      key={input.name}
      id={input.name}
      type="target"
      position={Position.Left}
      isConnectable={isConnectable}
      label={input.name}
      color={colorByType(input.type, colorMode)}
    />
  );
};

type OutputProps = {
  output: NodeOutput;

  isConnectable: boolean;
};

export const Output: FC<OutputProps> = ({ output, isConnectable }) => {
  const colorMode = useColorMode();

  return (
    <Handle
      key={output.name}
      id={output.name}
      type="source"
      position={Position.Right}
      isConnectable={isConnectable}
      label={output.name}
      color={colorByType(output.type, colorMode)}
    />
  );
};
