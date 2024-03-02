import Dexie, { Table } from 'dexie';
import { call, put } from 'redux-saga/effects';

import { ImageOutputResponse } from '../api/types';

import * as blobsAct from './slice';
import { BlobType } from './types';

export interface Data {
  id: string;
  type: BlobType;
  data: Blob;
  image: ImageOutputResponse;
}

export class BlobsDexie extends Dexie {
  data!: Table<Data>;

  constructor(name: string) {
    super(name);
    this.version(1).stores({
      data: 'id,type,image.type',
    });
  }
}

const blobs = new BlobsDexie('blobs');

export function* saveBlob(id: string, type: BlobType, data: Blob, image: ImageOutputResponse) {
  yield blobs.data.put({ id, type, data, image });
  yield put(blobsAct.registerBlob({ id, type, imageType: image.type }));
}

export function* readBlobWithType(id: string, type: BlobType) {
  const record: Data | undefined = yield blobs.data.where({ id, type }).first();

  return record?.data;
}

export function* readBlobWithImageType(id: string, type: string) {
  const record: Data | undefined = yield blobs.data.where({ id, image: { type } }).first();

  return record?.data;
}

export function* readBlobAsURL(id: string, type: BlobType) {
  const blob: Blob | undefined = yield call(readBlobWithType, id, type);

  if (blob) {
    return URL.createObjectURL(blob);
  }
}

export function* blobsSaga() {}
