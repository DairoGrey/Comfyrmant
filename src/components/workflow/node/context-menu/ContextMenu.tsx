import React, { memo } from 'react';
import { FC } from 'react';

import { Divider } from '@mui/material';

import { ContextMenu as _ContextMenu } from '_components/context-menu';
import { NodeInputState, NodeWidgetState } from '_state/features/workflow/types';

import { ChangeColorSubMenu } from './components/ChangeColorSubMenu';
import { ConvertToInputSubMenu } from './components/ConvertToInputSubMenu';
import { ConvertToWidgetSubMenu } from './components/ConvertToWidgetSubMenu';
import { DisconnectAllItem } from './components/DisconnectAllItem';

type Props = {
  anchorEl: HTMLButtonElement | null;
  open: boolean;

  id: string;
  inputs: Record<string, NodeInputState>;
  widgets?: Record<string, NodeWidgetState>;

  onClose: () => void;
};

export const ContextMenu: FC<Props> = memo(({ open, anchorEl, id, inputs, widgets, onClose }) => {
  const hasInputs = Object.values(inputs).filter((input) => !input.hidden).length > 0;
  const hasWidgets = widgets && Object.values(widgets).length > 0;

  return (
    <_ContextMenu anchorEl={anchorEl} open={open} onClose={onClose}>
      {hasInputs && [
        <ConvertToWidgetSubMenu key="inputs-to-widget" id={id} inputs={inputs} onClose={onClose} />,
        <Divider key="inputs-divider" />,
      ]}

      {hasWidgets &&
        hasInputs && [
          <ConvertToInputSubMenu key="widgets-to-input" id={id} inputs={inputs} widgets={widgets} onClose={onClose} />,
          <Divider key="widgets-divider" />,
        ]}

      <ChangeColorSubMenu id={id} onClose={onClose} />
      <Divider />
      <DisconnectAllItem id={id} onClose={onClose} />
    </_ContextMenu>
  );
});
