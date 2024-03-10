import React, { memo } from 'react';
import { FC } from 'react';
import { Node } from 'reactflow';

import { Divider, ListItem, ListItemText } from '@mui/material';

import { ContextMenu as _ContextMenu } from '_components/context-menu';
import { NodeStateData } from '_state/features/workflow/types';

import { BypassItem } from './components/BypassItem';
import { ChangeColorSubMenu } from './components/ChangeColorSubMenu';
import { ConvertToInputSubMenu } from './components/ConvertToInputSubMenu';
import { ConvertToWidgetSubMenu } from './components/ConvertToWidgetSubMenu';
import { DisconnectAllItem } from './components/DisconnectAllItem';

type Props = {
  isOpen: boolean;
  position: { x: number; y: number } | null;

  node: Node<NodeStateData> | null;

  onClose: () => void;
};

export const NodeContextMenu: FC<Props> = memo(({ isOpen, position, node, onClose }) => {
  if (!node || !position) {
    return;
  }

  const { id, data } = node;
  const { inputs, widgets } = data;

  const hasInputs = Object.values(inputs).filter((input) => !input.hidden).length > 0;
  const hasWidgets = widgets && Object.values(widgets).length > 0;

  return (
    <_ContextMenu
      anchorReference="anchorPosition"
      anchorPosition={{ top: position.y, left: position.x }}
      open={isOpen}
      onClose={onClose}
    >
      <ListItem sx={{ py: 0 }}>
        <ListItemText
          secondary={data.nodeType.title}
          secondaryTypographyProps={{
            component: 'h6',
            color: 'text.primary',
            variant: 'subtitle2',
            whiteSpace: 'nowrap',
          }}
          primary={id}
          primaryTypographyProps={{
            component: 'span',
            color: 'text.secondary',
            variant: 'caption',
            fontSize: '8px',
            whiteSpace: 'nowrap',
          }}
        />
      </ListItem>
      <Divider sx={{ my: 1 }} />
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
      <BypassItem id={id} onClose={onClose} />
      <Divider />
      <DisconnectAllItem id={id} onClose={onClose} />
    </_ContextMenu>
  );
});
NodeContextMenu.displayName = 'NodeContextMenu';
