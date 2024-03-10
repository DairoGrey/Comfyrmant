import React, { useCallback } from 'react';
import { FC } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch } from 'react-redux';

import { ListItemIcon, ListItemText, MenuItem, Typography } from '@mui/material';

import CircleIcon from '@mui/icons-material/Circle';
import EditOffIcon from '@mui/icons-material/EditOff';

import { SubMenuItem } from '_components/context-menu';
import * as workflowAct from '_state/features/workflow/slice';
import { NodeInputState, NodeWidgetState } from '_state/features/workflow/types';
import { useColorMode } from '_theme';

import { colorByType } from '../../utils/colorByType';

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
  id: string;
  inputs: Record<string, NodeInputState>;
  widgets: Record<string, NodeWidgetState>;

  onClose: () => void;
};

export const ConvertToInputSubMenu: FC<Props> = ({ id, inputs, widgets, onClose }) => {
  const colorMode = useColorMode();

  const dispatch = useDispatch();

  const handleConvertToInput = useCallback(
    (widget: string) => {
      onClose();

      dispatch(workflowAct.removeNodeWidget({ id, widget }));
    },
    [id, onClose],
  );

  return (
    <SubMenuItem
      key="widget-to-input"
      MenuProps={{
        onClose,
        children: [
          ...Object.values(widgets).map((widget) => {
            const input = inputs[widget.id];

            return (
              <Item
                key={widget.name}
                icon={<CircleIcon sx={{ color: colorByType(input.type, colorMode) }} />}
                label={
                  <FormattedMessage
                    id="ui.node.context-menu.convert-widget-to-input.item"
                    defaultMessage={`<colored>{widget}</colored>`}
                    values={{
                      colored: (chunks) => (
                        <Typography component="span" color={colorByType(input.type, colorMode)}>
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
        ],
      }}
    >
      <ListItemIcon>
        <EditOffIcon />
      </ListItemIcon>
      <ListItemText
        primary={
          <FormattedMessage id="ui.node.context-menu.convert-widget-to-input" defaultMessage={`Convert to input`} />
        }
      />
    </SubMenuItem>
  );
};
