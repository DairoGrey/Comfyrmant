import React, { FC, memo } from 'react';
import { useSelector } from 'react-redux';
import { Position } from 'reactflow';

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
import { NodeInput, NodeOutput } from '_state/features/workflow/types';
import { useColorMode } from '_theme';

import { colorByType } from '../utils/colorByType';

const HANDLE_TYPE: Record<WorkflowHandleType, typeof CircleIcon> = {
  [WorkflowHandleType.Circle]: CircleIcon,
  [WorkflowHandleType.Square]: SquareIcon,
  [WorkflowHandleType.Arrow]: ArrowForwardIosIcon,
  [WorkflowHandleType.Hexagon]: HexagonIcon,
};

const HandleMarker = styled(Box)(() => ({
  fontSize: 14,
}));

type HandleViewProps = {
  id: string;
  label?: string;
  color?: string;
  position: Position;
  children?: React.ReactNode;
};

const HandleView: FC<HandleViewProps> = memo(({ label, color, children, ...props }) => {
  const { position, id } = props;

  const isLeft = position === Position.Left;
  const isRight = position === Position.Right;

  const handleType = useSelector(settingsSel.getWorkflowHandleType);

  const HandleType = HANDLE_TYPE[handleType] || CircleIcon;

  return (
    <Stack className="nodrag nopan" direction={isLeft ? 'row' : 'row-reverse'} gap={0.5} alignItems="center">
      <Box position="relative" width={18} height={18} left={isLeft ? 2 : undefined} right={isRight ? 2 : undefined}>
        <HandleMarker color={color}>
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
HandleView.displayName = 'HandleView';

type InputViewProps = {
  input: NodeInput;
};

export const InputView: FC<InputViewProps> = ({ input }) => {
  const colorMode = useColorMode();

  const defaultValue = getInputDefaultValue(input);

  return (
    <HandleView id={input.name} position={Position.Left} label={input.name} color={colorByType(input.type, colorMode)}>
      {!isUndefined(defaultValue) && (
        <Tooltip title={String(defaultValue)} placement="right">
          <InfoOutlined color="disabled" sx={{ fontSize: 10 }} />
        </Tooltip>
      )}
    </HandleView>
  );
};

type OutputViewProps = {
  output: NodeOutput;
};

export const OutputView: FC<OutputViewProps> = ({ output }) => {
  const colorMode = useColorMode();

  return (
    <HandleView
      id={output.name}
      position={Position.Right}
      label={output.name}
      color={colorByType(output.type, colorMode)}
    />
  );
};
