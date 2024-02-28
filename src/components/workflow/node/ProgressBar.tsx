import { FC, useCallback } from 'react';
import React from 'react';
import { useSelector } from 'react-redux';

import { Box, LinearProgress } from '@mui/material';

import * as hubSel from '_state/features/hub/selector';
import { RootState } from '_state/store';

const normalise = (value: number, max: number, min = 0) => ((value - min) * 100) / (max - min);

type Props = {
  id: string;
};

export const ProgressBar: FC<Props> = ({ id }) => {
  const getProgress = useCallback((state: RootState) => hubSel.getProgress(state, id), [id]);

  const [isExecuting, progress] = useSelector(getProgress);

  let progressBar: React.ReactNode = undefined;

  if (isExecuting) {
    progressBar = progress ? (
      <LinearProgress variant="determinate" value={normalise(progress.currentStep, progress.steps)} />
    ) : (
      <LinearProgress variant="indeterminate" />
    );
  }

  return (
    <Box position="absolute" bottom={0} left={0} right={0} height={4}>
      {progressBar}
    </Box>
  );
};
