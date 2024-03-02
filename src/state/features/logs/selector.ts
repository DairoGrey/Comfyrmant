import { createSelector } from '@reduxjs/toolkit';

import { RootState } from '_state/store';

import slice from './slice';

const getLogs = (state: RootState) => state[slice.name];

export const getLogsStack = createSelector(getLogs, (changes) => changes.stack);
