import { eventChannel } from 'redux-saga';
import { call, fork, put, takeEvery } from 'redux-saga/effects';

import { getImageView, getQueue } from '_api/index';
import { default as apiQueries } from '_state/features/api/slice';

import { QueueResponse } from '../api/types';
import * as blobsSaga from '../blobs/saga';
import { BlobType } from '../blobs/types';

import * as hubAct from './slice';
import {
  ExecutedMessage,
  ExecutingMessage,
  ExecutionCachedMessage,
  ExecutionStartMessage,
  Message,
  MessageType,
  ProgressMessage,
  StatusMessage,
} from './types';

const isStatusMessage = (message: Record<string, unknown>): message is StatusMessage =>
  Object.hasOwn(message, 'type') && typeof message.type === 'string' && message.type === MessageType.Status;

const isExecutionStartMessage = (message: Record<string, unknown>): message is ExecutionStartMessage =>
  Object.hasOwn(message, 'type') && typeof message.type === 'string' && message.type === MessageType.ExecutionStart;

const isExecutionCachedMessage = (message: Record<string, unknown>): message is ExecutionCachedMessage =>
  Object.hasOwn(message, 'type') && typeof message.type === 'string' && message.type === MessageType.ExecutionCached;

const isExecutingMessage = (message: Record<string, unknown>): message is ExecutingMessage =>
  Object.hasOwn(message, 'type') && typeof message.type === 'string' && message.type === MessageType.Executing;

const isProgressMessage = (message: Record<string, unknown>): message is ProgressMessage =>
  Object.hasOwn(message, 'type') && typeof message.type === 'string' && message.type === MessageType.Progress;

const isExecutedMessage = (message: Record<string, unknown>): message is ExecutedMessage =>
  Object.hasOwn(message, 'type') && typeof message.type === 'string' && message.type === MessageType.Executed;

function* statusFlow(message: StatusMessage) {
  if (message.data.sid) {
    yield call([sessionStorage, sessionStorage.setItem], 'clientId', message.data.sid);
  }

  yield put(
    hubAct.status({
      sid: message.data.sid,
      remainingQueue: message.data.status.exec_info.queue_remaining,
    }),
  );
}

function* executionStartFlow(message: ExecutionStartMessage) {
  yield put(
    hubAct.executionStart({
      id: message.data.prompt_id,
    }),
  );
}

function* executionCachedFlow(message: ExecutionCachedMessage) {
  const { prompt_id: id, nodes } = message.data;

  yield put(hubAct.executionCached({ id, nodes }));
}

function* executingFlow(message: ExecutingMessage) {
  const { prompt_id: id, node } = message.data;

  yield put(hubAct.executing({ id, node }));
}

function* progressFlow(message: ProgressMessage) {
  const { prompt_id: id, value: currentStep, max: steps, node } = message.data;

  yield put(hubAct.progress({ id, node, currentStep, steps }));
}

function* executedFlow(message: ExecutedMessage) {
  const { prompt_id: id, output, node } = message.data;

  const data: hubAct.PromptOutput = {
    images: [],
  };

  for (const image of output.images) {
    const blob: Blob = yield call(getImageView, image.filename, image.type, image.subfolder);

    yield call(
      blobsSaga.saveBlob,
      image.filename,
      image.type === 'temp' ? BlobType.Preview : BlobType.Output,
      blob,
      image,
    );

    data.images.push({
      filename: image.filename,
      url: URL.createObjectURL(blob),
    });
  }

  yield put(hubAct.executed({ id, output: data, node }));

  yield call(apiQueries.util.invalidateTags, ['history']);
}

function* messageFlow(message: Message) {
  if (isStatusMessage(message)) {
    yield call(statusFlow, message);
  }

  if (isExecutionStartMessage(message)) {
    yield call(executionStartFlow, message);
  }

  if (isExecutionCachedMessage(message)) {
    yield call(executionCachedFlow, message);
  }

  if (isExecutingMessage(message)) {
    yield call(executingFlow, message);
  }

  if (isProgressMessage(message)) {
    yield call(progressFlow, message);
  }

  if (isExecutedMessage(message)) {
    yield call(executedFlow, message);
  }
}

function* restoreQueue() {
  const queue: QueueResponse = yield call(getQueue);

  yield put(hubAct.restoreQueue(queue));
}

export function* hubSaga() {
  const clientId: string | undefined = yield call([sessionStorage, sessionStorage.getItem], 'clientId');

  const socket: WebSocket = new WebSocket(`ws://${location.host}/ws${clientId ? `?clientId=${clientId}` : ''}`);

  const messageChannel = eventChannel<Message>((input) => {
    const handler = (event: MessageEvent) => {
      input(JSON.parse(event.data));
    };

    socket.addEventListener('message', handler);

    return () => socket.removeEventListener('message', handler);
  });

  yield takeEvery(messageChannel, messageFlow);

  yield fork(restoreQueue);
}
