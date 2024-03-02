import React, { useCallback } from 'react';
import { FC } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch } from 'react-redux';

import LinkOffIcon from '@mui/icons-material/LinkOff';

import * as workflowAct from '_state/features/workflow/slice';

import { Item } from './Item';

type Props = {
  id: string;

  onClose: () => void;
};

export const DisconnectAllItem: FC<Props> = ({ id, onClose }) => {
  const dispatch = useDispatch();

  const handleDisconnectAll = useCallback(() => {
    onClose();

    dispatch(workflowAct.removeEdgesToNode(id));
  }, [onClose]);

  return (
    <Item
      icon={<LinkOffIcon color="error" />}
      label={<FormattedMessage id="ui.node.context-menu.disconnect-all" defaultMessage="Disconnect all" />}
      color="error"
      onClick={handleDisconnectAll}
    />
  );
};
