import React, { useCallback, useContext, useEffect } from 'react';
import { createContext, FC, ReactNode, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { enUS, ruRU } from '@mui/material/locale';
import * as styles from '@mui/material/styles';
import type {} from '@mui/material/themeCssVarsAugmentation';

import * as settingsSel from '_state/features/settings/selector';
import * as settingsAct from '_state/features/settings/slice';
import { Locale } from '_state/features/settings/types';

import '@fontsource-variable/ubuntu-sans/wght.css';
import '@fontsource-variable/ubuntu-sans/wdth.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

export enum ColorMode {
  Dark = 'dark',
  Light = 'light',
}

const LOCALE: Record<Locale, any> = {
  [Locale.EN_US]: enUS,
  [Locale.RU_RU]: ruRU,
};

const PRIMARY_COLOR = {
  main: '#66B3FF',
};

const SECONDARY_COLOR: styles.PaletteColorOptions = {
  main: '#FFAC59',
};

export const createTheme = (locale: Locale) => {
  return styles.createTheme(
    {
      modularCssLayers: true,
      cssVariables: {
        nativeColor: true,
        colorSchemeSelector: '[data-color-mode=%s]',
      },
      typography: {
        fontFamily: 'var(--ui-regular-font)',
      },
      colorSchemes: {
        dark: {
          palette: {
            contrastThreshold: 0.7,
            primary: PRIMARY_COLOR,
            secondary: SECONDARY_COLOR,
          },
        },
        light: {
          palette: {
            contrastThreshold: 0.7,
            primary: PRIMARY_COLOR,
            secondary: SECONDARY_COLOR,
          },
        },
      },
    },
    LOCALE[locale],
  );
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ColorModeContext = createContext({ colorMode: ColorMode.Light, changeColorMode: (_: ColorMode) => {} });

export const ColorModeProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const dispatch = useDispatch();

  const colorModeFromSettings = useSelector(settingsSel.getColorMode);

  const { mode, systemMode, setMode } = styles.useColorScheme();
  const initialColorMode =
    mode === 'system'
      ? systemMode === 'dark'
        ? ColorMode.Dark
        : ColorMode.Light
      : mode === 'dark'
        ? ColorMode.Dark
        : ColorMode.Light;

  const [colorMode, setColorMode] = useState(colorModeFromSettings || initialColorMode);

  const changeColorMode = useCallback(
    (colorMode: ColorMode) => {
      setColorMode(colorMode);
    },
    [setColorMode],
  );

  const value = useMemo(
    () => ({
      colorMode,
      changeColorMode,
    }),
    [colorMode, changeColorMode],
  );

  useEffect(() => {
    dispatch(settingsAct.changeColorMode(colorMode));
    setMode(colorMode);
  }, [colorMode]);

  useEffect(() => {
    if (colorModeFromSettings) {
      setMode(colorMode);
    }
  }, [colorModeFromSettings]);

  return <ColorModeContext.Provider value={value}>{children}</ColorModeContext.Provider>;
};

export const useColorMode = () => {
  return useContext(ColorModeContext).colorMode;
};

export const useChangeColorMode = () => {
  return useContext(ColorModeContext).changeColorMode;
};
