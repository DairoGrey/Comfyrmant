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

const PARSER: Record<string, (v: unknown) => unknown> = {
  INT: (v: unknown) => {
    if (typeof v !== 'string') {
      return null;
    }

    const n = Number.parseInt(v);

    return Number.isNaN(n) ? null : Number(n.toFixed(0));
  },
  FLOAT: (v: unknown) => {
    if (typeof v !== 'string') {
      return null;
    }

    const n = Number.parseFloat(v);

    return Number.isNaN(n) ? null : Number(n.toFixed(2));
  },
  STRING: (v: unknown) => v,
};

const SERIALIZER: Record<string, (v: unknown) => string> = {
  INT: (v: unknown) => (v === null ? '' : Number(v).toFixed(0)),
  FLOAT: (v: unknown) => (v === null || Number.isNaN(v) ? '' : Number(v).toFixed(2)),
  STRING: (v: unknown) => v as string,
};

type NumberAdornmentProps = {
  value?: unknown;
  input?: NodeInputState;
  widget?: NodeWidgetState;
  onChange: (value: unknown) => void;
  onOptionsChange: (options: Record<string, unknown>) => void;
};

const IntNumberAdornment: FC<NumberAdornmentProps> = ({ value, widget, input, onChange, onOptionsChange }) => {
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
};

const FloatNumberAdornment: FC<NumberAdornmentProps> = ({ value, input, onChange }) => {
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
};

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

  const parse = PARSER[type];
  const serialize = SERIALIZER[type];

  const Adornment = ADORNMENT[type] || null;

  const endAdornment = Adornment ? (
    <Adornment
      isInt={type === 'INT'}
      value={value}
      widget={widget}
      options={input?.options}
      onChange={onChange}
      onOptionsChange={onOptionsChange}
    />
  ) : null;

  return (
    <TextField
      size="small"
      placeholder="Value"
      multiline={multiline}
      minRows={multiline ? 3 : undefined}
      label={name}
      value={serialize(value)}
      InputProps={{
        endAdornment,
      }}
      onFocus={(e) => e.target.select()}
      onChange={(e) => onChange(parse(e.target.value))}
    />
  );
});
