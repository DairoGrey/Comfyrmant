import { FC, memo } from 'react';
import React from 'react';

import kebabCase from 'lodash/kebabCase';

import { Chip, Stack } from '@mui/material';

type Props = {
  tags: string[];
  onDelete: (tag: string) => void;
};

export const Tags: FC<Props> = memo(({ tags, onDelete }) => {
  return (
    <Stack>
      {tags.map((tag) => (
        <Chip key={kebabCase(tag)} label={tag} onDelete={() => onDelete(tag)} />
      ))}
    </Stack>
  );
});
