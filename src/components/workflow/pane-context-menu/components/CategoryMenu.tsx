import React, { useMemo, useRef, useState } from 'react';
import { FC } from 'react';

import pickBy from 'lodash/pickBy';

import { IconButton, ListItemButton } from '@mui/material';
import Collapse from '@mui/material/Collapse';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FolderIcon from '@mui/icons-material/Folder';

import { NodeType } from '_state/features/workflow/types';

import { Tree, TreeNode } from '../types';

type CategoryProps = {
  title: string;
  id: string;
  selectedCategory?: string;
  categories?: TreeNode<NodeType>;
  onSelect: (id: string) => void;
};

const Category: FC<CategoryProps> = ({ title, id, selectedCategory, categories, onSelect }) => {
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
          <ListItemButton selected={selectedCategory?.includes(title)}>
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
                  selectedCategory={selectedCategory}
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
  tree: Tree<NodeType>;
  selectedCategory?: string;
  onCategorySelect: (value: string) => void;
};

export const CategoryMenu: FC<Props> = ({ tree, selectedCategory, onCategorySelect }) => {
  return (
    <List>
      {(Object.entries(tree) as [string, TreeNode<NodeType>][]).map(([title, nodes]) => {
        return (
          <Category
            key={nodes.__id__ || title}
            id={nodes.__id__}
            title={title}
            selectedCategory={selectedCategory}
            categories={nodes as TreeNode<NodeType>}
            onSelect={onCategorySelect}
          />
        );
      })}
    </List>
  );
};
