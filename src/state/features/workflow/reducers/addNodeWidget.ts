import { Draft, PayloadAction } from '@reduxjs/toolkit';

import type { WorkflowState } from '../slice';
import type { NodeWidgetState } from '../types';

export const addNodeWidget = (
  state: Draft<WorkflowState>,
  action: PayloadAction<{ id: string; widget: NodeWidgetState }>,
) => {
  const { id, widget } = action.payload;

  const nodeData = state.nodes.find((node) => node.id === id)?.data;

  if (!nodeData) {
    return;
  }

  if (!nodeData?.widgets) {
    nodeData.widgets = {};
  }

  const input = nodeData.inputs[widget.name];
  input.hidden = true;

  nodeData.widgets[widget.name] = widget;

  if (!nodeData.values) {
    nodeData.values = {};
  }

  if (nodeData.errors?.[input.name]) {
    delete nodeData.errors[input.name];
  }

  if (Array.isArray(input.type)) {
    nodeData.values[widget.name] = input.type[0];
  } else {
    nodeData.values[widget.name] = input?.options?.default;
  }
};
