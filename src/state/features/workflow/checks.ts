import isEqual from 'lodash/isEqual';

import { someInputs } from './helpers';
import { NodeStateData, NodeWidgetState } from './types';

export const hasInputs = (data: NodeStateData, withoutHidden = false) => {
  if (withoutHidden) {
    return Object.values(data.inputs).filter((input) => !input.hidden).length > 0;
  }

  return Object.values(data.inputs).length > 0;
};

export const hasInputWithType = (data: NodeStateData, type: string | string[]) => {
  return Object.values(data.inputs).some((input) => isEqual(input.type, type));
};

export const hasOutputs = (data: NodeStateData) => {
  return Object.values(data.outputs).length > 0;
};

export const hasOutputWithType = (data: NodeStateData, type: string | string[]) => {
  return Object.values(data.outputs).some((output) => isEqual(output.type, type));
};

export const hasWidgets = (
  data: NodeStateData,
): data is NodeStateData & { widgets: Record<string, NodeWidgetState> } => {
  return Object.values(data.widgets || {}).length > 0;
};

export const canBeBypassed = (data: NodeStateData) => {
  return hasInputs(data) && hasOutputs(data) && someInputs(data, (input) => hasOutputWithType(data, input.type));
};
