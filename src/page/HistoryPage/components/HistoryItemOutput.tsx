import React, { useCallback } from 'react';
import { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { IconButton, Stack } from '@mui/material';

import FileDownloadIcon from '@mui/icons-material/FileDownload';

import { ImageOutputResponse } from '_state/features/api/types';
import * as blobsSel from '_state/features/blobs/selector';
import * as blobsAct from '_state/features/blobs/slice';
import type { RootState } from '_state/store';

type Props = {
  image: ImageOutputResponse;
};

export const HistoryItemOutput: FC<Props> = ({ image }) => {
  const dispatch = useDispatch();

  const getUrl = useCallback((state: RootState) => blobsSel.getBlobUrlByImage(state, image), [image]);

  const url = useSelector(getUrl);
  const isLoaded = Boolean(url);

  const handleLoad = useCallback(() => {
    dispatch(blobsAct.loadBlob(image));
  }, [image]);

  return (
    <Stack sx={{ borderRadius: 1, overflow: 'hidden' }}>
      {!isLoaded && (
        <Stack alignItems="center">
          <IconButton onClick={handleLoad}>
            <FileDownloadIcon />
          </IconButton>
        </Stack>
      )}
      {isLoaded && <img width={600} src={url} />}
    </Stack>
  );
};
