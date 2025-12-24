import { FC, memo, useCallback } from 'react';
import React from 'react';
import { useDispatch } from 'react-redux';
import { NodeProps, useReactFlow } from 'reactflow';

import { Backdrop, Box, Divider, Paper, Stack, Tooltip, Typography, useTheme } from '@mui/material';

import LockIcon from '@mui/icons-material/LockRounded';
import TurnRightIcon from '@mui/icons-material/TurnRightRounded';

import * as workflowChecks from '_state/features/workflow/checks';
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

  const hasWidgets = workflowChecks.hasWidgets(data);
  const hasPins = workflowChecks.hasInputs(data, true) || workflowChecks.hasOutputs(data);

  const theme = useTheme();
  const colorMode = useColorMode();
  const flow = useReactFlow();

  const dispatch = useDispatch();

  const backgroundColor = nodeColor ? backgroundByType(nodeColor, theme, colorMode) : undefined;

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
          border: '2px solid',
          borderColor: bypass ? theme.vars.palette.warning.main : locked ? theme.vars.palette.divider : 'transparent',
          userSelect: 'none',
        }}
      >
        <Header
          id={id}
          title={title}
          nodeColor={nodeColor}
          tags={tags && <Tags tags={tags} onDelete={handleTagDelete} />}
          lockStatus={
            locked ? (
              <Tooltip placement="top" title="Locked">
                <LockIcon color="secondary" />
              </Tooltip>
            ) : undefined
          }
          bypassStatus={
            bypass ? (
              <Tooltip placement="top" title="Bypass enabled">
                <TurnRightIcon color="warning" />
              </Tooltip>
            ) : undefined
          }
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
            <Box position="relative" height={!isOutput ? '100%' : undefined}>
              <Widgets fullHeight={!isOutput} id={id} widgets={widgets!} inputs={inputs} outputs={outputs} />

              <Backdrop
                open={bypass}
                sx={{
                  position: 'absolute',
                  bottom: 1,
                  right: 1,
                  left: 1,
                  top: 1,
                  borderRadius: 1,
                  zIndex: 10,
                  backdropFilter: 'blur(2px)',
                }}
              >
                <Stack alignItems="center" justifyContent="center">
                  <Typography
                    color="common.white"
                    variant="button"
                    fontSize={24}
                    sx={{ textShadow: '0px 0px 2px black' }}
                  >
                    BYPASS
                  </Typography>
                </Stack>
              </Backdrop>
            </Box>
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
Node.displayName = 'Node';
