import React, { FC } from 'react';

import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';

import { Autocomplete, createFilterOptions, ListItemButton, TextField, Typography } from '@mui/material';
import ListItem from '@mui/material/ListItem';

import { NodeOption } from '../types';

const filterOptions = createFilterOptions<NodeOption>({
  matchFrom: 'start',
  limit: 6,
  trim: true,
});

type Props = {
  value: string;
  options: NodeOption[];
  onChange: (value: string) => void;
};

export const NodeSearchField: FC<Props> = ({ value, options, onChange }) => {
  return (
    <Autocomplete
      freeSolo
      size="small"
      filterOptions={filterOptions}
      options={options}
      groupBy={(option) => option.category}
      componentsProps={{
        popper: {
          placement: 'top-start',
        },
      }}
      renderInput={(params) => (
        <TextField {...params} label="Search" fullWidth value={value} onChange={(e) => onChange(e.target.value)} />
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
  );
};
