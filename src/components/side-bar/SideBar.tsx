import React, { FC } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';

import {
  AppBar,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
  Toolbar,
  Typography,
  useTheme,
} from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';

import { useRouteConditions } from '_routes';
import * as settingsSel from '_state/features/settings/selector';
import * as settingsAct from '_state/features/settings/slice';
import {
  CodeTheme,
  Locale,
  WorkflowBackground,
  WorkflowEdgeType,
  WorkflowHandleType,
} from '_state/features/settings/types';
import { ColorMode } from '_theme';

const GeneralSettingsList = () => {
  const dispatch = useDispatch();

  const locale = useSelector(settingsSel.getLocale);
  const colorMode = useSelector(settingsSel.getColorMode);
  const codeTheme = useSelector(settingsSel.getCodeTheme);

  return (
    <List
      subheader={
        <ListSubheader>
          <FormattedMessage id="ui.side-bar.general.title" defaultMessage="General" />
        </ListSubheader>
      }
    >
      <ListItem
        secondaryAction={
          <Select
            size="small"
            fullWidth
            value={locale}
            onChange={(e) => {
              dispatch(settingsAct.changeLocale(e.target.value as Locale));
            }}
          >
            <MenuItem value={Locale.EN_US}>EN (US)</MenuItem>
            <MenuItem value={Locale.RU_RU}>RU</MenuItem>
          </Select>
        }
      >
        <ListItemText primary={<FormattedMessage id="ui.side-bar.general.language" defaultMessage="Language" />} />
      </ListItem>
      <ListItem
        secondaryAction={
          <Select
            size="small"
            fullWidth
            value={colorMode}
            onChange={(e) => {
              dispatch(settingsAct.changeColorMode(e.target.value as ColorMode));
            }}
          >
            <MenuItem value={ColorMode.Dark}>Dark</MenuItem>
            <MenuItem value={ColorMode.Light}>Light</MenuItem>
          </Select>
        }
      >
        <ListItemText primary={<FormattedMessage id="ui.side-bar.general.theme" defaultMessage="Theme" />} />
      </ListItem>
      <ListItem
        secondaryAction={
          <Select
            size="small"
            fullWidth
            value={codeTheme}
            onChange={(e) => {
              dispatch(settingsAct.changeCodeTheme(e.target.value as CodeTheme));
            }}
          >
            <MenuItem value={CodeTheme.A11y}>a11y</MenuItem>
            <MenuItem value={CodeTheme.AtomOne}>Atom One</MenuItem>
            <MenuItem value={CodeTheme.Kimbie}>kimbie</MenuItem>
            <MenuItem value={CodeTheme.Nnfx}>nnfx</MenuItem>
            <MenuItem value={CodeTheme.Solarized}>solarized</MenuItem>
            <MenuItem value={CodeTheme.StackOverflow}>StackOverflow</MenuItem>
          </Select>
        }
      >
        <ListItemText primary={<FormattedMessage id="ui.side-bar.general.code-theme" defaultMessage="Code theme" />} />
      </ListItem>
    </List>
  );
};

