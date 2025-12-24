import React, { useMemo } from 'react';
import { Provider as StoreProvider } from 'react-redux';

import { PersistGate } from 'redux-persist/integration/react';

import { Main } from '_shell/Main';
import { makeStore } from '_state/store';

export const App = () => {
  const [store, persistor] = useMemo(() => makeStore(), []);

  return (
    <StoreProvider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Main />
      </PersistGate>
    </StoreProvider>
  );
};
