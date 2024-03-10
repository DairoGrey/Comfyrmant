import React, { FC, memo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Handle as _Handle, HandleProps, Position, useNodeId } from 'reactflow';

import isUndefined from 'lodash/isUndefined';

import { Box, Stack, styled, Tooltip, Typography } from '@mui/material';

import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CircleIcon from '@mui/icons-material/Circle';
import HexagonIcon from '@mui/icons-material/Hexagon';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import SquareIcon from '@mui/icons-material/Square';

import * as settingsSel from '_state/features/settings/selector';
import { WorkflowHandleType } from '_state/features/settings/types';
import { getInputDefaultValue } from '_state/features/workflow/helpers';
import * as workflowSel from '_state/features/workflow/selector';
import { NodeInput, NodeOutput } from '_state/features/workflow/types';
import { RootState } from '_state/store';
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

type ExtraProps = {
  label?: string;
  color?: string;
  children?: React.ReactNode;
};

const Handle: FC<HandleProps & ExtraProps> = memo(({ label, color, children, ...props }) => {
  const { position, id } = props;

  const isLeft = position === Position.Left;
  const isRight = position === Position.Right;

  const handleType = useSelector(settingsSel.getWorkflowHandleType);

  const HandleType = HANDLE_TYPE[handleType] || CircleIcon;

  return (
    <Stack className="nodrag nopan" direction={isLeft ? 'row' : 'row-reverse'} gap={0.5} alignItems="center">
      <Box position="relative" width={18} height={18} left={isLeft ? 8 : undefined} right={isRight ? 8 : undefined}>
        <HandleMarker {...props} color={color}>
          <HandleType fontSize="inherit" sx={{ pointerEvents: 'none', fill: color }} />
        </HandleMarker>
      </Box>
      <Typography component="span" variant="body2" color="text.secondary" whiteSpace="nowrap">
        {label ?? id}
      </Typography>
      {children}
    </Stack>
  );
});
Handle.displayName = 'Handle';

type InputProps = {
  input: NodeInput;

  isConnectable: boolean;
};

export const Input: FC<InputProps> = ({ input, isConnectable }) => {
  const colorMode = useColorMode();

  const nodeId = useNodeId();

  const defaultValue = getInputDefaultValue(input);

  const getIsConnected = useCallback(
    (state: RootState) => workflowSel.getIsNodeInputConnected(state, nodeId!, input.name),
    [nodeId, input],
  );

  const isConnected = useSelector(getIsConnected);

  return (
    <Handle
      id={input.name}
      type="target"
      position={Position.Left}
      isConnectable={isConnectable}
      label={input.name}
      color={colorByType(input.type, colorMode)}
    >
      {!isUndefined(defaultValue) && !isConnected && (
        <Tooltip title={String(defaultValue) as React.ReactNode} placement="right">
          <InfoOutlined color="disabled" sx={{ fontSize: 10 }} />
        </Tooltip>
      )}
    </Handle>
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
      id={output.name}
      type="source"
      position={Position.Right}
      isConnectable={isConnectable}
      label={output.name}
      color={colorByType(output.type, colorMode)}
    />
  );
};
