import React, { memo, useCallback, useEffect } from 'react';
import { FC } from 'react';

import { eventBus, EventName } from '_eventBus';

import { IconButton, InputAdornment, Stack, TextField, Tooltip } from '@mui/material';

import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import ShuffleOnIcon from '@mui/icons-material/ShuffleOn';

import { NodeInputState, NodeOutputState, NodeWidgetState } from '_state/features/workflow/types';

import { useFloatSteps } from './hooks/useFloatSteps';
import { useIntSteps } from './hooks/useIntSteps';

const PARSER: Record<string, (v: unknown, precision?: number) => unknown> = {
  INT: (v: unknown, places: number = 0) => {
    if (typeof v !== 'string') {
      return null;
    }

    const n = Number.parseInt(v);

    return Number.isNaN(n) ? null : Number(n.toFixed(places));
  },
  FLOAT: (v: unknown, places: number = 2) => {
    if (typeof v !== 'string') {
      return null;
    }

    const n = Number.parseFloat(v);

    return Number.isNaN(n) ? null : Number(n.toFixed(places));
  },
  STRING: (v: unknown) => v,
};

const SERIALIZER: Record<string, (v: unknown, places?: number) => string> = {
  INT: (v: unknown, places: number = 0) => (v === null ? '' : Number(v).toFixed(places)),
  FLOAT: (v: unknown, places: number = 2) => (v === null || Number.isNaN(v) ? '' : Number(v).toFixed(places)),
  STRING: (v: unknown) => v as string,
};

type NumberAdornmentProps = {
  value?: unknown;
  input?: NodeInputState;
  widget?: NodeWidgetState;
  onChange: (value: unknown) => void;
  onOptionsChange: (options: Record<string, unknown>) => void;
};

const IntNumberAdornment: FC<NumberAdornmentProps> = memo(({ value, widget, input, onChange, onOptionsChange }) => {
  const { canStepDown, canStepUp, handleStepDown, handleStepUp, handleRandomTick } = useIntSteps(
    onChange,
    input?.options,
    value,
  );

  const random = widget?.options?.['random'] === true;

  const handleShuffle = useCallback(() => {
    onOptionsChange({ random: !random });
  }, [onOptionsChange, random]);

  const randomIcon = random ? <ShuffleOnIcon color="success" fontSize="inherit" /> : <ShuffleIcon fontSize="inherit" />;

  const handleRandomTickEvent = useCallback(() => {
    if (random) {
      handleRandomTick();
    }
  }, [random, handleRandomTick]);

  useEffect(() => {
    return eventBus.subscribe(EventName.RandomTick, handleRandomTickEvent);
  }, [handleRandomTickEvent]);

  return (
    <InputAdornment component={Stack} position="end" direction="row">
      <Tooltip title={random ? 'Disable random' : 'Enable random'}>
        <IconButton edge="end" size="small" onClick={handleShuffle}>
          {randomIcon}
        </IconButton>
      </Tooltip>
      <Tooltip title="Decrease">
        <span>
          <IconButton disabled={!canStepDown} edge="end" size="small" onClick={handleStepDown}>
            <RemoveIcon fontSize="inherit" />
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title="Increase">
        <span>
          <IconButton disabled={!canStepUp} edge="end" size="small" onClick={handleStepUp}>
            <AddIcon fontSize="inherit" />
          </IconButton>
        </span>
      </Tooltip>
    </InputAdornment>
  );
});
IntNumberAdornment.displayName = 'IntNumberAdornment';

const FloatNumberAdornment: FC<NumberAdornmentProps> = memo(({ value, input, onChange }) => {
  const { canStepDown, canStepUp, handleStepDown, handleStepUp } = useFloatSteps(onChange, input?.options, value);

  return (
    <InputAdornment component={Stack} position="end" direction="row">
      <Tooltip title="Decrease">
        <span>
          <IconButton disabled={!canStepDown} edge="end" size="small" onClick={handleStepDown}>
            <RemoveIcon fontSize="inherit" />
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title="Increase">
        <span>
          <IconButton disabled={!canStepUp} edge="end" size="small" onClick={handleStepUp}>
            <AddIcon fontSize="inherit" />
          </IconButton>
        </span>
      </Tooltip>
    </InputAdornment>
  );
});
FloatNumberAdornment.displayName = 'FloatNumberAdornment';

const ADORNMENT: Record<string, any> = {
  INT: IntNumberAdornment,
  FLOAT: FloatNumberAdornment,
};

type Props = {
  widget?: NodeWidgetState;
  input?: NodeInputState;
  output?: NodeOutputState;

  value?: unknown;
  onChange: (value: unknown) => void;
  onOptionsChange: (options: Record<string, unknown>) => void;
};

export const InputFieldWidget: FC<Props> = memo(({ value, widget, input, output, onChange, onOptionsChange }) => {
  const type = input?.type || output?.type;

  if (!type || Array.isArray(type)) {
    return null;
  }

  const name = input?.name || output?.name;
  const multiline = (input?.options?.multiline || widget?.options?.multiline) as boolean | undefined;
  const round = input?.options?.round as number | undefined;

  const places = round && round < 1 ? Math.abs(Math.log10(round) + 1) : undefined;

  const parse = PARSER[type];
  const serialize = SERIALIZER[type];

  const Adornment: FC<NumberAdornmentProps> | null = ADORNMENT[type] || null;

  const endAdornment = Adornment ? (
    <Adornment value={value} widget={widget} input={input} onChange={onChange} onOptionsChange={onOptionsChange} />
  ) : null;

  return (
    <TextField
      size="small"
      placeholder="Value"
      multiline={multiline}
      minRows={multiline ? 3 : undefined}
      label={name}
      value={serialize(value, places)}
      InputProps={{
        endAdornment,
      }}
      onChange={(e) => onChange(parse(e.target.value, places))}
    />
  );
});
InputFieldWidget.displayName = 'InputFieldWidget';
