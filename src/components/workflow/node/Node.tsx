import { FC, memo, useCallback } from 'react';
import React from 'react';
import { useDispatch } from 'react-redux';
import { NodeProps, useReactFlow } from 'reactflow';

import { Backdrop, Divider, Paper, Stack, Typography, useTheme } from '@mui/material';

import LockIcon from '@mui/icons-material/Lock';

import * as workflowAct from '_state/features/workflow/slice';
import { NodeStateData } from '_state/features/workflow/types';
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

  const {
    inputs,
    outputs,
    widgets,
    errors,
    tags,
    resizing = false,
    collapsed = false,
    locked = false,
    bypass = false,
    color: nodeColor,
  } = data;
  const { title, isOutput } = data.nodeType;

  const hasWidgets = widgets ? Object.keys(widgets).length > 0 : false;
  const hasPins = Object.values(inputs).filter((input) => !input.hidden).length > 0 || Object.keys(outputs).length > 0;

  const theme = useTheme();
  const colorMode = useColorMode();
  const flow = useReactFlow();

  const dispatch = useDispatch();

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

  const handleDelete = useCallback(() => {
    flow.deleteElements({ nodes: [{ id: id }] });
  }, [id, flow]);

  const handleClone = useCallback(() => {
    dispatch(workflowAct.cloneNode(id));
  }, [id]);

  const handleLock = useCallback(() => {
    dispatch(workflowAct.toggleNodeLocked(id));
  }, [id]);

  return (
    <>
      <Resizer visible={resizing} />

      <Toolbar
        resizing={resizing}
        collapsed={collapsed}
        locked={locked}
        onDelete={handleDelete}
        onClone={handleClone}
        onResize={handleResize}
        onCollapse={handleCollapse}
        onLock={handleLock}
      />

      <Stack
        component={Paper}
        variant={locked ? 'outlined' : 'elevation'}
        elevation={locked ? 0 : selected ? 6 : 3}
        direction="column"
        flex={1}
        height="100%"
        sx={{
          backgroundColor,
          border: '1px solid',
          borderColor: locked ? theme.palette.divider : 'transparent',
          userSelect: 'none',
        }}
      >
        <Header
          id={id}
          title={title}
          tags={tags && <Tags tags={tags} onDelete={handleTagDelete} />}
          lockStatus={locked ? <LockIcon color="secondary" /> : undefined}
        />
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
        <Backdrop open={bypass} sx={{ borderRadius: 1 }}>
          <Stack alignItems="center" justifyContent="center">
            <Typography color="common.white" variant="button" fontSize={24}>
              BYPASS
            </Typography>
          </Stack>
        </Backdrop>
      </Stack>

      <Errors id={id} errors={errors} />
    </>
  );
});
Node.displayName = 'Node';
