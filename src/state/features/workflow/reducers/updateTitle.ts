import { Draft, PayloadAction } from '@reduxjs/toolkit';

import type { WorkflowState } from '../slice';

export const updateTitle = (state: Draft<WorkflowState>, action: PayloadAction<string>) => {
  state.title = action.payload;
};
