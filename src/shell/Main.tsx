import React, { useCallback, useMemo, useState } from 'react';
import { IntlProvider } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { MemoryRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { ReactFlowProvider } from 'reactflow';

import { Container, CssBaseline, ThemeProvider } from '@mui/material';

import { AppBar } from '_components/app-bar';
import { Notifications } from '_components/notification';
import { SideBar } from '_components/side-bar';
import { messages } from '_intl';
import { HistoryAppBarWidgets, HistoryPage } from '_page/HistoryPage';
import { WorkflowAppBarWidgets, WorkflowPage } from '_page/WorkflowPage';
import { WorkspacesAppBarWidgets, WorkspacesPage } from '_page/WorkspacesPage';
import { ROUTES } from '_routes';
import * as settingsSel from '_state/features/settings/selector';
import * as settingsAct from '_state/features/settings/slice';
import { createTheme, useColorMode } from '_theme';

const ROUTER_FUTURE = {
  v7_relativeSplatPath: true,
  v7_startTransition: true,
};

const useRouterLocationListener = () => {
  const location = useLocation();

  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(settingsAct.changeLocation(location.pathname));
  }, [location]);
};

const RootLayout = () => {
  const [sideBar, setSideBar] = useState(false);

  const handleMenu = useCallback(() => {
    setSideBar(true);
  }, [setSideBar]);

  const handleClose = useCallback(() => {
    setSideBar(false);
  }, [setSideBar]);

  useRouterLocationListener();

  return (
    <>
      <SideBar open={sideBar} onClose={handleClose} />

      <Container disableGutters maxWidth={false} sx={{ height: '100%', pt: '48px' }}>
        <ReactFlowProvider>
          <AppBar onMenu={handleMenu}>
            <Routes>
              <Route path={ROUTES.workflow} Component={WorkflowAppBarWidgets} />
              <Route path={ROUTES.history} Component={HistoryAppBarWidgets} />
              <Route index path={ROUTES.workspaces} Component={WorkspacesAppBarWidgets} />
            </Routes>
          </AppBar>

          <Routes>
            <Route path={ROUTES.workflow} Component={WorkflowPage} />
            <Route path={ROUTES.history} Component={HistoryPage} />
            <Route index path={ROUTES.workspaces} Component={WorkspacesPage} />
          </Routes>
        </ReactFlowProvider>
      </Container>
    </>
  );
};

export const Main = () => {
  const colorMode = useColorMode();
  const theme = useMemo(() => createTheme(colorMode), [colorMode]);

  const locale = useSelector(settingsSel.getLocale);
  const location = useSelector(settingsSel.getLocation);

  return (
    <IntlProvider locale={locale} messages={messages[locale]}>
      <ThemeProvider theme={theme}>
        <CssBaseline enableColorScheme />

        <Router future={ROUTER_FUTURE} initialEntries={[location]}>
          <ReactFlowProvider>
            <RootLayout />
          </ReactFlowProvider>
        </Router>

        <Notifications />
      </ThemeProvider>
    </IntlProvider>
  );
};
