import React, { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch } from 'react-redux';

import { IconButton, Tooltip } from '@mui/material';

import FileDownloadIcon from '@mui/icons-material/FileDownload';

import * as workflowAct from '_state/features/workflow/slice';

export const ExportToFileButton = () => {
  const dispatch = useDispatch();

  const handleWorkflowExport = useCallback(() => {
    dispatch(workflowAct.exportToFile());
  }, []);

  return (
    <Tooltip
      title={<FormattedMessage id="ui.app-bar.widgets.workflow.button.export-to-file" defaultMessage="Export" />}
    >
      <IconButton color="inherit" onClick={handleWorkflowExport} sx={{ alignSelf: 'center' }}>
        <FileDownloadIcon />
      </IconButton>
    </Tooltip>
  );
};
