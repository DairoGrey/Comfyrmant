import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import { NodeToolbar, NodeToolbarProps, Position } from 'reactflow';

import { Alert, Stack, Typography } from '@mui/material';

import * as workflowAct from '_state/features/workflow/slice';
import { NodeErrorState } from '_state/features/workflow/types';

export const Errors: FC<
  Omit<NodeToolbarProps, 'position'> & { id: string; errors?: Record<string, NodeErrorState> }
> = ({ id, errors, ...props }) => {
  const dispatch = useDispatch();

  return (
    <NodeToolbar isVisible={Boolean(errors)} position={Position.Bottom} {...props}>
      <Stack gap={1}>
        {errors &&
          Object.values(errors).map((error) => (
            <Alert
              key={error.name}
              severity="error"
              onClose={() => dispatch(workflowAct.resolveNodeError({ id, error: error.name }))}
            >
              Input{' '}
              <Typography component="span" fontWeight="bold">
                {error.name}
              </Typography>{' '}
              is not connected
            </Alert>
          ))}
      </Stack>
    </NodeToolbar>
  );
};
