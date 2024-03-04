import { createSelector } from '@reduxjs/toolkit';

import * as workflowData from '_state/features/workflow/data';
import type { RootState } from '_state/store';

import { default as apiQueries } from './slice';

const createGetObjectsInfo = createSelector(() => apiQueries.endpoints.getObjectInfo.select());

const getObjectsInfo = createSelector(
  (state: RootState) => state,
  // @ts-expect-error never type for state
  () => createGetObjectsInfo(),
  (state, getObjectsInfo) => getObjectsInfo(state),
);

export const getObjectsInfoData = createSelector(getObjectsInfo, (objectsInfo) => ({
  ...workflowData.builtinNodeTypes,
  ...(objectsInfo.data || {}),
}));
