import Dexie, { Table } from 'dexie';
import omit from 'lodash/omit';
import { call, put, takeEvery } from 'redux-saga/effects';

import { ImageOutputResponse } from '../api/types';

import { imageToStr } from './helpers';
import * as blobsAct from './slice';
import { BlobType } from './types';

export interface Data {
  id: string;
  type: BlobType;
  data: Blob;
  image: string;
}

export class BlobsDexie extends Dexie {
  data!: Table<Data>;

  constructor(name: string) {
    super(name);
    this.version(1).stores({
      data: 'id,type,image',
    });
  }
}

const blobsDb = new BlobsDexie('blobs');

export function* saveBlob(id: string, type: BlobType, data: Blob, image: ImageOutputResponse) {
  const imageStr = imageToStr(image);

  yield blobsDb.data.put({ id, type, data, image: imageStr });
  yield put(blobsAct.registerBlob({ id, type, image: imageStr }));
}

export function* readBlobWithType(id: string, type: BlobType) {
  const record: Data | undefined = yield blobsDb.data.where({ id, type }).first();

  return record?.data;
}

export function* readBlob(id: string) {
  const record: Data | undefined = yield blobsDb.data.where({ id }).first();

  return record?.data;
}

export function* readBlobAsURL(id: string, type: BlobType) {
  const blob: Blob | undefined = yield call(readBlobWithType, id, type);

  if (blob) {
    return URL.createObjectURL(blob);
  }
}

function* loadBlobFlow(action: ReturnType<typeof blobsAct.loadBlob>) {
  const imageStr = imageToStr(action.payload);

  const record: Data | undefined = yield blobsDb.data.where({ image: imageStr }).first();

  if (record) {
    const url = URL.createObjectURL(record.data);

    yield put(blobsAct.saveBlobUrl({ id: imageStr, url }));
  }
}

function* unloadBlobFlow(action: ReturnType<typeof blobsAct.unloadBlob>) {
  const imageStr = imageToStr(action.payload);

  yield put(blobsAct.removeBlobUrl(imageStr));
}

function* restoreIndex() {
  const records: Data[] = yield blobsDb.data.toArray();

  for (const record of records) {
    yield put(blobsAct.registerBlob(omit(record, 'data')));
  }
}

export function* blobsSaga() {
  yield call(restoreIndex);

  yield takeEvery(blobsAct.loadBlob.type, loadBlobFlow);
  yield takeEvery(blobsAct.unloadBlob.type, unloadBlobFlow);
}
