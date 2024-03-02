import { Draft, PayloadAction } from '@reduxjs/toolkit';

import type { WorkflowState } from '../slice';

export const updateNodeWidgetOptions = (
  state: Draft<WorkflowState>,
  action: PayloadAction<{ id: string; pin: string; options: Record<string, unknown> }>,
) => {
  const { id, pin, options } = action.payload;

  const nodeData = state.nodes.find((node) => node.id === id)?.data;

  if (nodeData?.widgets?.[pin]) {
    nodeData.widgets[pin].options = {
      ...nodeData.widgets[pin].options,
      ...options,
    };
  }
};
