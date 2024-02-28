import { combineReducers } from '@reduxjs/toolkit';

import apiSlice from '_state/features/api/slice';
import changesSlice from '_state/features/changes/slice';
import hubSlice from '_state/features/hub/slice';
import notificationsSlice from '_state/features/notifications/slice';
import settingsSlice from '_state/features/settings/slice';
import workflowSlice from '_state/features/workflow/slice';
import workspacesSlice from '_state/features/workspaces/slice';

export const rootReducer = combineReducers({
  [changesSlice.name]: changesSlice.reducer,
  [settingsSlice.name]: settingsSlice.reducer,
  [workflowSlice.name]: workflowSlice.reducer,
  [workspacesSlice.name]: workspacesSlice.reducer,

  [apiSlice.reducerPath]: apiSlice.reducer,
  [hubSlice.reducerPath]: hubSlice.reducer,
  [notificationsSlice.reducerPath]: notificationsSlice.reducer,
});
