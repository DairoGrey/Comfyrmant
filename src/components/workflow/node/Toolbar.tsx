import React, { FC, memo, useCallback } from 'react';
import { NodeToolbar, NodeToolbarProps, Position, useNodeId, useReactFlow } from 'reactflow';

import { Button, ButtonGroup, Tooltip } from '@mui/material';

import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import UnfoldLessIcon from '@mui/icons-material/UnfoldLess';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';

type Props = {
  resizing: boolean;
  collapsed: boolean;
  onResize: () => void;
  onCollapse: () => void;
};

export const Toolbar: FC<Omit<NodeToolbarProps, 'position'> & Props> = memo(
  ({ resizing, collapsed, onResize, onCollapse, ...props }) => {
    const flow = useReactFlow();

    const id = useNodeId();

    const handleDelete = useCallback(() => {
      if (!id) {
        return;
      }

      flow.deleteElements({ nodes: [{ id: id }] });
    }, [id, flow]);

    return (
      <NodeToolbar position={Position.Top} {...props}>
        <ButtonGroup variant="contained" size="small">
          <Tooltip title="Delete" placement="top">
            <Button color="error" onClick={handleDelete}>
              <DeleteIcon />
            </Button>
          </Tooltip>

          <Tooltip title="Duplicate" placement="top">
            <Button>
              <ContentCopyIcon />
            </Button>
          </Tooltip>

          <Tooltip title={collapsed ? 'Expand' : 'Collapse'} placement="top">
            <Button color={collapsed ? 'secondary' : 'primary'} onClick={onCollapse}>
              {collapsed ? <UnfoldMoreIcon /> : <UnfoldLessIcon />}
            </Button>
          </Tooltip>

          <Tooltip title="Toogle resize" placement="top">
            <Button color={resizing ? 'secondary' : 'primary'} onClick={onResize}>
              <OpenInFullIcon />
            </Button>
          </Tooltip>
        </ButtonGroup>
      </NodeToolbar>
    );
  },
);
