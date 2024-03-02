import { FC, memo, useCallback, useRef, useState } from 'react';
import React from 'react';

import { IconButton, Stack, Typography } from '@mui/material';

import MoreVertIcon from '@mui/icons-material/MoreVert';

import { NodeInputState, NodeWidgetState } from '_state/features/workflow/types';

import { ContextMenu } from './context-menu';
import { ProgressBar } from './ProgressBar';

type Props = {
  id: string;
  title: string;

  inputs: Record<string, NodeInputState>;
  widgets?: Record<string, NodeWidgetState>;

  children?: React.ReactNode;
};

export const Header: FC<Props> = memo(({ id, title, inputs, widgets, children }) => {
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
            {children}
          </Stack>
          <IconButton className="nodrag" ref={anchorElRef} edge="end" onClick={handleShow}>
            <MoreVertIcon />
          </IconButton>
        </Stack>
        <ProgressBar id={id} />
      </Stack>
      <ContextMenu
        open={open}
        anchorEl={anchorElRef.current}
        id={id}
        inputs={inputs}
        widgets={widgets}
        onClose={handleClose}
      />
    </>
  );
});
