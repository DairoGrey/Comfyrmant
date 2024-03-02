import React from 'react';
import { FC } from 'react';

import { ListItemIcon, ListItemText, MenuItem } from '@mui/material';

type Props = {
  icon: React.ReactNode;
  label: React.ReactNode;
  color?: string;

  onClick: () => void;
};

export const Item: FC<Props> = ({ icon, label, color, onClick }) => {
  return (
    <MenuItem onClick={onClick} disableRipple>
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText primary={label} primaryTypographyProps={{ color }} />
    </MenuItem>
  );
};
