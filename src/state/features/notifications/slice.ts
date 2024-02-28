import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Notification } from './types';

type NotificationsState = Record<string, Notification>;

const initialState: NotificationsState = {};

const notificationsSlice = createSlice({
  name: '@notifications',
  initialState,
  reducers: {
    add(state, action: PayloadAction<Notification>) {
      state[action.payload.id] = action.payload;
    },
    remove(state, action: PayloadAction<string>) {
      delete state[action.payload];
    },
  },
});

export default notificationsSlice;

export const { add, remove } = notificationsSlice.actions;
