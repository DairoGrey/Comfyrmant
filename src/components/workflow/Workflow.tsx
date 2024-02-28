import { useCallback, useMemo, useRef, useState } from 'react';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReactFlow, {
  Background,
  BackgroundVariant,
  IsValidConnection,
  OnConnect,
  OnEdgesChange,
  OnEdgeUpdateFunc,
  OnNodesChange,
} from 'reactflow';

import isEqual from 'lodash/isEqual';

import { useTheme } from '@mui/material';

import * as apiQueries from '_state/features/api/slice';
import * as settingsSel from '_state/features/settings/selector';
import { WorkflowBackground } from '_state/features/settings/types';
import * as workflowSel from '_state/features/workflow/selector';
import * as workflowAct from '_state/features/workflow/slice';
import type { AppDispatch } from '_state/store';

import { ApiNode } from './nodes/ApiNode';
import { ContextMenu } from './ContextMenu';
import { Controls } from './Controls';
import { builtinEdgeTypes } from './edges';
import { MiniMap } from './MiniMap';
import { builtinNodeTypes } from './nodes';
import { QuickActions } from './QuickActions';

const toBackgroundVariant = (workflowGrid: WorkflowBackground) => {
  return workflowGrid as unknown as BackgroundVariant;
};

export const Workflow = () => {
  const theme = useTheme();

  const nodes = useSelector(workflowSel.getNodes);
  const edges = useSelector(workflowSel.getEdges);

  const background = useSelector(settingsSel.getWorkflowBackground);
  const snapToGrid = useSelector(settingsSel.getWorkflowSnapToGrid);
  const snapGrid = useSelector(settingsSel.getWorkflowSnapGrid);

  const dispatch: AppDispatch = useDispatch();

  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<any>(null);

  const flowRef = useRef<HTMLDivElement>(null);

  const { data } = apiQueries.useGetObjectInfoQuery();

  const nodeTypes = useMemo(() => {
    if (!data) {
      return builtinNodeTypes;
    }

    return Object.values(data!).reduce(
      (result, node) => ({
        ...result,
        [node.type]: ApiNode,
      }),
      { ...builtinNodeTypes },
    );
  }, [data]);

  const handleNodesChange: OnNodesChange = useCallback(
    (changes) => dispatch(workflowAct.applyNodeChanges(changes)),
    [],
  );

  const handleEdgesChange: OnEdgesChange = useCallback(
    (changes) => dispatch(workflowAct.applyEdgeChanges(changes)),
    [],
  );

  const handleEdgeUpdate: OnEdgeUpdateFunc = useCallback(
    (edge, connection) => dispatch(workflowAct.updateEdge({ edge, connection })),
    [],
  );

  const handleConnect: OnConnect = useCallback((connection) => dispatch(workflowAct.addEdge(connection)), []);

  const handleContextMenu = useCallback(
    (event: React.MouseEvent) => {
      event.nativeEvent.preventDefault();

      setPosition({
        x: event.clientX,
        y: event.clientY,
      });

      setIsOpen(true);
    },
    [setIsOpen],
  );

  const isValidConnection: IsValidConnection = useCallback(
    (connection) => {
      const sourceNode = nodes.find((node) => node.id === connection.source);
      const targetNode = nodes.find((node) => node.id === connection.target);

      if (sourceNode && targetNode && connection.sourceHandle && connection.targetHandle) {
        const output = sourceNode.data.outputs[connection.sourceHandle];
        const input = targetNode.data.inputs[connection.targetHandle];

        return isEqual(output.type, input.type) || input.type === 'GENERIC';
      }

      return false;
    },
    [nodes],
  );

  return (
    <>
      <ReactFlow
        ref={flowRef}
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onEdgeUpdate={handleEdgeUpdate}
        onConnect={handleConnect}
        onPaneContextMenu={handleContextMenu}
        isValidConnection={isValidConnection}
        nodeTypes={nodeTypes}
        edgeTypes={builtinEdgeTypes}
        fitView
        snapToGrid={snapToGrid}
        snapGrid={[snapGrid, snapGrid]}
      >
        <Background
          gap={[snapGrid, snapGrid]}
          style={{ stroke: theme.palette.divider }}
          variant={toBackgroundVariant(background)}
          color={theme.palette.divider}
          size={background === WorkflowBackground.Dots ? 2 : snapGrid / 3}
          lineWidth={1}
        />
        <MiniMap />
        <Controls />
        <QuickActions />
      </ReactFlow>
      <ContextMenu isOpen={isOpen} position={position} onClose={() => setIsOpen(false)} />
    </>
  );
};
