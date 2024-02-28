import { useCallback, useMemo } from 'react';

import isNumber from 'lodash/isNumber';

const UPPER_LIMIT = Number.MAX_SAFE_INTEGER;
const LOWER_LIMIT = Number.MIN_SAFE_INTEGER;

export const useIntSteps = (onChange: (value: unknown) => void, options?: Record<string, unknown>, value?: unknown) => {
  const min = options?.min as number | undefined;
  const max = options?.max as number | undefined;
  const step = options?.step as number | undefined;
  const defaultValue = options?.default as number | undefined;

  const change = isNumber(step) ? step : 1;
  const limitUp = isNumber(max) ? max : UPPER_LIMIT;
  const limitDown = isNumber(min) ? min : LOWER_LIMIT;

  const canStepUp = !isNumber(value) || value < limitUp;
  const canStepDown = !isNumber(value) || value > limitDown;

  const resetValue = isNumber(defaultValue)
    ? defaultValue
    : limitUp === UPPER_LIMIT && limitDown === LOWER_LIMIT
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

  const handleRandomTick = useCallback(() => {
    /**
     * [][][][]
     *         [][][][][][][][]
     **/
    const randomValue = crypto.getRandomValues(new Uint8Array(12));
    const view = new DataView(randomValue.buffer);

    onChange(Number(view.getBigUint64(0) / 100_000n) + view.getUint32(8));
  }, [onChange]);

  return useMemo(
    () => ({ canStepUp, canStepDown, handleStepUp, handleStepDown, handleRandomTick }),
    [canStepUp, canStepDown, handleStepUp, handleStepDown, handleRandomTick],
  );
};
