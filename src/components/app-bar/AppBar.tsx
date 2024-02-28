import React, { FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { AppBar as _AppBar, Divider, IconButton, Stack, Tab, Tabs, Toolbar, Typography } from '@mui/material';

import HistoryIcon from '@mui/icons-material/History';
import MenuIcon from '@mui/icons-material/Menu';
import SchemaIcon from '@mui/icons-material/Schema';
import WorkspacesIcon from '@mui/icons-material/Workspaces';

import { ColorModeToggle } from '_components/color-mode-toggle';
import { ROUTES } from '_routes';

type Props = {
  onMenu: () => void;

  children?: React.ReactNode;
};

export const AppBar: FC<Props> = ({ onMenu, children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <_AppBar enableColorOnDark>
      <Toolbar component={Stack} variant="dense" direction="row" alignItems="center" justifyContent="space-between">
        <Stack direction="row" gap={2}>
          <Stack gap={2} direction="row" alignItems="center">
            <IconButton edge="start" color="inherit" onClick={onMenu}>
              <MenuIcon />
            </IconButton>
            <Typography component="div" variant="h6" color="inherit" textTransform="uppercase">
              Comfyrmant
            </Typography>
            <Divider flexItem variant="middle" orientation="vertical" />
            <Tabs
              textColor="inherit"
              indicatorColor="secondary"
              variant="standard"
              value={location.pathname}
              sx={{ '& .MuiTab-root': { minHeight: 48 } }}
              onChange={(e, value) => navigate(value)}
            >
              <Tab icon={<WorkspacesIcon />} iconPosition="start" label="Workspaces" value={ROUTES.workspaces} />
              <Tab icon={<SchemaIcon />} iconPosition="start" label="Workflow" value={ROUTES.workflow} />
              <Tab icon={<HistoryIcon />} iconPosition="start" label="History" value={ROUTES.history} />
            </Tabs>
          </Stack>
          {children}
        </Stack>
        <Stack gap={1} direction="row" alignItems="center">
          <ColorModeToggle />
        </Stack>
      </Toolbar>
    </_AppBar>
  );
};
