import { FC } from 'react';
import React from 'react';

import * as uuid from 'uuid';

import { Divider, Paper, Stack, Typography } from '@mui/material';

import { NodeType } from '_state/features/workflow/types';

import { PinsView } from './PinsView';

type Props = {
  nodeType: NodeType;

  onClick?: React.MouseEventHandler;
  onDragStart?: React.DragEventHandler;
  onDragEnd?: React.DragEventHandler;
};

export const NodeView: FC<Props> = ({ nodeType, ...props }) => {
  const { title, inputs, outputs } = nodeType;

  const hasPins = Object.values(inputs).length > 0 || Object.keys(outputs).length > 0;

  return (
    <Stack
      {...props}
      component={Paper}
      elevation={3}
      height="min-content"
      width="min-content"
      direction="column"
      flex={1}
      draggable
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
};
