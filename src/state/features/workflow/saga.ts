import { all, put, select, takeEvery } from 'redux-saga/effects';

import * as apiQueries from '_state/features/api/slice';
import { PromptErrorResponse, PromptRequest, PromptResponse } from '_state/features/api/types';
import * as hubAct from '_state/features/hub/slice';
import * as notificationsAct from '_state/features/notifications/slice';
import { Severity } from '_state/features/notifications/types';

import * as workflowSel from './selector';
import * as workflowAct from './slice';

function* randomTickFlow() {
  const nodes: [string, string][] = yield select(workflowSel.getNodesWithRandomWidgets);

  for (const [id, pin] of nodes) {
    const randomValue = crypto.getRandomValues(new Uint8Array(12));
    const view = new DataView(randomValue.buffer);

    const value = Number(view.getBigUint64(0) / 100_000n) + view.getUint32(8);

    yield put(workflowAct.updateNodeWidgetValue({ id, pin, value }));
  }
}

function* queuePromptFlow() {
  const canBuildPrompt: boolean = yield select(workflowSel.getCanBuildPrompt);

  if (canBuildPrompt) {
    yield put(workflowAct.randomTick());
    const prompt: PromptRequest = yield select(workflowSel.getPrompt);
    const request: Promise<{ data?: PromptResponse; error?: PromptErrorResponse }> = yield put(
      apiQueries.default.endpoints.queuePrompt.initiate(prompt),
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

export function* workflowSaga() {
  yield takeEvery(workflowAct.randomTick.type, randomTickFlow);
  yield takeEvery(workflowAct.queuePrompt.type, queuePromptFlow);
}
