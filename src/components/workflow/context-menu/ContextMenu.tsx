import React, { memo, useCallback, useMemo, useState } from 'react';
import { FC } from 'react';
import { useReactFlow } from 'reactflow';

import get from 'lodash/get';
import * as uuid from 'uuid';

import { Box, ClickAwayListener, Drawer, Grid, Stack } from '@mui/material';

import * as apiHooks from '_state/features/api/slice';
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

  const { data, isLoading } = apiHooks.useGetObjectInfoQuery();

  const [category, setCategory] = useState<string | null>(null);
  const [seacrh, setSearch] = useState<string>('');

  const [tree, flat, types] = useNodeCategoryTree(data);

  const nodeTypes = useMemo(() => {
    const list = category ? get(tree, category.replaceAll('/', '.'))?.['__root__'] || [] : flat;
    const selected = seacrh ? list.filter((nodeType) => nodeType.title.includes(seacrh)) : list;

    return selected;
  }, [category, seacrh]);

  if (isLoading) {
    return null;
  }

  const handleItemClick = useCallback(
    (e: React.MouseEvent, type: string) => {
      const nodeType = data?.[type];

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
    [data, flow, position],
  );

  const handleDragStart = useCallback((e: React.DragEvent, type: string) => {
    e.dataTransfer.setData('application/node', type);
    e.dataTransfer.effectAllowed = 'move';
  }, []);

  return (
    <ClickAwayListener onClickAway={onClose}>
      <Drawer anchor="bottom" variant="persistent" open={isOpen} onClose={onClose} autoFocus={false}>
        <Grid container columns={24} flexShrink={0} height={420}>
          <Grid item xs={5} flexShrink={0} height="100%" overflow="hidden">
            <Box height="100%" sx={{ overflowY: 'auto' }}>
              <CategoryMenu tree={tree} onCategorySelect={setCategory} />
            </Box>
          </Grid>
          <Grid item xs={19} flexShrink={0} height="100%" overflow="hidden">
            <Stack gap={1} overflow="hidden" height="100%">
              <NodeBrowser
                searchValue={seacrh}
                nodeOptions={types}
                nodeTypes={nodeTypes}
                onSearchChange={setSearch}
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
