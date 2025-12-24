import { createSelector } from '@reduxjs/toolkit';

import { RootState } from '_state/store';
import { firstFree } from '_state/utils';

import { ImageOutputResponse } from '../api/types';

import { imageToStr } from './helpers';
import slice from './slice';

const getBlobs = (state: RootState) => state[slice.name];

// const getBlobsByImage = createSelector(getBlobs, (blobs) => blobs.byImage);
// const getBlobsByType = createSelector(getBlobs, (blobs) => blobs.byType);
const getBlobsById = createSelector(getBlobs, (blobs) => blobs.byId);
const getUrls = createSelector(getBlobs, (blobs) => blobs.urls);

export const getBlobById = createSelector([getBlobsById, firstFree<string>], (blobs, id) => blobs.byId[id]);

export const getBlobUrlByImage = createSelector(
  [getUrls, (_, image: ImageOutputResponse) => imageToStr(image)],
  (urls, image) => urls[image],
);
