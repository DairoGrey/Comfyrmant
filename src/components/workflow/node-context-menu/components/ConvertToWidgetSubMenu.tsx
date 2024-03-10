import React, { useCallback } from 'react';
import { FC } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch } from 'react-redux';

import { ListItemIcon, ListItemText, Typography } from '@mui/material';

import CircleIcon from '@mui/icons-material/Circle';
import EditIcon from '@mui/icons-material/Edit';

import { SubMenuItem } from '_components/context-menu';
import * as workflowAct from '_state/features/workflow/slice';
import { NodeInputState, NodeWidgetState } from '_state/features/workflow/types';
import { useColorMode } from '_theme';

import { colorByType } from '../../utils/colorByType';

import { Item } from './Item';

type Props = {
  id: string;
  inputs: Record<string, NodeInputState>;

  onClose: () => void;
};

export const ConvertToWidgetSubMenu: FC<Props> = ({ id, inputs, onClose }) => {
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

  return (
    <SubMenuItem
      MenuProps={{
        onClose,
        children: [
          ...Object.values(inputs)
            .filter((input) => !input.hidden)
            .map((input) => (
              <Item
                key={input.name}
                icon={<CircleIcon sx={{ color: colorByType(input.type, colorMode) }} />}
                label={
                  <FormattedMessage
                    id="ui.node.context-menu.convert-input-to-widget.item"
                    defaultMessage={`<colored>{input}</colored>`}
                    values={{
                      colored: (chunks) => (
                        <Typography component="span" color={colorByType(input.type, colorMode)}>
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
        ],
      }}
    >
      <ListItemIcon>
        <EditIcon />
      </ListItemIcon>
      <ListItemText
        primary={
          <FormattedMessage id="ui.node.context-menu.convert-input-to-widget" defaultMessage={`Convert to widget`} />
        }
      />
    </SubMenuItem>
  );
};
