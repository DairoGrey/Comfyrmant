import { Draft, PayloadAction } from '@reduxjs/toolkit';
import cloneDeep from 'lodash/cloneDeep';
import * as uuid from 'uuid';

import type { WorkflowState } from '../slice';

export const cloneNode = (state: Draft<WorkflowState>, action: PayloadAction<string>) => {
  const id = action.payload;

  const node = state.nodes.find((node) => node.id === id);

  if (node) {
    node.selected = false;

    const clonedNode = cloneDeep(node);

    clonedNode.id = uuid.v4();
    clonedNode.selected = true;
    clonedNode.dragging = false;
    clonedNode.resizing = false;

    clonedNode.connectable = true;
    clonedNode.deletable = true;
    clonedNode.draggable = true;
    clonedNode.focusable = true;

    clonedNode.position.x = clonedNode.position.x + 32;
    clonedNode.position.y = clonedNode.position.y + 32;

    clonedNode.data.locked = false;
    clonedNode.data.collapsed = false;
    clonedNode.data.resizing = false;

    state.nodes.push(clonedNode);
  }
};
