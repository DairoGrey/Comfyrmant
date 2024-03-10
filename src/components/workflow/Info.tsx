import React, { FC, useCallback, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Panel } from 'reactflow';

import { IconButton, InputAdornment, Paper, Stack, TextField, Typography } from '@mui/material';

import DoneIcon from '@mui/icons-material/Done';
import EditIcon from '@mui/icons-material/Edit';

import * as workflowSel from '_state/features/workflow/selector';
import * as workflowAct from '_state/features/workflow/slice';

export const Info: FC = () => {
  const dispatch = useDispatch();

  const id = useSelector(workflowSel.getId);
  const title = useSelector(workflowSel.getTitle);

  const [editMode, setEditMode] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  const textFieldRef = useRef<HTMLInputElement>(null);

  const handleUpdate = useCallback(() => {
    dispatch(workflowAct.updateTitle(newTitle));
    setNewTitle('');
    setEditMode(false);
  }, [newTitle, setNewTitle, setEditMode]);

  return (
    <Panel position="top-left">
      <Stack component={Paper} variant="outlined" p={1}>
        <Typography variant="caption" color="text.secondary">
          {id}
        </Typography>
        {!editMode && (
          <Stack direction="row" gap={1}>
            <Typography variant="h4" color={title ? 'text.primary' : 'text.secondary'}>
              {title || 'Untitled'}
            </Typography>
            <IconButton
              onClick={() => {
                setEditMode(true);
              }}
            >
              <EditIcon />
            </IconButton>
          </Stack>
        )}
        {editMode && (
          <TextField
            ref={textFieldRef}
            variant="standard"
            value={newTitle || title || 'Untitled'}
            onChange={(e) => setNewTitle(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleUpdate}>
                    <DoneIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        )}
      </Stack>
    </Panel>
  );
};
