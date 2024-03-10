import React from 'react';
import { FC } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch } from 'react-redux';

import { ListItemIcon, ListItemText, MenuItem } from '@mui/material';

import CircleIcon from '@mui/icons-material/Circle';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import FormatColorResetIcon from '@mui/icons-material/FormatColorReset';

import { SubMenuItem } from '_components/context-menu';
import * as workflowAct from '_state/features/workflow/slice';
import { NodeColor } from '_state/features/workflow/types';
import { useColorMode } from '_theme';

import { backgroundByType } from '../../utils/backgroundColor';

type Props = {
  id: string;

  onClose: () => void;
};

export const ChangeColorSubMenu: FC<Props> = ({ id, onClose }) => {
  const colorMode = useColorMode();

  const dispatch = useDispatch();

  return (
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
            <ListItemText
              primary={
                <FormattedMessage
                  id="ui.node.context-menu.change-color.item.reset-color"
                  defaultMessage="Reset color"
                />
              }
            />
          </MenuItem>,
        ],
      }}
    >
      <ListItemIcon>
        <ColorLensIcon />
      </ListItemIcon>
      <ListItemText
        primary={<FormattedMessage id="ui.node.context-menu.change-color" defaultMessage="Change color" />}
      />
    </SubMenuItem>
  );
};
