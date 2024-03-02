import { Draft, PayloadAction } from '@reduxjs/toolkit';

import type { WorkflowState } from '../slice';
import { NodeErrorType } from '../types';

export const updateNodeWidgetValue = (
  state: Draft<WorkflowState>,
  action: PayloadAction<{ id: string; pin: string; value: unknown }>,
) => {
  const { id, pin, value } = action.payload;

  const nodeData = state.nodes.find((node) => node.id === id)?.data;

  if (nodeData?.values) {
    nodeData.values[pin] = value;

    if (nodeData.errors?.[pin]?.type === NodeErrorType.ValueSmallerThanMin) {
      delete nodeData.errors[pin];
    }
  }
};
