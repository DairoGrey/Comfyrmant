import { FC, memo } from 'react';
import React from 'react';

import { Stack } from '@mui/material';

import { NodeInputState, NodeOutputState } from '_state/features/workflow/types';

import { InputView, OutputView } from './HandleView';

type Props = {
  inputs: Record<string, NodeInputState>;
  outputs: Record<string, NodeOutputState>;
};

export const PinsView: FC<Props> = memo(({ inputs, outputs }) => {
  return (
    <Stack direction="row" gap={1} py={1} justifyContent="space-between" flexGrow={0} flexShrink={0}>
      <Stack>
        {Object.values(inputs)
          .filter((input) => !input.hidden)
          .map((input) => (
            <InputView key={input.name} input={input} />
          ))}
      </Stack>
      <Stack>
        {Object.values(outputs).map((output) => (
          <OutputView key={output.name} output={output} />
        ))}
      </Stack>
    </Stack>
  );
});
