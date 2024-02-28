import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PersistConfig,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import createSagaMiddleware from 'redux-saga';

import apiSlice from '_state/features/api/slice';

import indexedDbStorage from './persist-storage/indexed-db';
import { rootReducer } from './rootReducer';
import { rootSaga } from './rootSaga';

const persistConfig: PersistConfig<ReturnType<typeof rootReducer>> & {
  deserialize?: boolean;
} = {
  key: 'root',
  version: 1,
  storage: indexedDbStorage('persist'),
  blacklist: ['@api', '@hub', '@notifications'],
  stateReconciler: autoMergeLevel2,
  serialize: false,
  deserialize: false,
};

export const makeStore = () => {
  const sagaMiddleware = createSagaMiddleware();

  const persistedReducer = persistReducer(persistConfig, rootReducer);

  const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }).concat(sagaMiddleware, apiSlice.middleware),
  });

  setupListeners(store.dispatch);

  const persistor = persistStore(store);

  const task = sagaMiddleware.run(rootSaga);

  return [store, persistor, task] as const;
};

export type RootState = ReturnType<ReturnType<typeof makeStore>[0]['getState']>;
export type AppDispatch = ReturnType<typeof makeStore>[0]['dispatch'];
