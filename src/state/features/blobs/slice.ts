import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ImageOutputResponse } from '../api/types';

import { BlobType } from './types';

type BlobsState = {
  byImageType: Record<ImageOutputResponse['type'], Record<string, unknown>>;
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
  byImageType: {
    temp: {},
    output: {},
  },
  urls: {},
};

const blobsSlice = createSlice({
  name: '@blobs',
  initialState,
  reducers: {
    registerBlob(state, action: PayloadAction<{ id: string; imageType: ImageOutputResponse['type']; type: BlobType }>) {
      const { id, imageType, type } = action.payload;

      const record = { id, image: { type: imageType }, type };

      state.byId[id] = record;
      state.byImageType[imageType][id] = record;
      state.byType[type][id] = record;
    },
    removeBlob(state, action: PayloadAction<{ id: string; imageType: ImageOutputResponse['type']; type: BlobType }>) {
      const { id, imageType, type } = action.payload;

      delete state.byId[id];
      delete state.byImageType[imageType][id];
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
