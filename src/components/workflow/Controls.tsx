import { FC, memo, useCallback } from 'react';
import React from 'react';
import { Panel, ReactFlowState, useReactFlow, useStore, useStoreApi } from 'reactflow';

import { shallow } from 'zustand/shallow';

import { Divider, IconButton, Paper, Stack, SvgIcon, Tooltip } from '@mui/material';

import AddIcon from '@mui/icons-material/Add';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import RemoveIcon from '@mui/icons-material/Remove';
import TimesOneMobiledataIcon from '@mui/icons-material/TimesOneMobiledata';
import ZoomInMapIcon from '@mui/icons-material/ZoomInMap';
import ZoomOutMapIcon from '@mui/icons-material/ZoomOutMap';

const selector = (s: ReactFlowState) => ({
  isInteractive: s.nodesDraggable || s.nodesConnectable || s.elementsSelectable,
  canZoomIn: s.transform[2] < s.maxZoom,
  canZoomOut: s.transform[2] > s.minZoom,
  maxZoom: s.maxZoom,
  minZoom: s.minZoom,
  zoom: s.transform[2],
});

export const Controls: FC = memo(() => {
  const store = useStoreApi();
  const { isInteractive, canZoomIn, canZoomOut, maxZoom, minZoom, zoom } = useStore(selector, shallow);
  const flow = useReactFlow();

  const handleZoomIn = useCallback(() => {
    flow.zoomIn();
  }, [flow]);

  const handleZoomMax = useCallback(() => {
    flow.zoomTo(maxZoom);
  }, [flow, maxZoom]);

  const handleZoomOut = useCallback(() => {
    flow.zoomOut();
  }, [flow]);

  const handleZoomMin = useCallback(() => {
    flow.zoomTo(minZoom);
  }, [flow, minZoom]);

  const handleResetZoom = useCallback(() => {
    flow.zoomTo(1);
  }, [flow]);

  const handleFitView = useCallback(() => {
    flow.fitView();
  }, [flow]);

  const handleLock = useCallback(() => {
    store.setState({
      nodesDraggable: !isInteractive,
      nodesConnectable: !isInteractive,
      elementsSelectable: !isInteractive,
    });
  }, [isInteractive, store]);

  return (
    <Panel position="bottom-left">
      <Stack component={Paper} variant="outlined" sx={{ '& .MuiIconButton-root': { borderRadius: 0 } }} direction="row">
        <Stack>
          <IconButton disabled>
            <SvgIcon>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                focusable={false}
                aria-hidden={true}
                fill="currentColor"
                viewBox="0 0 24 24"
                stroke="none"
              >
                <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" fontSize="0.75rem">
                  {zoom.toFixed(2)}
                </text>
              </svg>
            </SvgIcon>
          </IconButton>
          <Divider />
          <Tooltip title="Zoom max" placement="right">
            <span>
              <IconButton disabled={!canZoomIn} onClick={handleZoomMax}>
                <ZoomInMapIcon />
              </IconButton>
            </span>
          </Tooltip>
          <Divider />
          <Tooltip title="Zoom min" placement="right">
            <span>
              <IconButton disabled={!canZoomOut} onClick={handleZoomMin}>
                <ZoomOutMapIcon />
              </IconButton>
            </span>
          </Tooltip>
          <Divider />
          <Tooltip title="Fit to view" placement="right">
            <IconButton onClick={handleFitView}>
              <FullscreenIcon />
            </IconButton>
          </Tooltip>
        </Stack>
        <Divider flexItem orientation="vertical" />
        <Stack>
          <Tooltip title="Reset zoom" placement="right">
            <span>
              <IconButton onClick={handleResetZoom}>
                <TimesOneMobiledataIcon />
              </IconButton>
            </span>
          </Tooltip>
          <Divider />
          <Tooltip title="Zoom in" placement="right">
            <span>
              <IconButton disabled={!canZoomIn} onClick={handleZoomIn}>
                <AddIcon />
              </IconButton>
            </span>
          </Tooltip>
          <Divider />
          <Tooltip title="Zoom out" placement="right">
            <span>
              <IconButton disabled={!canZoomOut} onClick={handleZoomOut}>
                <RemoveIcon />
              </IconButton>
            </span>
          </Tooltip>
          <Divider />
          <Tooltip title={isInteractive ? 'Lock' : 'Unlock'} placement="right">
            <IconButton color={isInteractive ? 'default' : 'secondary'} onClick={handleLock}>
              {isInteractive ? <LockOpenIcon /> : <LockIcon />}
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>
    </Panel>
  );
});
Controls.displayName = 'Controls';
