import { FC, memo } from 'react';
import React from 'react';

import { Stack } from '@mui/material';

import { NodeInputState, NodeOutputState } from '_state/features/workflow/types';

import { Input, Output } from './Handle';

type Props = {
  inputs: Record<string, NodeInputState>;
  outputs: Record<string, NodeOutputState>;

  isConnectable: boolean;
};

export const Pins: FC<Props> = memo(({ isConnectable, inputs, outputs }) => {
  return (
    <Stack direction="row" gap={1} py={1} justifyContent="space-between" flexGrow={0} flexShrink={0}>
      <Stack>
        {Object.values(inputs)
          .filter((input) => !input.hidden)
          .map((input) => (
            <Input key={input.name} input={input} isConnectable={isConnectable} />
          ))}
      </Stack>
      <Stack>
        {Object.values(outputs).map((output) => (
          <Output key={output.name} output={output} isConnectable={isConnectable} />
        ))}
      </Stack>
    </Stack>
  );
});
Pins.displayName = 'Pins';
