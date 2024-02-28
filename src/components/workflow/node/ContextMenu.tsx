import React, { useCallback } from 'react';
import { FC } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch } from 'react-redux';

import { Divider, ListItemIcon, ListItemText, MenuItem, Typography } from '@mui/material';

import CircleIcon from '@mui/icons-material/Circle';
import ClearIcon from '@mui/icons-material/Clear';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import EditIcon from '@mui/icons-material/Edit';
import EditOffIcon from '@mui/icons-material/EditOff';
import FormatColorResetIcon from '@mui/icons-material/FormatColorReset';

import { ContextMenu, SubMenuItem } from '_components/context-menu';
import * as workflowAct from '_state/features/workflow/slice';
import { NodeColor, NodeInputState, NodeWidgetState } from '_state/features/workflow/types';
import { useColorMode } from '_theme';

import { backgroundByType } from '../utils/backgroundColor';
import { colorByType } from '../utils/colorByType';

type ItemProps = {
  icon: React.ReactNode;
  label: React.ReactNode;
  color?: string;

  onClick: () => void;
};

const Item: FC<ItemProps> = ({ icon, label, color, onClick }) => {
  return (
    <MenuItem onClick={onClick} disableRipple>
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText primary={label} primaryTypographyProps={{ color }} />
    </MenuItem>
  );
};

type Props = {
  anchorEl: HTMLButtonElement | null;
  open: boolean;

  id: string;
  inputs: Record<string, NodeInputState>;
  widgets?: Record<string, NodeWidgetState>;

  onClose: () => void;
};

export const NodeContextMenu: FC<Props> = ({ open, anchorEl, id, inputs, widgets, onClose }) => {
  const hasInputs = Object.values(inputs).filter((input) => !input.hidden).length > 0;
  const hasWidgets = widgets && Object.values(widgets).length > 0;

  const colorMode = useColorMode();

  const dispatch = useDispatch();

  const handleConvertToWidget = useCallback(
    (input: string) => {
      onClose();

      const widget: NodeWidgetState = {
        type: 'input',
        id: input,
        name: input,
      };

      dispatch(workflowAct.addNodeWidget({ id, widget }));
    },
    [id, onClose],
  );

  const handleConvertToInput = useCallback(
    (widget: string) => {
      onClose();

      dispatch(workflowAct.removeNodeWidget({ id, widget }));
    },
    [id, onClose],
  );

  const handleDisconnectAll = useCallback(() => {
    onClose();

    dispatch(workflowAct.removeEdgesToNode(id));
  }, [onClose]);

  return (
    <ContextMenu anchorEl={anchorEl} open={open} onClose={onClose}>
      {hasInputs && [
        ...Object.values(inputs)
          .filter((input) => !input.hidden)
          .map((input) => (
            <Item
              key={input.name}
              icon={<EditIcon />}
              label={
                <FormattedMessage
                  id="ui.node.context-menu.convert-input-to-widget"
                  defaultMessage={`Convert <b>{input}</b> to widget`}
                  values={{
                    b: (chunks) => (
                      <Typography component="span" fontWeight="bold" color={colorByType(input.type, colorMode)}>
                        {chunks}
                      </Typography>
                    ),
                    input: input.name,
                  }}
                />
              }
              onClick={() => handleConvertToWidget(input.name)}
            />
          )),
        <Divider key="inputs-divider" />,
      ]}

      {hasWidgets && [
        ...Object.values(widgets).map((widget) => {
          const input = inputs[widget.id];

          return (
            <Item
              key={widget.name}
              icon={<EditOffIcon />}
              label={
                <FormattedMessage
                  id="ui.node.context-menu.convert-widget-to-input"
                  defaultMessage={`Convert <b>{widget}</b> to input`}
                  values={{
                    b: (chunks) => (
                      <Typography component="span" fontWeight="bold" color={colorByType(input.type, colorMode)}>
                        {chunks}
                      </Typography>
                    ),
                    widget: widget.name,
                  }}
                />
              }
              onClick={() => handleConvertToInput(widget.name)}
            />
          );
        }),
        <Divider key="widgets-divider" />,
      ]}
      <SubMenuItem
        MenuProps={{
          onClose,
          children: [
            Object.entries(NodeColor).map(([key, nodeColor]) => (
              <MenuItem
                key={key}
                onClick={() => {
                  dispatch(workflowAct.updateNodeColor({ id, color: nodeColor }));
                  onClose();
                }}
              >
                <ListItemIcon>
                  <CircleIcon sx={{ color: backgroundByType(nodeColor, colorMode) }} />
                </ListItemIcon>
                <ListItemText primary={key} />
              </MenuItem>
            )),
            <MenuItem
              key="reset-color"
              onClick={() => {
                dispatch(workflowAct.resetNodeColor({ id }));
                onClose();
              }}
            >
              <ListItemIcon>
                <FormatColorResetIcon />
              </ListItemIcon>
              <ListItemText primary="Reset color" />
            </MenuItem>,
          ],
        }}
      >
        <ListItemIcon>
          <ColorLensIcon />
        </ListItemIcon>
        <ListItemText primary="Change color" />
      </SubMenuItem>
      <Divider />
      <Item
        icon={<ClearIcon color="error" />}
        label={<FormattedMessage id="ui.node.context-menu.disconnect-all" defaultMessage="Disconnect all" />}
        color="error"
        onClick={handleDisconnectAll}
      />
    </ContextMenu>
  );
};
