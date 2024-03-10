import React, { FC, memo } from 'react';
import { NodeToolbar, NodeToolbarProps, Position } from 'reactflow';

import { Button, ButtonGroup, Tooltip } from '@mui/material';

import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import UnfoldLessIcon from '@mui/icons-material/UnfoldLess';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';

type Props = {
  resizing: boolean;
  collapsed: boolean;
  locked: boolean;

  onDelete: () => void;
  onClone: () => void;
  onCollapse: () => void;
  onResize: () => void;
  onLock: () => void;
};

export const Toolbar: FC<Omit<NodeToolbarProps, 'position'> & Props> = memo(
  ({ resizing, collapsed, locked, onDelete, onClone, onResize, onCollapse, onLock, ...props }) => {
    return (
      <NodeToolbar position={Position.Top} {...props}>
        <ButtonGroup variant="contained" size="small">
          <Tooltip title="Delete" placement="top">
            <span>
              <Button disabled={locked} color="error" onClick={onDelete}>
                <DeleteIcon />
              </Button>
            </span>
          </Tooltip>

          <Tooltip title="Clone" placement="top">
            <Button onClick={onClone}>
              <ContentCopyIcon />
            </Button>
          </Tooltip>

          <Tooltip title={collapsed ? 'Expand' : 'Collapse'} placement="top">
            <Button color={collapsed ? 'secondary' : 'primary'} onClick={onCollapse}>
              {collapsed ? <UnfoldMoreIcon /> : <UnfoldLessIcon />}
            </Button>
          </Tooltip>

          <Tooltip title="Toogle resize" placement="top">
            <span>
              <Button disabled={locked} color={resizing ? 'secondary' : 'primary'} onClick={onResize}>
                <OpenInFullIcon />
              </Button>
            </span>
          </Tooltip>

          <Tooltip title={locked ? 'Unlock' : 'Lock'} placement="top">
            <Button color={locked ? 'secondary' : 'primary'} onClick={onLock}>
              {locked ? <LockIcon /> : <LockOpenIcon />}
            </Button>
          </Tooltip>
        </ButtonGroup>
      </NodeToolbar>
    );
  },
);
Toolbar.displayName = 'Toolbar';
