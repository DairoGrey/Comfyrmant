import { createSlice, Draft, PayloadAction } from '@reduxjs/toolkit';
import set from 'lodash/set';

import { ROUTES } from '_routes';
import { ColorMode } from '_theme';

import { CodeTheme, Locale, WorkflowBackground, WorkflowEdgeType, WorkflowHandleType, WorkflowSettings } from './types';

type Paths<T> = T extends object
  ? { [K in keyof T]: `${Exclude<K, symbol>}${'' | `.${Paths<T[K]>}`}` }[keyof T]
  : never;

type SettingsState = {
  colorMode?: ColorMode;
  locale: Locale;
  location: string;
  codeTheme: CodeTheme;
  workflow: WorkflowSettings;
};

const BROWSER_LOCALE = navigator.language as Locale;

const initialState: SettingsState = {
  locale: Object.values(Locale).includes(BROWSER_LOCALE) ? BROWSER_LOCALE : Locale.EN_US,
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

const pathReducer =
  <T, U = SettingsState>(path: Paths<U>) =>
  (state: Draft<SettingsState>, action: PayloadAction<T>) => {
    set(state, path, action.payload);
  };

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    changeColorMode: pathReducer<ColorMode>('colorMode'),
    changeLocale: pathReducer<Locale>('locale'),
    changeLocation: pathReducer<string>('location'),
    changeCodeTheme: pathReducer<CodeTheme>('codeTheme'),
    changeWorkflowEdgeType: pathReducer<WorkflowEdgeType>('workflow.edgeType'),
    changeWorkflowHandleType: pathReducer<WorkflowHandleType>('workflow.handleType'),
    changeWorkflowBackground: pathReducer<WorkflowBackground>('workflow.background'),
    changeWorkflowSnapToGrid: pathReducer<boolean>('workflow.snapToGrid'),
    changeWorkflowSnapGrid: pathReducer<number>('workflow.snapGrid'),

    importWorkflowSettings: pathReducer<WorkflowSettings>('workflow'),
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

  importWorkflowSettings,
} = settingsSlice.actions;

export default settingsSlice;
