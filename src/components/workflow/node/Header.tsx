import { FC, useCallback, useRef, useState } from 'react';
import React from 'react';

import { IconButton, Stack, Typography } from '@mui/material';

import MoreVertIcon from '@mui/icons-material/MoreVert';

import { NodeInputState, NodeWidgetState } from '_state/features/workflow/types';

import { NodeContextMenu } from './ContextMenu';
import { ProgressBar } from './ProgressBar';

type Props = {
  id: string;
  title: string;

  inputs: Record<string, NodeInputState>;
  widgets?: Record<string, NodeWidgetState>;
};

export const Header: FC<Props> = ({ id, title, inputs, widgets }) => {
  const [open, setOpen] = useState(false);
  const anchorElRef = useRef<HTMLButtonElement>(null);

  const handleShow = useCallback(() => {
    setOpen(true);
  }, [setOpen]);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  return (
    <>
      <Stack position="relative">
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          px={2}
          py={1}
          overflow="hidden"
          flexShrink={0}
        >
          <Stack>
            <Typography component="span" color="text.secondary" variant="caption" fontSize="8px" whiteSpace="nowrap">
              {id}
            </Typography>
            <Typography component="h6" color="text.primary" variant="subtitle2" whiteSpace="nowrap">
              {title}
            </Typography>
          </Stack>
          <IconButton ref={anchorElRef} edge="end" onClick={handleShow}>
            <MoreVertIcon />
          </IconButton>
        </Stack>
        <ProgressBar id={id} />
      </Stack>
      <NodeContextMenu
        open={open}
        anchorEl={anchorElRef.current}
        id={id}
        inputs={inputs}
        widgets={widgets}
        onClose={handleClose}
      />
    </>
  );
};
