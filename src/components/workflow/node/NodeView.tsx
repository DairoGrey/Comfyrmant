import { FC, memo, useCallback } from 'react';
import React from 'react';

import * as uuid from 'uuid';

import { Divider, Paper, Stack, Typography } from '@mui/material';

import { NodeType } from '_state/features/workflow/types';

import { PinsView } from './PinsView';

type Props = {
  nodeType: NodeType;

  onClick?: (e: React.MouseEvent, type: string) => void;
  onDragStart?: (e: React.DragEvent, type: string) => void;
};

export const NodeView: FC<Props> = memo(({ nodeType, onClick, onDragStart }) => {
  const { type, title, inputs, outputs } = nodeType;

  const hasPins = Object.values(inputs).length > 0 || Object.keys(outputs).length > 0;

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      onClick?.(e, type);
    },
    [type, onClick],
  );
  const handleDragStart = useCallback(
    (e: React.DragEvent) => {
      onDragStart?.(e, type);
    },
    [type, onDragStart],
  );

  return (
    <Stack
      component={Paper}
      elevation={3}
      height="min-content"
      width="min-content"
      direction="column"
      flex={1}
      draggable
      onClick={handleClick}
      onDragStart={handleDragStart}
      sx={{ userSelect: 'none' }}
    >
      <Stack position="relative">
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          px={2}
          py={1}
          overflow="hidden"
          flexShrink={0}
        >
          <Stack>
            <Typography component="span" color="text.secondary" variant="caption" fontSize="8px" whiteSpace="nowrap">
              {uuid.NIL}
            </Typography>
            <Typography component="h6" color="text.primary" variant="subtitle2" whiteSpace="nowrap">
              {title}
            </Typography>
          </Stack>
        </Stack>
      </Stack>
      {hasPins && (
        <>
          <Divider />
          <PinsView inputs={inputs} outputs={outputs} />
        </>
      )}
    </Stack>
  );
});
