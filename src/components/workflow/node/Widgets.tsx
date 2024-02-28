import { FC, memo, useCallback } from 'react';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Stack } from '@mui/material';

import * as hubSel from '_state/features/hub/selector';
import * as workflowSel from '_state/features/workflow/selector';
import * as workflowAct from '_state/features/workflow/slice';
import { NodeInputState, NodeOutputState, NodeWidgetState } from '_state/features/workflow/types';
import { RootState } from '_state/store';

import { inputWidgetByType, outputWidgetByType, resultWidgetByType } from '../utils/widgetByType';

type OutputWidgetProps = {
  nodeId: string;
  widget: NodeWidgetState;
  outputs: Record<string, NodeOutputState>;
};

const OutputWidget: FC<OutputWidgetProps> = ({ nodeId, widget, outputs }) => {
  const pinId = widget.id;

  const [Widget, props] = outputWidgetByType(widget, outputs);

  const getValue = useCallback(
    (state: RootState) => workflowSel.getNodeOutputValue(state, nodeId, pinId),
    [nodeId, pinId],
  );

  const value = useSelector(getValue);

  const dispatch = useDispatch();

  const handleChange = useCallback((value: unknown) => {
    dispatch(workflowAct.updateNodeWidgetValue({ id: nodeId, pin: widget.id, value }));
  }, []);

  if (!Widget) {
    return;
  }

  return <Widget {...(props as any)} value={value} onChange={handleChange} />;
};

type IntputWidgetProps = {
  nodeId: string;
  widget: NodeWidgetState;
  inputs: Record<string, NodeInputState>;
};

const IntputWidget: FC<IntputWidgetProps> = ({ nodeId, widget, inputs }) => {
  const pinId = widget.id;

  const [Widget, props] = inputWidgetByType(widget, inputs);

  const getValue = useCallback(
    (state: RootState) => workflowSel.getInputValueFromConnectedSourceNode(state, nodeId, pinId),
    [nodeId, pinId],
  );

  const value = useSelector(getValue);

  const dispatch = useDispatch();

  const handleChange = useCallback(
    (value: unknown) => {
      dispatch(workflowAct.updateNodeWidgetValue({ id: nodeId, pin: widget.id, value }));
    },
    [nodeId, widget],
  );

  const handleOptionsChange = useCallback(
    (options: Record<string, unknown>) => {
      dispatch(workflowAct.updateNodeWidgetOptions({ id: nodeId, pin: widget.id, options }));
    },
    [nodeId, widget],
  );

  if (!Widget) {
    return;
  }

  return <Widget {...(props as any)} value={value} onChange={handleChange} onOptionsChange={handleOptionsChange} />;
};

type ResultWidgetProps = {
  nodeId: string;
  input: NodeInputState;
};

const ResultWidget: FC<ResultWidgetProps> = ({ nodeId, input }) => {
  const pinId = input.name;

  const [Widget, props] = resultWidgetByType(input);

  const getValue = useCallback(
    (state: RootState) => hubSel.getOutputValueFromLatestPrompt(state, nodeId, pinId as any),
    [nodeId, pinId],
  );

  const value = useSelector(getValue);

  if (!Widget) {
    return;
  }

  return <Widget {...(props as any)} value={value} />;
};

type Props = {
  id: string;
  widgets?: Record<string, NodeWidgetState>;
  inputs: Record<string, NodeInputState>;
  outputs: Record<string, NodeOutputState>;
  showResults: boolean;
};

export const Widgets: FC<Props> = memo(({ id, widgets, inputs, outputs, showResults }) => {
  if (!widgets) {
    return;
  }

  return (
    <Stack direction="column" gap={2} px={3} py={2} overflow="hidden" flexShrink={0}>
      {Object.values(widgets).map((widget) => {
        const key = `${id}-${widget.name}-${widget.type}`;

        if (widget.type === 'output') {
          return <OutputWidget key={key} nodeId={id} widget={widget} outputs={outputs} />;
        }

        return <IntputWidget key={key} nodeId={id} widget={widget} inputs={inputs} />;
      })}
      {showResults && Object.values(inputs).map((input) => <ResultWidget key={input.name} nodeId={id} input={input} />)}
    </Stack>
  );
});
