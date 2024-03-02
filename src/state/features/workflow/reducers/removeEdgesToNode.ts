import { Draft, PayloadAction } from '@reduxjs/toolkit';

import type { WorkflowState } from '../slice';

export const removeEdgesToNode = (state: Draft<WorkflowState>, action: PayloadAction<string>) => {
  const id = action.payload;

  state.edges = state.edges.filter((edge) => edge.source !== id && edge.target !== id);
};
