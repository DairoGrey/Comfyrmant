import React, { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch } from 'react-redux';

import { IconButton, Tooltip } from '@mui/material';

import FileUploadIcon from '@mui/icons-material/FileUpload';

import * as workflowAct from '_state/features/workflow/slice';

export const ImportFromFileButton = () => {
  const dispatch = useDispatch();

  const handleWorkflowImport = useCallback(() => {
    dispatch(workflowAct.importFromFile());
  }, []);

  return (
    <Tooltip
      title={<FormattedMessage id="ui.app-bar.widgets.workflow.button.import-from-file" defaultMessage="Import" />}
    >
      <IconButton color="inherit" onClick={handleWorkflowImport} sx={{ alignSelf: 'center' }}>
        <FileUploadIcon />
      </IconButton>
    </Tooltip>
  );
};