const WorkflowSettingsList: FC<{ visible: boolean }> = ({ visible }) => {
  const dispatch = useDispatch();

  const edgeType = useSelector(settingsSel.getWorkflowEdgeType);
  const handleType = useSelector(settingsSel.getWorkflowHandleType);
  const background = useSelector(settingsSel.getWorkflowBackground);
  const snapToGrid = useSelector(settingsSel.getWorkflowSnapToGrid);
  const snapGrid = useSelector(settingsSel.getWorkflowSnapGrid);

  if (!visible) {
    return;
  }

  return (
    <List
      subheader={
        <ListSubheader>
          <FormattedMessage id="ui.side-bar.workflow.title" defaultMessage="Workflow" />
        </ListSubheader>
      }
    >
      <ListItem
        secondaryAction={
          <Select
            size="small"
            fullWidth
            value={edgeType}
            onChange={(e) => {
              dispatch(settingsAct.changeWorkflowEdgeType(e.target.value as WorkflowEdgeType));
            }}
          >
            <MenuItem value={WorkflowEdgeType.Curve}>Curve</MenuItem>
            <MenuItem value={WorkflowEdgeType.SimpleCurve}>SimpleCurve</MenuItem>
            <MenuItem value={WorkflowEdgeType.SmoothStep}>SmoothStep</MenuItem>
            <MenuItem value={WorkflowEdgeType.Step}>Step</MenuItem>
            <MenuItem value={WorkflowEdgeType.Straight}>Straight</MenuItem>
          </Select>
        }
      >
        <ListItemText primary={<FormattedMessage id="ui.side-bar.workflow.edge-type" defaultMessage="Edge type" />} />
      </ListItem>
      <ListItem
        secondaryAction={
          <Select
            size="small"
            fullWidth
            value={handleType}
            onChange={(e) => {
              dispatch(settingsAct.changeWorkflowHandleType(e.target.value as WorkflowHandleType));
            }}
          >
            <MenuItem value={WorkflowHandleType.Circle}>Circle</MenuItem>
            <MenuItem value={WorkflowHandleType.Square}>Square</MenuItem>
            <MenuItem value={WorkflowHandleType.Arrow}>Arrow</MenuItem>
            <MenuItem value={WorkflowHandleType.Hexagon}>Hexagon</MenuItem>
          </Select>
        }
      >
        <ListItemText
          primary={<FormattedMessage id="ui.side-bar.workflow.handle-type" defaultMessage="Handle type" />}
        />
      </ListItem>
      <ListItem
        secondaryAction={
          <Select
            size="small"
            fullWidth
            value={background}
            onChange={(e) => {
              dispatch(settingsAct.changeWorkflowBackground(e.target.value as WorkflowBackground));
            }}
          >
            <MenuItem value={WorkflowBackground.Dots}>Dots</MenuItem>
            <MenuItem value={WorkflowBackground.Lines}>Lines</MenuItem>
            <MenuItem value={WorkflowBackground.Cross}>Cross</MenuItem>
          </Select>
        }
      >
        <ListItemText primary={<FormattedMessage id="ui.side-bar.workflow.background" defaultMessage="Backgroud" />} />
      </ListItem>
      <ListItem
        secondaryAction={
          <Switch
            edge="end"
            checked={snapToGrid}
            onChange={(e, checked) => {
              dispatch(settingsAct.changeWorkflowSnapToGrid(checked));
            }}
          />
        }
      >
        <ListItemText
          primary={<FormattedMessage id="ui.side-bar.workflow.snap-to-grid" defaultMessage="Snap to grid" />}
        />
      </ListItem>
      <ListItem
        secondaryAction={
          <TextField
            size="small"
            fullWidth
            value={snapGrid}
            onChange={(e) => {
              dispatch(settingsAct.changeWorkflowSnapGrid(Number.parseInt(e.target.value)));
            }}
          />
        }
      >
        <ListItemText primary={<FormattedMessage id="ui.side-bar.workflow.snap-grid" defaultMessage="Snap grid" />} />
      </ListItem>
    </List>
  );
};

const WorkspacesSettingsList: FC<{ visible: boolean }> = ({ visible }) => {
  if (!visible) {
    return;
  }

  return (
    <List
      subheader={
        <ListSubheader>
          <FormattedMessage id="ui.side-bar.workspaces.title" defaultMessage="Workspaces" />
        </ListSubheader>
      }
    ></List>
  );
};

type Props = {
  open: boolean;
  onClose: () => void;
};

export const SideBar: FC<Props> = ({ open, onClose }) => {
  const theme = useTheme();

  const { isWorkflowPage, isWorkspacesPage } = useRouteConditions();

  return (
    <Drawer open={open} variant="temporary" anchor="left" onClose={onClose}>
      <AppBar component="div" position="static" variant="elevation" sx={{ width: 480, zIndex: theme.zIndex.appBar }}>
        <Toolbar component={Stack} variant="dense" direction="row" alignItems="center" justifyContent="space-between">
          <Stack gap={2} direction="row" alignItems="center">
            <IconButton edge="start" color="inherit" onClick={onClose}>
              <CloseIcon />
            </IconButton>
            <Typography component="div" variant="h6" color="inherit" textTransform="uppercase">
              Comfyrmant
            </Typography>
          </Stack>
        </Toolbar>
      </AppBar>
      <GeneralSettingsList />
      <WorkflowSettingsList visible={isWorkflowPage} />
      <WorkspacesSettingsList visible={isWorkspacesPage} />
    </Drawer>
  );
};
