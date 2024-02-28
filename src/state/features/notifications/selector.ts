import { RootState } from '_state/store';

import slice from './slice';

export const getNotifications = (state: RootState) => state[slice.name];
