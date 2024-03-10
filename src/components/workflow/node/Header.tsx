import { FC, memo } from 'react';
import React from 'react';

import { Stack, Typography } from '@mui/material';

import { ProgressBar } from './ProgressBar';

type Props = {
  id: string;
  title: string;

  tags?: React.ReactNode;
  lockStatus?: React.ReactNode;
};

export const Header: FC<Props> = memo(({ id, title, tags, lockStatus }) => {
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
            <Typography component="span" color="text.secondary" variant="caption" fontSize="8px" whiteSpace="nowrap">
              {id}
            </Typography>
            <Typography component="h6" color="text.primary" variant="subtitle2" whiteSpace="nowrap">
              {title}
            </Typography>
            {tags}
          </Stack>
          {lockStatus}
        </Stack>
        <ProgressBar id={id} />
      </Stack>
    </>
  );
});
Header.displayName = 'Header';
