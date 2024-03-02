import React from 'react';
import { FC } from 'react';

import { Alert, Box, Stack } from '@mui/material';

import { NodeType } from '_state/features/workflow/types';

import { NodeView } from '../../node';
import { NodeOption } from '../types';

import { NodeSearchField } from './SearchField';

type Props = {
  searchValue: string;
  nodeOptions: NodeOption[];
  nodeTypes: NodeType[];

  onSearchChange: (value: string) => void;
  onNodeClick: (e: React.MouseEvent, type: string) => void;
  onNodeDragStart: (e: React.DragEvent, type: string) => void;
};

export const NodeBrowser: FC<Props> = ({
  searchValue,
  nodeOptions,
  nodeTypes,
  onSearchChange,
  onNodeClick,
  onNodeDragStart,
}) => {
  return (
    <>
      <Stack p={1} gap={0.5}>
        <NodeSearchField value={searchValue} options={nodeOptions} onChange={onSearchChange} />
        <Alert variant="outlined" severity="info">
          Click on node or drag it on the workflow
        </Alert>
      </Stack>
      <Stack direction="row" p={1} gap={2} flexWrap="wrap" height="100%" sx={{ overflowY: 'auto' }}>
        {nodeTypes.map((nodeType: NodeType) => (
          <Box key={nodeType.type}>
            <NodeView nodeType={nodeType} onClick={onNodeClick} onDragStart={onNodeDragStart} />
          </Box>
        ))}
      </Stack>
    </>
  );
};
