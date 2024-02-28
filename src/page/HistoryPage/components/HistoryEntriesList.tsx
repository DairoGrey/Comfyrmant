import React, { FC } from 'react';

import { Avatar, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, useTheme } from '@mui/material';

import { HistoryItemResponse } from '_state/features/api/types';

type Props = {
  entries: HistoryItemResponse[];
  selected?: string;
  onSelect: (id: string) => void;
};

export const HistoryEntriesList: FC<Props> = ({ entries, selected, onSelect }) => {
  const theme = useTheme();

  return (
    <List>
      {entries.map((entry) => (
        <ListItem
          key={entry.prompt[1]}
          onClick={() => {
            onSelect(entry.prompt[1]);
          }}
        >
          <ListItemButton selected={selected === entry.prompt[1]}>
            <ListItemAvatar>
              <Avatar
                sx={{
                  bgcolor:
                    entry.status.status_str === 'success' ? theme.palette.success.main : theme.palette.error.main,
                }}
              >
                {entry.prompt[0]}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={entry.prompt[1]}
              primaryTypographyProps={{ noWrap: true }}
              secondary={entry.status.status_str}
            />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
};
