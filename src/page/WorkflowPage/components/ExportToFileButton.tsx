import React, { useCallback, useRef, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch } from 'react-redux';

import {
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  Popover,
  Stack,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';

import FileDownloadIcon from '@mui/icons-material/FileDownload';
import SaveIcon from '@mui/icons-material/Save';

import * as workflowAct from '_state/features/workflow/slice';

export const ExportToFileButton = () => {
  const [open, setOpen] = useState(false);

  const [fileName, setFileName] = useState('workflow');
  const [includeSettings, setIncludeSettings] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const dispatch = useDispatch();

  const handleWorkflowExport = useCallback(() => {
    dispatch(workflowAct.exportToFile({ fileName, includeSettings }));
    setOpen(false);
  }, [fileName, includeSettings, setOpen]);

  return (
    <>
      <Tooltip
        title={<FormattedMessage id="ui.app-bar.widgets.workflow.button.export-to-file" defaultMessage="Export" />}
      >
        <IconButton ref={buttonRef} color="inherit" onClick={() => setOpen(true)} sx={{ alignSelf: 'center' }}>
          <FileDownloadIcon />
        </IconButton>
      </Tooltip>
      <Popover
        open={open}
        anchorEl={buttonRef.current}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        onClose={() => setOpen(false)}
      >
        <Stack component={Paper} pt={1} px={2} pb={2} gap={1}>
          <Typography component="p" variant="h6">
            Export to file
          </Typography>
          <List disablePadding>
            <ListItem disableGutters>
              <TextField
                label="Name"
                placeholder="Name"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
              />
            </ListItem>
            <ListItem disableGutters>
              <ListItemText primary="Include settings" />
              <Switch checked={includeSettings} onChange={(e, checked) => setIncludeSettings(checked)} />
            </ListItem>
          </List>
          <Button variant="contained" disabled={!fileName} onClick={handleWorkflowExport} startIcon={<SaveIcon />}>
            Save
          </Button>
        </Stack>
      </Popover>
    </>
  );
};
