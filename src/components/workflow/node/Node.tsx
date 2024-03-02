import { FC, memo, useCallback } from 'react';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NodeProps } from 'reactflow';

import { Divider, Paper, Stack } from '@mui/material';

import * as workflowSel from '_state/features/workflow/selector';
import * as workflowAct from '_state/features/workflow/slice';
import { NodeStateData } from '_state/features/workflow/types';
import { RootState } from '_state/store';
import { useColorMode } from '_theme';

import { backgroundByType } from '../utils/backgroundColor';

import { Errors } from './Errors';
import { Header } from './Header';
import { Pins } from './Pins';
import { Resizer } from './Resizer';
import { Tags } from './Tags';
import { Toolbar } from './Toolbar';
import { Results, Widgets } from './Widgets';

export const Node: FC<NodeProps<NodeStateData>> = memo((props) => {
  const { id, data, isConnectable, selected } = props;
  const { inputs, outputs, widgets, errors, tags } = data;
  const { title, isOutput } = data.nodeType;

  const hasWidgets = widgets ? Object.keys(widgets).length > 0 : false;
  const hasPins = Object.values(inputs).filter((input) => !input.hidden).length > 0 || Object.keys(outputs).length > 0;

  const colorMode = useColorMode();

  const dispatch = useDispatch();

  const getNodeColor = useCallback((state: RootState) => workflowSel.getNodeColor(state, id), [id]);
  const getNodeResizing = useCallback((state: RootState) => workflowSel.getNodeResizing(state, id), [id]);
  const getNodeCollapsed = useCallback((state: RootState) => workflowSel.getNodeCollapsed(state, id), [id]);

  const nodeColor = useSelector(getNodeColor);
  const resizing = useSelector(getNodeResizing);
  const collapsed = useSelector(getNodeCollapsed);

  const backgroundColor = nodeColor ? backgroundByType(nodeColor, colorMode) : undefined;

  const handleResize = useCallback(() => {
    dispatch(workflowAct.toggleNodeResizing(id));
  }, [id]);

  const handleCollapse = useCallback(() => {
    dispatch(workflowAct.toggleNodeCollapsed(id));
  }, [id]);

  const handleTagDelete = useCallback(
    (tag: string) => {
      dispatch(workflowAct.removeNodeTag({ id, tag }));
    },
    [id],
  );

  return (
    <>
      <Resizer visible={resizing} />

      <Toolbar resizing={resizing} collapsed={collapsed} onResize={handleResize} onCollapse={handleCollapse} />

      <Stack
        component={Paper}
        elevation={selected ? 6 : 3}
        direction="column"
        flex={1}
        height="100%"
        sx={{ backgroundColor, userSelect: 'none' }}
      >
        <Header id={id} title={title} inputs={inputs} widgets={widgets}>
          {tags && <Tags tags={tags} onDelete={handleTagDelete} />}
        </Header>
        {hasPins && (
          <>
            <Divider />
            <Pins isConnectable={isConnectable} inputs={inputs} outputs={outputs} />
          </>
        )}
        {!collapsed && hasWidgets && (
          <>
            <Divider />
            <Widgets id={id} widgets={widgets!} inputs={inputs} outputs={outputs} />
          </>
        )}
        {!collapsed && isOutput && (
          <>
            <Divider />
            <Results id={id} inputs={inputs} />
          </>
        )}
      </Stack>

      <Errors id={id} errors={errors} />
    </>
  );
});
