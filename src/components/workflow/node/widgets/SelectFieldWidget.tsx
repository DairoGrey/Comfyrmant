import React, { memo, useRef, useState } from 'react';
import { FC } from 'react';

import { ClickAwayListener, FormControl, InputLabel, MenuItem, Select } from '@mui/material';

import { NodeInputState, NodeOutputState, NodeWidgetState } from '_state/features/workflow/types';

type Props = {
  widget?: NodeWidgetState;
  input?: NodeInputState;
  output?: NodeOutputState;

  value?: unknown;
  values: unknown[];
  onChange: (value: unknown) => void;
  onOptionsChange: (options: Record<string, unknown>) => void;
};

export const SelectFieldWidget: FC<Props> = memo(({ value, values, input, output, onChange }) => {
  const label = input?.name || output?.name;

  const ref = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);

  return (
    <ClickAwayListener
      disableReactTree
      onClickAway={() => {
        setOpen(false);
      }}
    >
      <FormControl fullWidth>
        <InputLabel>{label}</InputLabel>
        <Select
          ref={ref}
          open={open}
          size="small"
          label={label}
          value={value}
          disabled={false}
          onChange={(e) => {
            onChange(e.target.value);
          }}
          onClick={(e) => {
            if (ref.current?.querySelector('div') === e.target) {
              setOpen(true);
            }
          }}
        >
          {values.map((value) => {
            const v = String(value);

            return (
              <MenuItem key={v} value={v}>
                {v}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </ClickAwayListener>
  );
});
SelectFieldWidget.displayName = 'SelectFieldWidget';
