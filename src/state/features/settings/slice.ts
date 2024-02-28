import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ROUTES } from '_routes';
import { ColorMode } from '_theme';

import { CodeTheme, WorkflowBackground, WorkflowEdgeType, WorkflowHandleType } from './types';

type SettingsState = {
  colorMode?: ColorMode;
  locale: string;
  location: string;
  codeTheme: CodeTheme;
  workflow: {
    edgeType: WorkflowEdgeType;
    handleType: WorkflowHandleType;
    background: WorkflowBackground;
    snapToGrid: boolean;
    snapGrid: number;
  };
};

const initialState: SettingsState = {
  locale: navigator.language,
  location: ROUTES.workflow,
  codeTheme: CodeTheme.Nnfx,
  workflow: {
    edgeType: WorkflowEdgeType.Curve,
    handleType: WorkflowHandleType.Circle,
    background: WorkflowBackground.Dots,
    snapToGrid: true,
    snapGrid: 25,
  },
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    changeColorMode(state, action: PayloadAction<ColorMode>) {
      state.colorMode = action.payload;
    },
    changeLocale(state, action: PayloadAction<string>) {
      state.locale = action.payload;
    },
    changeLocation(state, action: PayloadAction<string>) {
      state.location = action.payload;
    },
    changeCodeTheme(state, action: PayloadAction<CodeTheme>) {
      state.codeTheme = action.payload;
    },
    changeWorkflowEdgeType(state, action: PayloadAction<WorkflowEdgeType>) {
      state.workflow.edgeType = action.payload;
    },
    changeWorkflowHandleType(state, action: PayloadAction<WorkflowHandleType>) {
      state.workflow.handleType = action.payload;
    },
    changeWorkflowBackground(state, action: PayloadAction<WorkflowBackground>) {
      state.workflow.background = action.payload;
    },
    changeWorkflowSnapToGrid(state, action: PayloadAction<boolean>) {
      state.workflow.snapToGrid = action.payload;
    },
    changeWorkflowSnapGrid(state, action: PayloadAction<number>) {
      state.workflow.snapGrid = action.payload;
    },
  },
});

export const {
  changeColorMode,
  changeLocale,
  changeLocation,
  changeCodeTheme,
  changeWorkflowEdgeType,
  changeWorkflowHandleType,
  changeWorkflowBackground,
  changeWorkflowSnapGrid,
  changeWorkflowSnapToGrid,
} = settingsSlice.actions;

export default settingsSlice;
