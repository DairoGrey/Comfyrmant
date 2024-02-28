import { createSelector } from '@reduxjs/toolkit';

import { RootState } from '_state/store';

import slice from './slice';

const getSettings = (state: RootState) => state[slice.name];

export const getColorMode = createSelector(getSettings, (settings) => settings.colorMode);
export const getLocale = createSelector(getSettings, (settings) => settings.locale);
export const getLocation = createSelector(getSettings, (settings) => settings.location);
export const getCodeTheme = createSelector(getSettings, (settings) => settings.codeTheme);

export const getWorkflowEdgeType = createSelector(getSettings, (settings) => settings.workflow.edgeType);
export const getWorkflowHandleType = createSelector(getSettings, (settings) => settings.workflow.handleType);
export const getWorkflowBackground = createSelector(getSettings, (settings) => settings.workflow.background);
export const getWorkflowSnapToGrid = createSelector(getSettings, (settings) => settings.workflow.snapToGrid);
export const getWorkflowSnapGrid = createSelector(getSettings, (settings) => settings.workflow.snapGrid);
