import { Draft, PayloadAction } from '@reduxjs/toolkit';

import type { WorkflowState } from '../slice';

export const removeNodeWidget = (
  state: Draft<WorkflowState>,
  action: PayloadAction<{ id: string; widget: string }>,
) => {
  const { id, widget: widgetId } = action.payload;

  const nodeData = state.nodes.find((node) => node.id === id)?.data;
  const widget = nodeData?.widgets?.[widgetId];

  if (nodeData?.widgets && widget) {
    if (widget.type === 'input') {
      delete nodeData.inputs[widget.id].hidden;
    }

    delete nodeData.widgets[widget.name];

    if (nodeData.values) {
      delete nodeData.values[widget.id];
    }

    if (nodeData.errors?.[widget.id]) {
      delete nodeData.errors[widget.id];
    }
  }
};
