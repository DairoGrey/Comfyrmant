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
  styled,
  Switch,
  Tooltip,
  Typography,
} from '@mui/material';

import FileUploadIcon from '@mui/icons-material/FileUpload';
import SaveIcon from '@mui/icons-material/Save';
import UploadFileIcon from '@mui/icons-material/UploadFile';

import * as workflowAct from '_state/features/workflow/slice';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

export const ImportFromFileButton = () => {
  const [open, setOpen] = useState(false);

  const [file, setFile] = useState<File | null>(null);
  const [buttonVariant, setButtonVariant] = useState('contained');
  const [includeSettings, setIncludeSettings] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const dispatch = useDispatch();

  const handleWorkflowImport = useCallback(() => {
    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.readAsText(file);
    reader.addEventListener('load', () => {
      const workflow = JSON.parse(reader.result as string);

      dispatch(workflowAct.importFromFile({ workflow, includeSettings }));
      setOpen(false);
    });

    reader.addEventListener('error', function () {
      console.log(reader.error);
    });
  }, [file, includeSettings]);

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      e.preventDefault();

      const file = e.target.files?.[0];

      if (file) {
        setFile(file);
      }
    },
    [setButtonVariant],
  );

  const handleDrop: React.DragEventHandler = useCallback(
    (e) => {
      e.preventDefault();
      setButtonVariant('contained');

      const file = e.dataTransfer.files[0];
      setFile(file);
    },
    [setButtonVariant],
  );

  const handleDragOver: React.DragEventHandler = useCallback((e) => {
    e.preventDefault();
  }, []);

  const handleDragEnter: React.DragEventHandler = useCallback(
    (e) => {
      e.preventDefault();
      setButtonVariant('outlined');
    },
    [setButtonVariant],
  );

  const handleDragLeave: React.DragEventHandler = useCallback(
    (e) => {
      e.preventDefault();
      setButtonVariant('contained');
    },
    [setButtonVariant],
  );

  return (
    <>
      <Tooltip
        title={<FormattedMessage id="ui.app-bar.widgets.workflow.button.import-from-file" defaultMessage="Import" />}
      >
        <IconButton ref={buttonRef} color="inherit" onClick={() => setOpen(true)} sx={{ alignSelf: 'center' }}>
          <FileUploadIcon />
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
            Import from file
          </Typography>
          {file ? (
            <>
              <List disablePadding>
                <ListItem disableGutters>
                  <ListItemText primary="Include settings" />
                  <Switch checked={includeSettings} onChange={(e, checked) => setIncludeSettings(checked)} />
                </ListItem>
              </List>
              <Button variant="contained" disabled={!file} onClick={handleWorkflowImport} startIcon={<SaveIcon />}>
                Save
              </Button>
            </>
          ) : (
            <Button
              component="label"
              role={undefined}
              variant={buttonVariant as any}
              tabIndex={-1}
              startIcon={<UploadFileIcon />}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
            >
              Upload file
              <VisuallyHiddenInput onChange={handleChange} type="file" />
            </Button>
          )}
        </Stack>
      </Popover>
    </>
  );
};
