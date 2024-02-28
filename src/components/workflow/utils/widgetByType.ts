import { NodeInputState, NodeOutputState, NodeWidgetState } from '_state/features/workflow/types';

import { ImagesViewWidget } from '../node/widgets/ImagesViewWidget';
import { InputFieldWidget } from '../node/widgets/InputFieldWidget';
import { LabelViewWidget } from '../node/widgets/LabelViewWidget';
import { NoteEditorWidget } from '../node/widgets/NoteEditorWidget';
import { SelectFieldWidget } from '../node/widgets/SelectFieldWidget';

const OUTPUT_WIDGET_TYPE: Record<string, any> = {
  INT: InputFieldWidget,
  FLOAT: InputFieldWidget,
  STRING: InputFieldWidget,
};

export const outputWidgetByType = (widget: NodeWidgetState, outputs: Record<string, NodeOutputState>) => {
  const output = outputs[widget.id];
  const type = output.type;

  if (!type) {
    console.error('Unknown widget type! Check configuration');
    return [null, {}] as const;
  }

  if (Array.isArray(type)) {
    return [SelectFieldWidget, { values: type, widget, output }] as const;
  }

  return [OUTPUT_WIDGET_TYPE[type], { widget, output }] as const;
};

const INPUT_WIDGET_TYPE: Record<string, any> = {
  INT: InputFieldWidget,
  FLOAT: InputFieldWidget,
  STRING: InputFieldWidget,
  NOTE: NoteEditorWidget,
};

export const inputWidgetByType = (widget: NodeWidgetState, inputs: Record<string, NodeInputState>) => {
  const input = inputs[widget.id];
  const type = input.type;

  if (!type) {
    console.error('Unknown widget type! Check configuration');
    return [null, {}] as const;
  }

  if (Array.isArray(type)) {
    return [SelectFieldWidget, { values: type, widget, input }] as const;
  }

  return [INPUT_WIDGET_TYPE[type], { widget, input }] as const;
};

const RESULT_WIDGET_TYPE: Record<string, any> = {
  STRING: LabelViewWidget,
  IMAGE: ImagesViewWidget,
};

export const resultWidgetByType = (input: NodeInputState) => {
  const type = input.type;

  if (!type || Array.isArray(type)) {
    console.error('Unknown widget type! Check configuration');
    return [null, {}] as const;
  }

  return [RESULT_WIDGET_TYPE[type], { input }] as const;
};
