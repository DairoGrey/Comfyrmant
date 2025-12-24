import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FC } from 'react';
import { useDispatch } from 'react-redux';

import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Button,
  Pagination,
  Stack,
} from '@mui/material';

import ExpandMoreIcon from '@mui/icons-material/ExpandMoreRounded';

import { ImageOutputResponse } from '_state/features/api/types';
import * as blobsAct from '_state/features/blobs/slice';

import { HistoryItemOutput } from './HistoryItemOutput';

type Props = {
  outputs: Record<string, { images: ImageOutputResponse[] }>;
};

export const HistoryItemOutputs: FC<Props> = ({ outputs }) => {
  const dispatch = useDispatch();

  const [page, setPage] = useState(0);

  const keys = useMemo(() => Object.keys(outputs), [outputs]);

  const handleLoadAll = useCallback(() => {
    Object.values(outputs).forEach((output) => {
      output.images.forEach((image) => {
        dispatch(blobsAct.loadBlob(image));
      });
    });
  }, [outputs]);

  if (keys.length === 0) {
    return null;
  }

  const images = outputs[keys[Math.min(page, keys.length - 1)]].images;

  useEffect(() => {
    if (page > keys.length - 1) {
      setPage(keys.length - 1);
    }
  }, [page, keys, setPage]);

  return (
    <Accordion component={Stack}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>Images</AccordionSummary>
      <AccordionDetails>
        <Stack gap={2} alignItems="center">
          <HistoryItemOutput image={images[0]} />
          <Pagination size="small" count={keys.length} onChange={(e, page) => setPage(page - 1)} />
        </Stack>
      </AccordionDetails>
      <AccordionActions>
        <Button onClick={handleLoadAll}>Load all images</Button>
      </AccordionActions>
    </Accordion>
  );
};
