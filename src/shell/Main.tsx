import React, { useCallback, useMemo, useState } from 'react';
import { IntlProvider } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { MemoryRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { ReactFlowProvider } from 'reactflow';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';

import { Container, CssBaseline, InitColorSchemeScript, ThemeProvider } from '@mui/material';

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
import { ColorModeProvider, createTheme } from '_theme';

import { globalStyles } from '../styles';

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
              <Route path={ROUTES.workspaces} Component={WorkspacesAppBarWidgets} />
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
  const locale = useSelector(settingsSel.getLocale);
  const location = useSelector(settingsSel.getLocation);

  const theme = useMemo(() => createTheme(locale), [locale]);

  return (
    <IntlProvider locale={locale} messages={messages[locale]}>
      <LocalizationProvider dateAdapter={AdapterLuxon}>
        <ThemeProvider disableTransitionOnChange theme={theme}>
          <InitColorSchemeScript attribute="[data-color-mode=%s]" />
          <CssBaseline enableColorScheme />
          {globalStyles}

          <ColorModeProvider>
            <Router initialEntries={[location]}>
              <ReactFlowProvider>
                <RootLayout />
              </ReactFlowProvider>
            </Router>

            <Notifications />
          </ColorModeProvider>
        </ThemeProvider>
      </LocalizationProvider>
    </IntlProvider>
  );
};
