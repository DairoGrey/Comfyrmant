import { combineReducers } from '@reduxjs/toolkit';

import apiSlice from '_state/features/api/slice';
import blobsSlice from '_state/features/blobs/slice';
import hubSlice from '_state/features/hub/slice';
import logsSlice from '_state/features/logs/slice';
import notificationsSlice from '_state/features/notifications/slice';
import settingsSlice from '_state/features/settings/slice';
import workflowSlice from '_state/features/workflow/slice';
import workspacesSlice from '_state/features/workspaces/slice';

export const rootReducer = combineReducers({
  [blobsSlice.name]: blobsSlice.reducer,
  [logsSlice.name]: logsSlice.reducer,
  [settingsSlice.name]: settingsSlice.reducer,
  [workflowSlice.name]: workflowSlice.reducer,
  [workspacesSlice.name]: workspacesSlice.reducer,

  [apiSlice.reducerPath]: apiSlice.reducer,
  [hubSlice.reducerPath]: hubSlice.reducer,
  [notificationsSlice.reducerPath]: notificationsSlice.reducer,
});
