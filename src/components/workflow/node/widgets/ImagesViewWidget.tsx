import React, { memo, useState } from 'react';
import { FC } from 'react';

import { Pagination, Stack } from '@mui/material';

import { PromptOutput } from '_state/features/hub/slice';
import { NodeInputState, NodeOutputState, NodeWidgetState } from '_state/features/workflow/types';

type Props = {
  widget?: NodeWidgetState;
  input?: NodeInputState;
  output?: NodeOutputState;

  value?: PromptOutput['images'];
};

export const ImagesViewWidget: FC<Props> = memo(({ value }) => {
  if (!value) {
    return;
  }

  const [page, setPage] = useState(0);

  if (value.length === 1) {
    return <img src={value[0].url} loading="lazy" />;
  }

  return (
    <Stack gap={2}>
      <img src={value[page].url} loading="lazy" />
      <Pagination size="small" count={value.length} onChange={(e, page) => setPage(page - 1)} />
    </Stack>
  );
});
