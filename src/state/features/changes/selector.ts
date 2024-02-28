import { createSelector } from '@reduxjs/toolkit';

import { RootState } from '_state/store';

import slice from './slice';

const getChanges = (state: RootState) => state[slice.name];

export const getChangesStack = createSelector(getChanges, (changes) => changes.stack);
