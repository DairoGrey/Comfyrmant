import { createSelector } from '@reduxjs/toolkit';

import { RootState } from '_state/store';

import slice from './slice';

const getBlobs = (state: RootState) => state[slice.name];

export const getBlobsByImageType = createSelector(getBlobs, (blobs) => blobs.byImageType);
export const getBlobsByType = createSelector(getBlobs, (blobs) => blobs.byType);
export const getBlobsById = createSelector(getBlobs, (blobs) => blobs.byId);

export const getBlobById = createSelector([getBlobsById, (_, id: string) => id], (blobs, id) => blobs.byId[id]);
