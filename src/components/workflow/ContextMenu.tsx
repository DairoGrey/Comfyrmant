import React, { useMemo, useRef, useState } from 'react';
import { FC } from 'react';
import { useReactFlow } from 'reactflow';

import get from 'lodash/get';
import has from 'lodash/has';
import pickBy from 'lodash/pickBy';
import set from 'lodash/set';
import { v4 as uuid } from 'uuid';

import { Box, Grid, IconButton, ListItemButton, Stack, TextField } from '@mui/material';
import Collapse from '@mui/material/Collapse';
import Dialog from '@mui/material/Dialog';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FolderIcon from '@mui/icons-material/Folder';
import VisibilityIcon from '@mui/icons-material/Visibility';

import * as apiHooks from '_state/features/api/slice';
import { NodeStateData, NodeType } from '_state/features/workflow/types';

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

type ItemProps = {
  node: NodeType;
  position: any;
  onClose: () => void;
};

const Item: FC<ItemProps> = ({ node, position, onClose }) => {
  const flow = useReactFlow<NodeStateData>();

  return (
    <ListItem
      onClick={() => {
        flow.addNodes({
          id: uuid(),
          data: {
            nodeType: { ...node },
            inputs: { ...node.inputs },
            outputs: { ...node.outputs },
            widgets: {},
            values: {},
          },
          type: node.type,
          position: flow.screenToFlowPosition(position),
        });

        onClose();
      }}
    >
      <ListItemButton>
        <ListItemIcon>
          <VisibilityIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>{node.title}</ListItemText>
        {/* <Typography variant="body2" color="text.secondary">
        Display
      </Typography> */}
      </ListItemButton>
    </ListItem>
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

type Props = {
  isOpen: boolean;
  position: any;
  onClose: () => void;
};

export const ContextMenu: FC<Props> = ({ isOpen, position, onClose }) => {
  const { data, isLoading } = apiHooks.useGetObjectInfoQuery();

  const [category, setCategory] = useState<string | null>(null);

  const [tree, flat] = useMemo(() => {
    if (!data) {
      return [{}, []] as [Tree<NodeType>, NodeType[]];
    }

    const allNodes = Object.values(data);

    allNodes.push(...builtinNodes);

    const nodes = allNodes.sort((a, b) => a.category.toLocaleLowerCase().localeCompare(b.category.toLocaleLowerCase()));

    const tree: Tree<NodeType> = nodes.reduce((result, node) => {
      const path = node.category.replaceAll('/', '.');

      if (!has(result, path)) {
        set(result, path, { __root__: [], __id__: node.category });
      }

      get(result, path).__root__.push(node);

      return result;
    }, {} as Tree<NodeType>);

    return [tree, nodes] as [Tree<NodeType>, NodeType[]];
  }, [data]);

  if (isLoading) {
    return null;
  }

  const nodes = category ? get(tree, category.replaceAll('/', '.'))?.['__root__'] || [] : flat;

  return (
    <Dialog open={isOpen} onClose={onClose} autoFocus={false} maxWidth={false}>
      <Grid container flexShrink={0} height={640} width={940}>
        <Grid item xs={4} flexShrink={0} height="100%" overflow="hidden">
          <Box sx={{ overflowY: 'auto', height: '100%' }}>
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
        <Grid item xs={8} flexShrink={0} height="100%" overflow="hidden">
          <Stack gap={1} overflow="hidden" sx={{ height: '100%' }}>
            <Box p={1}>
              <TextField label="Search" fullWidth />
            </Box>
            <Box sx={{ overflowY: 'auto', height: '100%' }}>
              <List>
                {nodes.map((node: NodeType) => (
                  <Item key={node.type} node={node} position={position} onClose={onClose} />
                ))}
              </List>
            </Box>
          </Stack>
        </Grid>
      </Grid>
    </Dialog>
  );
};
