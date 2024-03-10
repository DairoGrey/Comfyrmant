import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ImageOutputResponse } from '../api/types';

import { BlobType } from './types';

type BlobsState = {
  byImage: Record<string, Record<string, unknown>>;
  byType: Record<BlobType, Record<string, unknown>>;
  byId: Record<string, Record<string, unknown>>;
  urls: Record<string, string>;
};

const initialState: BlobsState = {
  byType: {
    [BlobType.Preview]: {},
    [BlobType.Output]: {},
  },
  byId: {},
  byImage: {},
  urls: {},
};

export const loadBlob = createAction<ImageOutputResponse>('@blobs/loadBlob');
export const unloadBlob = createAction<ImageOutputResponse>('@blobs/unloadBlob');

const blobsSlice = createSlice({
  name: '@blobs',
  initialState,
  reducers: {
    registerBlob(state, action: PayloadAction<{ id: string; image: string; type: BlobType }>) {
      const { id, image, type } = action.payload;

      const record = { id, image, type };

      state.byId[id] = record;
      state.byImage[image] = record;
      state.byType[type][id] = record;
    },
    removeBlob(state, action: PayloadAction<{ id: string; image: string; type: BlobType }>) {
      const { id, image, type } = action.payload;

      delete state.byId[id];
      delete state.byImage[image][id];
      delete state.byType[type][id];
    },
    saveBlobUrl(state, action: PayloadAction<{ id: string; url: string }>) {
      const { id, url } = action.payload;

      state.urls[id] = url;
    },
    removeBlobUrl(state, action: PayloadAction<string>) {
      const id = action.payload;

      delete state.urls[id];
    },
  },
});

export default blobsSlice;

export const { registerBlob, removeBlob, saveBlobUrl, removeBlobUrl } = blobsSlice.actions;
