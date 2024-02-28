import { useCallback, useMemo } from 'react';

import isNumber from 'lodash/isNumber';

export const useFloatSteps = (
  onChange: (value: unknown) => void,
  options?: Record<string, unknown>,
  value?: unknown,
) => {
  const min = options?.min as number | undefined;
  const max = options?.max as number | undefined;
  const step = options?.step as number | undefined;
  const defaultValue = options?.default as number | undefined;

  const change = isNumber(step) ? step : 1;
  const limitUp = isNumber(max) ? max : Number.MAX_SAFE_INTEGER;
  const limitDown = isNumber(min) ? min : Number.MIN_SAFE_INTEGER;

  const canStepUp = !isNumber(value) || value < limitUp;
  const canStepDown = !isNumber(value) || value > limitDown;

  const resetValue = isNumber(defaultValue)
    ? defaultValue
    : !Number.isFinite(limitUp) && !Number.isFinite(limitDown)
      ? 0
      : Math.round((limitUp - limitDown) / 2 + limitDown);

  const handleStepUp = useCallback(() => {
    if (isNumber(value) && value < limitUp) {
      onChange(value + change);
    } else {
      onChange(resetValue);
    }
  }, [value, change, limitUp, onChange]);

  const handleStepDown = useCallback(() => {
    if (isNumber(value) && value > limitDown) {
      onChange(value - change);
    } else {
      onChange(resetValue);
    }
  }, [value, change, limitDown, onChange]);

  return useMemo(
    () => ({ canStepUp, canStepDown, handleStepUp, handleStepDown }),
    [canStepUp, canStepDown, handleStepUp, handleStepDown],
  );
};
