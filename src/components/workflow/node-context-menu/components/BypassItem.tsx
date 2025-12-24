import React, { useCallback } from 'react';
import { FC } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';

import StraightIcon from '@mui/icons-material/StraightRounded';
import TurnRightIcon from '@mui/icons-material/TurnRightRounded';

import * as workflowSel from '_state/features/workflow/selector';
import * as workflowAct from '_state/features/workflow/slice';
import { RootState } from '_state/store';

import { Item } from './Item';

type Props = {
  id: string;

  onClose: () => void;
};

export const BypassItem: FC<Props> = ({ id, onClose }) => {
  const dispatch = useDispatch();

  const getNodeBypass = useCallback((state: RootState) => workflowSel.getNodeBypass(state, id), [id]);

  const bypass = useSelector(getNodeBypass);

  const handleBypass = useCallback(() => {
    onClose();

    dispatch(workflowAct.toggleNodeBypass(id));
  }, [onClose]);

  const Icon = bypass ? StraightIcon : TurnRightIcon;
  const message = bypass ? (
    <FormattedMessage id="ui.node.context-menu.keep" defaultMessage="Keep" />
  ) : (
    <FormattedMessage id="ui.node.context-menu.bypass" defaultMessage="Bypass" />
  );

  return <Item icon={<Icon color="warning" />} label={message} color="warning.main" onClick={handleBypass} />;
};
