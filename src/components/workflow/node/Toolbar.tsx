import React, { FC, useCallback } from 'react';
import { NodeToolbar, NodeToolbarProps, Position, useNodeId, useReactFlow } from 'reactflow';

import { Button, ButtonGroup, Tooltip } from '@mui/material';

import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandIcon from '@mui/icons-material/Expand';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';

export const Toolbar: FC<Omit<NodeToolbarProps, 'position'> & { resizing: boolean; onResize: () => void }> = ({
  resizing,
  onResize,
  ...props
}) => {
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

        <Tooltip title="Collapse" placement="top">
          <Button>
            <ExpandIcon />
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
};
