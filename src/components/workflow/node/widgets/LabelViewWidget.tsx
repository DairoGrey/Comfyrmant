import React, { memo } from 'react';
import { FC } from 'react';

import { Typography } from '@mui/material';

import { NodeInputState, NodeOutputState, NodeWidgetState } from '_state/features/workflow/types';

type Props = {
  widget?: NodeWidgetState;
  input?: NodeInputState;
  output?: NodeOutputState;

  value?: unknown;
};

export const LabelViewWidget: FC<Props> = memo(({ value }) => {
  if (!value) {
    return;
  }

  return <Typography>{value.toString()}</Typography>;
});
LabelViewWidget.displayName = 'LabelViewWidget';
