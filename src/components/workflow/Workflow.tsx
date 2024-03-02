import { useCallback, useMemo, useRef, useState } from 'react';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReactFlow, {
  Background,
  BackgroundVariant,
  Edge,
  HandleType,
  IsValidConnection,
  Node,
  OnConnect,
  OnEdgesChange,
  OnEdgeUpdateFunc,
  OnNodesChange,
  useReactFlow,
} from 'reactflow';

import isEqual from 'lodash/isEqual';
import * as uuid from 'uuid';

import { useTheme } from '@mui/material';

import * as apiQueries from '_state/features/api/slice';
import * as settingsSel from '_state/features/settings/selector';
import { WorkflowBackground } from '_state/features/settings/types';
import * as workflowSel from '_state/features/workflow/selector';
import * as workflowAct from '_state/features/workflow/slice';
import { NodeStateData } from '_state/features/workflow/types';
import type { AppDispatch } from '_state/store';
import { useColorMode } from '_theme';

import { ApiNode } from './nodes/ApiNode';
import { createMiniMapNodeColorGetter } from './utils/backgroundColor';
import { ConnectionLine } from './ConnectionLine';
import { ContextMenu } from './context-menu';
import { Controls } from './Controls';
import { builtinEdgeTypes } from './edges';
import { MiniMap } from './MiniMap';
import { builtinNodes, builtinNodeTypes } from './nodes';
import { QuickActions } from './quick-actions';

type OnEdgeUpdateStartFunc = (e: React.MouseEvent, edge: Edge<any>, handleType: HandleType) => void;
type OnEdgeUpdateEndFunc = (e: MouseEvent | TouchEvent, edge: Edge<any>, handleType: HandleType) => void;

const toBackgroundVariant = (workflowGrid: WorkflowBackground) => {
  return workflowGrid as unknown as BackgroundVariant;
};

export const Workflow = () => {
  const theme = useTheme();
  const colorMode = useColorMode();

  const flow = useReactFlow();

  const nodes = useSelector(workflowSel.getNodes);
  const edges = useSelector(workflowSel.getEdges);

  const background = useSelector(settingsSel.getWorkflowBackground);
  const snapToGrid = useSelector(settingsSel.getWorkflowSnapToGrid);
  const snapGrid = useSelector(settingsSel.getWorkflowSnapGrid);

  const dispatch: AppDispatch = useDispatch();

  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<any>(null);

  const edgeUpdateSuccessful = useRef(false);

  const getNodeColor = useMemo(
    () => createMiniMapNodeColorGetter(colorMode, theme.palette.divider),
    [colorMode, theme],
  );

  const { data } = apiQueries.useGetObjectInfoQuery();

  const nodeTypes = useMemo(() => {
    if (!data) {
      return builtinNodes;
    }

    return Object.values(data!).reduce(
      (result, node) => ({
        ...result,
        [node.type]: ApiNode,
      }),
      { ...builtinNodes },
    );
  }, [data]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  const handleNodeColor = useCallback((node: Node<NodeStateData>) => getNodeColor(node.data.color), [getNodeColor]);

  const handleDragOver: React.DragEventHandler = useCallback((e) => {
    if (e.dataTransfer.types.includes('application/node')) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
    }
  }, []);

  const handleDrop: React.DragEventHandler = useCallback(
    (e) => {
      if (!data) {
        return;
      }

      e.preventDefault();

      const type = e.dataTransfer.getData('application/node');

      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = flow.screenToFlowPosition({
        x: e.clientX,
        y: e.clientY,
      });

      const nodeType = data[type] || builtinNodeTypes[type];

      if (!nodeType) {
        return;
      }

      const newNode = {
        id: uuid.v4(),
        type: nodeType.type,
        position,
        data: {
          nodeType: { ...nodeType },
          inputs: { ...nodeType.inputs },
          outputs: { ...nodeType.outputs },
          widgets: {},
          values: {},
        },
      };

      dispatch(workflowAct.applyNodeChanges([{ type: 'add', item: newNode }]));
    },
    [data, flow],
  );

  const handleNodesChange: OnNodesChange = useCallback(
    (changes) => dispatch(workflowAct.applyNodeChanges(changes)),
    [],
  );

  const handleEdgesChange: OnEdgesChange = useCallback(
    (changes) => dispatch(workflowAct.applyEdgeChanges(changes)),
    [],
  );

  const handleEdgeUpdateStart: OnEdgeUpdateStartFunc = useCallback(() => {
    edgeUpdateSuccessful.current = false;
  }, []);

  const handleEdgeUpdate: OnEdgeUpdateFunc = useCallback((edge, connection) => {
    edgeUpdateSuccessful.current = true;
    dispatch(workflowAct.updateEdge({ edge, connection }));
  }, []);

  const handleEdgeUpdateEnd: OnEdgeUpdateEndFunc = useCallback((e, edge) => {
    if (!edgeUpdateSuccessful.current) {
      dispatch(workflowAct.applyEdgeChanges([{ type: 'remove', id: edge.id }]));
    }

    edgeUpdateSuccessful.current = true;
  }, []);

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
      if (!connection.source && !connection.target) {
        return false;
      }

      if (connection.source === connection.target) {
        return false;
      }

      const sourceNode = nodes.find((node) => node.id === connection.source);
      const targetNode = nodes.find((node) => node.id === connection.target);

      if (sourceNode && targetNode && connection.sourceHandle && connection.targetHandle) {
        const output = sourceNode.data.outputs[connection.sourceHandle];
        const input = targetNode.data.inputs[connection.targetHandle];

        return isEqual(output.type, input.type) || input.type === 'GENERIC';
      }

      return false;
    },
    [nodes, edges],
  );

  return (
    <>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onEdgeUpdate={handleEdgeUpdate}
        onConnect={handleConnect}
        onEdgeUpdateStart={handleEdgeUpdateStart}
        onEdgeUpdateEnd={handleEdgeUpdateEnd}
        onPaneContextMenu={handleContextMenu}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        isValidConnection={isValidConnection}
        nodeTypes={nodeTypes}
        edgeTypes={builtinEdgeTypes}
        fitView
        snapToGrid={snapToGrid}
        snapGrid={[snapGrid, snapGrid]}
        connectionLineComponent={ConnectionLine}
      >
        <Background
          gap={[snapGrid, snapGrid]}
          style={{ stroke: theme.palette.divider }}
          variant={toBackgroundVariant(background)}
          color={theme.palette.divider}
          size={background === WorkflowBackground.Dots ? 2 : snapGrid / 3}
          lineWidth={1}
        />
        <MiniMap nodeColor={handleNodeColor} />
        <Controls />
        <QuickActions />
      </ReactFlow>
      <ContextMenu isOpen={isOpen} position={position} onClose={handleClose} />
    </>
  );
};
