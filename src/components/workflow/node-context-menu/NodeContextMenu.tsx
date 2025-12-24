import React, { memo } from 'react';
import { FC } from 'react';
import { Node } from 'reactflow';

import { Divider, ListItem, ListItemText } from '@mui/material';

import { ContextMenu } from '_components/context-menu';
import * as workflowChecks from '_state/features/workflow/checks';
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

  const hasInputs = workflowChecks.hasInputs(data, true);
  const hasWidgets = workflowChecks.hasWidgets(data);
  const canBeBypassed = workflowChecks.canBeBypassed(data);

  return (
    <ContextMenu
      anchorReference="anchorPosition"
      anchorPosition={{ top: position.y, left: position.x }}
      open={isOpen}
      slotProps={{
        list: {
          dense: true,
        },
      }}
      onClose={onClose}
    >
      <ListItem sx={{ py: 0 }}>
        <ListItemText
          secondary={data.nodeType.title}
          primary={id}
          slotProps={{
            secondary: {
              component: 'h6',
              color: 'text.primary',
              variant: 'subtitle2',
              whiteSpace: 'nowrap',
            },
            primary: {
              component: 'span',
              color: 'text.secondary',
              variant: 'caption',
              fontSize: '8px',
              whiteSpace: 'nowrap',
            },
          }}
        />
      </ListItem>
      <Divider sx={{ my: 1 }} />
      {hasInputs && [
        <ConvertToWidgetSubMenu key="inputs-to-widget" id={id} inputs={node.data.inputs} onClose={onClose} />,
        <Divider key="inputs-divider" />,
      ]}

      {hasWidgets &&
        hasInputs && [
          <ConvertToInputSubMenu
            key="widgets-to-input"
            id={id}
            inputs={data.inputs}
            widgets={data.widgets}
            onClose={onClose}
          />,
          <Divider key="widgets-divider" />,
        ]}

      <ChangeColorSubMenu id={id} onClose={onClose} />
      <Divider />
      {canBeBypassed && [<BypassItem key="bypass" id={id} onClose={onClose} />, <Divider key="bypass-divider" />]}
      <DisconnectAllItem id={id} onClose={onClose} />
    </ContextMenu>
  );
});
NodeContextMenu.displayName = 'NodeContextMenu';
