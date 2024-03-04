import React, { memo, useCallback, useMemo, useState } from 'react';
import { FC } from 'react';
import { useSelector } from 'react-redux';
import { useReactFlow } from 'reactflow';

import get from 'lodash/get';
import * as uuid from 'uuid';

import { Box, ClickAwayListener, Drawer, Grid, Stack } from '@mui/material';

import * as apiSel from '_state/features/api/selector';
import { NodeStateData } from '_state/features/workflow/types';

import { CategoryMenu } from './components/CategoryMenu';
import { NodeBrowser } from './components/NodeBrowser';
import { useNodeCategoryTree } from './hooks/useNodeCategoryTree';

type Props = {
  isOpen: boolean;
  position: any;
  onClose: () => void;
};

export const ContextMenu: FC<Props> = memo(({ isOpen, position, onClose }) => {
  const flow = useReactFlow<NodeStateData>();

  const nodes = useSelector(apiSel.getObjectsInfoData);

  const [category, setCategory] = useState<string | undefined>();
  const [search, setSearch] = useState<string>('');

  const [tree, flat, types] = useNodeCategoryTree(nodes);

  const nodeTypes = useMemo(() => {
    const list = category ? get(tree, category.replaceAll('/', '.'))?.['__root__'] || [] : flat;
    const selected = search ? list.filter((nodeType) => nodeType.title.includes(search)) : list;

    return selected;
  }, [category, search]);

  const handleItemClick = useCallback(
    (e: React.MouseEvent, type: string) => {
      const nodeType = nodes?.[type];

      if (!nodeType) {
        return;
      }

      flow.addNodes({
        id: uuid.v4(),
        data: {
          nodeType: { ...nodeType },
          inputs: { ...nodeType.inputs },
          outputs: { ...nodeType.outputs },
          widgets: {},
          values: {},
        },
        type: nodeType.type,
        position: flow.screenToFlowPosition(position),
      });

      onClose();
    },
    [nodes, flow, position],
  );

  const handleDragStart = useCallback((e: React.DragEvent, type: string) => {
    e.dataTransfer.setData('application/node', type);
    e.dataTransfer.effectAllowed = 'move';
  }, []);

  const handleSearch = useCallback(
    (value: string) => {
      setSearch(value);

      if (category) {
        setCategory(undefined);
      }
    },
    [search, setCategory, setSearch],
  );

  const handleCategorySelect = useCallback(
    (value?: string) => {
      setCategory(value);

      if (category) {
        setSearch('');
      }
    },
    [search, setCategory, setSearch],
  );

  if (!nodes) {
    return null;
  }

  return (
    <ClickAwayListener onClickAway={onClose}>
      <Drawer anchor="bottom" variant="persistent" open={isOpen} onClose={onClose} autoFocus={false}>
        <Grid container columns={24} flexShrink={0} height={420}>
          <Grid item xs={5} flexShrink={0} height="100%" overflow="hidden">
            <Box height="100%" sx={{ overflowY: 'auto' }}>
              <CategoryMenu tree={tree} selectedCategory={category} onCategorySelect={handleCategorySelect} />
            </Box>
          </Grid>
          <Grid item xs={19} flexShrink={0} height="100%" overflow="hidden">
            <Stack gap={1} overflow="hidden" height="100%">
              <NodeBrowser
                searchValue={search}
                nodeOptions={types}
                nodeTypes={nodeTypes}
                limit={category ? -1 : 10}
                onSearchChange={handleSearch}
                onNodeClick={handleItemClick}
                onNodeDragStart={handleDragStart}
              />
            </Stack>
          </Grid>
        </Grid>
      </Drawer>
    </ClickAwayListener>
  );
});
