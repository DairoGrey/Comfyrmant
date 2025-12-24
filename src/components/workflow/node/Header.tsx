import { FC, memo } from 'react';
import React from 'react';

import { Stack, Typography } from '@mui/material';

import { NodeColor } from '_state/features/workflow/types';

import { ProgressBar } from './ProgressBar';

type Props = {
  id: string;
  title: string;

  nodeColor?: NodeColor;
  tags?: React.ReactNode;
  lockStatus?: React.ReactNode;
  bypassStatus?: React.ReactNode;
};

export const Header: FC<Props> = memo(({ id, title, nodeColor, tags, lockStatus, bypassStatus }) => {
  return (
    <>
      <Stack position="relative">
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          px={2}
          py={1}
          gap={1}
          overflow="hidden"
          flexShrink={0}
        >
          <Stack>
            <Typography component="span" color="text.secondary" variant="caption" fontSize="10px" whiteSpace="nowrap">
              {id}
            </Typography>
            <Typography component="h6" color="text.primary" variant="subtitle2" whiteSpace="nowrap">
              {title}
            </Typography>
            {tags}
          </Stack>
          <Stack direction="row" gap={0.5}>
            {lockStatus}
            {bypassStatus}
          </Stack>
        </Stack>
        <ProgressBar id={id} nodeColor={nodeColor} />
      </Stack>
    </>
  );
});
Header.displayName = 'Header';
