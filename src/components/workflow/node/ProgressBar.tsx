import { FC, useCallback } from 'react';
import React from 'react';
import { useSelector } from 'react-redux';

import { Box, LinearProgress, useTheme } from '@mui/material';

import * as hubSel from '_state/features/hub/selector';
import { NodeColor } from '_state/features/workflow/types';
import { RootState } from '_state/store';
import { useColorMode } from '_theme';

import { progressBarByType } from '../utils/backgroundColor';

const normalise = (value: number, max: number, min = 0) => ((value - min) * 100) / (max - min);

type Props = {
  id: string;
  nodeColor?: NodeColor;
};

export const ProgressBar: FC<Props> = ({ id, nodeColor }) => {
  const theme = useTheme();
  const getProgress = useCallback((state: RootState) => hubSel.getProgress(state, id), [id]);

  const colorMode = useColorMode();

  const [isExecuting, progress] = useSelector(getProgress);

  const [backgroundColor, color] = nodeColor ? progressBarByType(nodeColor, theme, colorMode) : [];

  let progressBar: React.ReactNode = undefined;

  if (isExecuting) {
    progressBar = progress ? (
      <LinearProgress
        sx={{ backgroundColor, '.MuiLinearProgress-barColorPrimary': { backgroundColor: color } }}
        variant="determinate"
        value={normalise(progress.currentStep, progress.steps)}
      />
    ) : (
      <LinearProgress
        sx={{ backgroundColor, '.MuiLinearProgress-barColorPrimary': { backgroundColor: color } }}
        variant="indeterminate"
      />
    );
  }

  return (
    <Box position="absolute" bottom={0} left={0} right={0} height={4}>
      {progressBar}
    </Box>
  );
};
