import { Edge, Node, NodeChange, NodeDimensionChange, NodePositionChange, NodeSelectionChange } from 'reactflow';

import { createAction } from '@reduxjs/toolkit';
import { all, put, select, take, takeEvery } from 'redux-saga/effects';

import * as apiSel from '_state/features/api/selector';
import { default as apiQueries } from '_state/features/api/slice';
import { PromptErrorResponse, PromptRequest, PromptResponse } from '_state/features/api/types';
import * as hubAct from '_state/features/hub/slice';
import * as notificationsAct from '_state/features/notifications/slice';
import { Severity } from '_state/features/notifications/types';
import * as settingsSel from '_state/features/settings/selector';
import * as settingsAct from '_state/features/settings/slice';

import * as workflowSel from './selector';
import * as workflowAct from './slice';
import { ExportedNode, NodeStateData, NodeTypes } from './types';

export const endRandomTick = createAction('workflow/randomTick/end');

const alignSizeToUp = (value: number, alignment: number) => alignment * Math.ceil(Math.abs(value / alignment));
const alignPositionToUp = (value: number, alignment: number) => alignment * Math.ceil(value / alignment);

function* resizeToSnapGridFlow() {
  const snapGrid: number = yield select(settingsSel.getWorkflowSnapGrid);
  const nodes: Node<NodeStateData>[] = yield select(workflowSel.getNodes);

  const changes: NodeChange[] = nodes
    .filter((node) => node.width && node.height)
    .flatMap((node) => [
      {
        id: node.id,
        type: 'dimensions',
        dimensions: {
          width: alignSizeToUp(node.width!, snapGrid),
          height: alignSizeToUp(node.height!, snapGrid),
        },
        resizing: true,
        updateStyle: true,
      } satisfies NodeDimensionChange,
      {
        id: node.id,
        type: 'position',
        position: {
          x: alignPositionToUp(node.position.x!, snapGrid),
          y: alignPositionToUp(node.position.y!, snapGrid),
        },
        dragging: false,
      } satisfies NodePositionChange,
    ]);

  yield put(workflowAct.applyNodeChanges(changes));
}

function* selectAllFlow() {
  const nodes: Node<NodeStateData>[] = yield select(workflowSel.getNodes);

  const changes: NodeChange[] = nodes
    .filter((node) => node.width && node.height)
    .map(
      (node) =>
        ({
          id: node.id,
          type: 'select',
          selected: true,
        }) satisfies NodeSelectionChange,
    );

  yield put(workflowAct.applyNodeChanges(changes));
}

function* randomTickFlow() {
  const nodes: [string, string][] = yield select(workflowSel.getNodesWithRandomWidgets);

  for (const [id, pin] of nodes) {
    const randomValue = crypto.getRandomValues(new Uint8Array(12));
    const view = new DataView(randomValue.buffer);

    const value = Number(view.getBigUint64(0) / 100_000n) + view.getUint32(8);

    yield put(workflowAct.updateNodeWidgetValue({ id, pin, value }));
  }

  yield put(endRandomTick());
}

function* queuePromptFlow() {
  const canBuildPrompt: boolean = yield select(workflowSel.getCanBuildPrompt);

  if (canBuildPrompt) {
    yield put(workflowAct.randomTick());

    yield take(endRandomTick.type);

    const prompt: PromptRequest = yield select(workflowSel.getPrompt);
    const request: Promise<{ data?: PromptResponse; error?: PromptErrorResponse }> = yield put(
      apiQueries.endpoints.queuePrompt.initiate(prompt),
    );

    const { data, error }: { data?: PromptResponse; error?: PromptErrorResponse } = yield request;

    if (data) {
      yield put(hubAct.trackPrompt({ id: data.prompt_id, number: data.number }));
    } else if (error) {
      yield put(notificationsAct.add({ id: error.error.type, severity: Severity.Error, text: error.error.message }));

      const errors = Object.entries(error.node_errors);

      for (const [id, node] of errors) {
        yield all(
          node.errors.map(({ type, extra_info, details }) =>
            put(
              workflowAct.addNodeError({
                id,
                error: { name: extra_info.input_name as string, type, details },
              }),
            ),
          ),
        );
      }
    }
  }
}

function* exportToFileFlow(action: ReturnType<typeof workflowAct.exportToFile>) {
  const { fileName, includeSettings } = action.payload;

  const settings: unknown = yield select(settingsSel.getWorkflow);

  const nodes: Node<NodeStateData>[] = yield select(workflowSel.getNodes);
  const edges: Edge[] = yield select(workflowSel.getEdges);

  const exportedNodes: ExportedNode[] = nodes.map((node) => ({
    id: node.id,
    type: node.data.nodeType.type,
    x: node.position.x,
    y: node.position.y,
    style: node.style,
    inputs: node.data.inputs,
    outputs: node.data.outputs,
    widgets: node.data.widgets,
    values: node.data.values,
    tags: node.data.tags,
    color: node.data.color,
  }));

  const exportedEdges = edges.map((edge) => edge.id);

  const payload = includeSettings
    ? {
        settings,
        nodes: exportedNodes,
        edges: exportedEdges,
      }
    : { nodes: exportedNodes, edges: exportedEdges };

  const hiddenElement = document.createElement('a');
  hiddenElement.href = 'data:application/json,' + encodeURI(JSON.stringify(payload));
  hiddenElement.target = '_blank';
  hiddenElement.download = `${fileName}.json`;
  hiddenElement.click();
}

function* importFromFileFlow(action: ReturnType<typeof workflowAct.importFromFile>) {
  const { workflow, includeSettings } = action.payload;

  const nodeTypes: NodeTypes = yield select(apiSel.getObjectsInfoData);

  const importedNodes: Node<NodeStateData>[] = workflow.nodes.map((node) => ({
    id: node.id,
    type: node.type,
    position: { x: node.x, y: node.y },
    width: node.width,
    height: node.height,
    style: node.style,
    data: {
      nodeType: nodeTypes[node.type],
      inputs: node.inputs,
      outputs: node.outputs,
      widgets: node.widgets,
      values: node.values,
      tags: node.tags,
      color: node.color,
    },
  }));

  const importedEdges = workflow.edges.map((id) => {
    const [sourcePair, targetPair] = id.split('->');
    const [source, sourceHandle] = sourcePair.split(':');
    const [target, targetHandle] = targetPair.split(':');

    return {
      id,
      source,
      sourceHandle,
      target,
      targetHandle,
    };
  });

  yield put(workflowAct.applyNodeChanges(importedNodes.map((node) => ({ type: 'add', item: node }))));
  yield put(workflowAct.applyEdgeChanges(importedEdges.map((edge) => ({ type: 'add', item: edge }))));

  if (includeSettings && workflow.settings) {
    yield put(settingsAct.importWorkflowSettings(workflow.settings));
  }
}

export function* workflowSaga() {
  yield takeEvery(workflowAct.randomTick.type, randomTickFlow);
  yield takeEvery(workflowAct.queuePrompt.type, queuePromptFlow);
  yield takeEvery(workflowAct.selectAll.type, selectAllFlow);
  yield takeEvery(workflowAct.resizeToSnapGrid.type, resizeToSnapGridFlow);

  yield takeEvery(workflowAct.exportToFile.type, exportToFileFlow);
  yield takeEvery(workflowAct.importFromFile.type, importFromFileFlow);
}
