import React, { memo, useCallback, useMemo, useRef, useState } from 'react';
import { FC } from 'react';
import { useReactFlow } from 'reactflow';

import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import get from 'lodash/get';
import has from 'lodash/has';
import pickBy from 'lodash/pickBy';
import set from 'lodash/set';
import * as uuid from 'uuid';

import {
  Autocomplete,
  Box,
  ClickAwayListener,
  createFilterOptions,
  Drawer,
  Grid,
  IconButton,
  ListItemButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import Collapse from '@mui/material/Collapse';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FolderIcon from '@mui/icons-material/Folder';

import * as apiHooks from '_state/features/api/slice';
import { NodeStateData, NodeType } from '_state/features/workflow/types';

import { NodeView } from './node';
import { builtinNodes } from './nodes';

type TreeNode<T> = {
  // @ts-expect-error Complex typing
  __id__: string;
  // @ts-expect-error Complex typing
  __root__: T[];
  [k: string]: TreeNode<T>;
};

type Tree<T> = {
  [k: string]: TreeNode<T>;
};

type NodeItemProps = {
  nodeType: NodeType;
  position: any;
  onClose: () => void;
};

const NodeItem: FC<NodeItemProps> = ({ nodeType, position, onClose }) => {
  const flow = useReactFlow<NodeStateData>();

  const handleItemClick = useCallback(() => {
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
  }, [nodeType, flow, position]);

  const handleDragStart = useCallback(
    (e: React.DragEvent) => {
      e.dataTransfer.setData('application/node', nodeType.type);
      e.dataTransfer.effectAllowed = 'move';
    },
    [nodeType],
  );

  return (
    <Box p={2}>
      <NodeView nodeType={nodeType} onClick={handleItemClick} onDragStart={handleDragStart} />
    </Box>
  );
};

type CategoryProps = {
  title: string;
  id: string;
  categories?: TreeNode<NodeType>;
  onSelect: (id: string) => void;
};

const Category: FC<CategoryProps> = ({ title, id, categories, onSelect }) => {
  const anchorElRef = useRef<HTMLLIElement>(null);

  const [isOpen, setOpen] = useState(false);

  const children = useMemo(() => {
    return pickBy(categories || {}, (v, k) => !['__id__', '__root__'].includes(k));
  }, [categories]);

  const [childrenCount, nodesCount] = useMemo(() => {
    const childernCount = Object.keys(children).length;
    const nodesCount = categories?.__root__?.length || 0;

    return [childernCount, nodesCount] as const;
  }, [children]);

  return (
    <>
      <List disablePadding>
        <ListItem
          ref={anchorElRef}
          onClick={() => id && onSelect(id)}
          secondaryAction={
            childrenCount === 0 ? undefined : (
              <IconButton edge="end" onClick={() => setOpen((v) => !v)}>
                {isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            )
          }
          disablePadding
        >
          <ListItemButton>
            <ListItemIcon>
              <FolderIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={title} secondary={`nodes: ${nodesCount} | categories: ${childrenCount}`} />
          </ListItemButton>
        </ListItem>
      </List>
      {childrenCount !== 0 && (
        <Collapse timeout="auto" unmountOnExit in={isOpen}>
          <List sx={{ pl: 2 }}>
            {(Object.entries(children) as [string, TreeNode<NodeType>][]).map(([title, nodes]) => {
              return (
                <Category
                  key={nodes.__id__ || title}
                  id={nodes.__id__}
                  title={title}
                  categories={nodes as TreeNode<NodeType>}
                  onSelect={onSelect}
                />
              );
            })}
          </List>
        </Collapse>
      )}
    </>
  );
};

type Option = { label: string; type: string; category: string };

const filterOptions = createFilterOptions<Option>({
  matchFrom: 'start',
  limit: 6,
  trim: true,
});

type Props = {
  isOpen: boolean;
  position: any;
  onClose: () => void;
};

export const ContextMenu: FC<Props> = memo(({ isOpen, position, onClose }) => {
  const { data, isLoading } = apiHooks.useGetObjectInfoQuery();

  const [category, setCategory] = useState<string | null>(null);
  const [seacrh, setSearch] = useState<string>('');

  const [tree, flat, types] = useMemo((): [Tree<NodeType>, NodeType[], Option[]] => {
    if (!data) {
      return [{}, [], []];
    }

    const allNodes = Object.values(data);

    allNodes.push(...builtinNodes);

    const nodes = allNodes.sort((a, b) => a.category.toLocaleLowerCase().localeCompare(b.category.toLocaleLowerCase()));

    const types = allNodes.map((node) => ({ label: node.title, category: node.category, type: node.type }));

    const tree: Tree<NodeType> = nodes.reduce((result, node) => {
      const path = node.category.replaceAll('/', '.');

      if (!has(result, path)) {
        set(result, path, { __root__: [], __id__: node.category });
      }

      get(result, path).__root__.push(node);

      return result;
    }, {} as Tree<NodeType>);

    return [tree, nodes, types] as const;
  }, [data]);

  if (isLoading) {
    return null;
  }

  const nodeTypes = useMemo(() => {
    const list = category ? get(tree, category.replaceAll('/', '.'))?.['__root__'] || [] : flat;
    const selected = seacrh ? list.filter((nodeType) => nodeType.title.includes(seacrh)) : list;

    return selected;
  }, [category, seacrh]);

  return (
    <ClickAwayListener onClickAway={onClose}>
      <Drawer anchor="bottom" variant="persistent" open={isOpen} onClose={onClose} autoFocus={false}>
        <Grid container columns={24} flexShrink={0} height={420}>
          <Grid item xs={5} flexShrink={0} height="100%" overflow="hidden">
            <Box height="100%" sx={{ overflowY: 'auto' }}>
              <List>
                {(Object.entries(tree) as [string, TreeNode<NodeType>][]).map(([title, nodes]) => {
                  return (
                    <Category
                      key={nodes.__id__ || title}
                      id={nodes.__id__}
                      title={title}
                      categories={nodes as TreeNode<NodeType>}
                      onSelect={setCategory}
                    />
                  );
                })}
              </List>
            </Box>
          </Grid>
          <Grid item xs={19} flexShrink={0} height="100%" overflow="hidden">
            <Stack gap={1} overflow="hidden" height="100%">
              <Box p={1}>
                <Autocomplete
                  freeSolo
                  size="small"
                  filterOptions={filterOptions}
                  options={types}
                  groupBy={(option) => option.category}
                  componentsProps={{
                    popper: {
                      placement: 'top-start',
                    },
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Search"
                      fullWidth
                      value={seacrh}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  )}
                  renderOption={(props, option, { inputValue }) => {
                    const matches = match(option.label, inputValue, { insideWords: true });
                    const parts = parse(option.label, matches);

                    return (
                      <ListItem {...props}>
                        <ListItemButton>
                          {parts.map((part, index) => (
                            <Typography key={index} component="span" fontWeight={part.highlight ? 'bold' : 'normal'}>
                              {part.text}
                            </Typography>
                          ))}
                        </ListItemButton>
                      </ListItem>
                    );
                  }}
                />
              </Box>
              <Box display="flex" flexWrap="wrap" height="100%" sx={{ overflowY: 'auto' }}>
                {nodeTypes.map((nodeType: NodeType) => (
                  <NodeItem key={nodeType.type} nodeType={nodeType} position={position} onClose={onClose} />
                ))}
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Drawer>
    </ClickAwayListener>
  );
});
