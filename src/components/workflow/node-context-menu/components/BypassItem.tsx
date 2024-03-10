import React, { useCallback } from 'react';
import { FC } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch } from 'react-redux';

import ShortcutIcon from '@mui/icons-material/Shortcut';

import * as workflowAct from '_state/features/workflow/slice';

import { Item } from './Item';

type Props = {
  id: string;

  onClose: () => void;
};

export const BypassItem: FC<Props> = ({ id, onClose }) => {
  const dispatch = useDispatch();

  const handleBypass = useCallback(() => {
    onClose();

    dispatch(workflowAct.toggleNodeBypass(id));
  }, [onClose]);

  return (
    <Item
      icon={<ShortcutIcon color="warning" />}
      label={<FormattedMessage id="ui.node.context-menu.bypass" defaultMessage="Bypass" />}
      color="warning"
      onClick={handleBypass}
    />
  );
};
