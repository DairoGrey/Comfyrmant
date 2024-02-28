import { FC, useCallback, useState } from 'react';
import React from 'react';
import { useSelector } from 'react-redux';
import { NodeProps } from 'reactflow';

import { Divider, Paper, Stack } from '@mui/material';

import * as workflowSel from '_state/features/workflow/selector';
import { NodeStateData } from '_state/features/workflow/types';
import { RootState } from '_state/store';
import { useColorMode } from '_theme';

import { backgroundByType } from '../utils/backgroundColor';

import { Errors } from './Errors';
import { Header } from './Header';
import { Pins } from './Pins';
import { Resizer } from './Resizer';
import { Toolbar } from './Toolbar';
import { Widgets } from './Widgets';

export const Node: FC<NodeProps<NodeStateData>> = (props) => {
  const { id, data, isConnectable, selected } = props;
  const { inputs, outputs, widgets, errors } = data;
  const { title, isOutput } = data.nodeType;

  const colorMode = useColorMode();

  const getNodeColor = useCallback((state: RootState) => workflowSel.getNodeColor(state, id), [id]);

  const nodeColor = useSelector(getNodeColor);

  const backgroundColor = nodeColor ? backgroundByType(nodeColor, colorMode) : undefined;

  const [resizing, setResizing] = useState(false);

  const handleResize = useCallback(() => {
    setResizing((v) => !v);
  }, [setResizing]);

  return (
    <>
      <Resizer visible={resizing} />

      <Toolbar resizing={resizing} onResize={handleResize} />

      <Stack
        component={Paper}
        elevation={selected ? 6 : 3}
        direction="column"
        flex={1}
        height="100%"
        sx={{ backgroundColor }}
      >
        <Header id={id} title={title} inputs={inputs} widgets={widgets} />
        <Divider />
        <Pins isConnectable={isConnectable} inputs={inputs} outputs={outputs} />
        <Divider />
        <Widgets id={id} widgets={widgets} inputs={inputs} outputs={outputs} showResults={isOutput} />
      </Stack>

      <Errors id={id} errors={errors} />
    </>
  );
};
