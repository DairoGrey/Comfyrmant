import React, { FC } from 'react';

import { Avatar, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, useTheme } from '@mui/material';

import { HistoryEntry } from '_state/features/history/types';

type Props = {
  entries: HistoryEntry[];
  selected?: string;
  onSelect: (id: string) => void;
};

export const HistoryEntriesList: FC<Props> = ({ entries, selected, onSelect }) => {
  const theme = useTheme();

  return (
    <List>
      {entries.map((entry) => (
        <ListItem
          key={entry.info.id}
          onClick={() => {
            onSelect(entry.info.id);
          }}
        >
          <ListItemButton selected={selected === entry.info.id}>
            <ListItemAvatar>
              <Avatar
                sx={{
                  bgcolor:
                    entry.status.status_str === 'success' ? theme.palette.success.main : theme.palette.error.main,
                }}
              >
                {entry.info.number}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={entry.info.id}
              primaryTypographyProps={{ noWrap: true }}
              secondary={entry.status.status_str}
            />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
};
