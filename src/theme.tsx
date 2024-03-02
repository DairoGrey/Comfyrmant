import React, { useCallback, useContext, useEffect } from 'react';
import { createContext, FC, ReactNode, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import type {} from '@mui/lab/themeAugmentation';

import { useMediaQuery } from '@mui/material';
import { enUS, ruRU } from '@mui/material/locale';
import * as styles from '@mui/material/styles';
import createPalette, { PaletteAugmentColorOptions } from '@mui/material/styles/createPalette';

import * as settingsSel from '_state/features/settings/selector';
import * as settingsAct from '_state/features/settings/slice';
import { Locale } from '_state/features/settings/types';

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

const PRIMARY_COLOR: PaletteAugmentColorOptions = {
  color: { main: '#66B3FF' },
  name: 'argentinian blue',
};

const SECONDARY_COLOR: PaletteAugmentColorOptions = {
  color: { main: '#FFAC59' },
  name: 'samdy brown',
};

export const createTheme = (mode: ColorMode, locale: Locale) => {
  const palette = createPalette({
    contrastThreshold: 7.0,
    mode,
  });

  const prop = mode === ColorMode.Dark ? 'light' : 'main';

  const primary = palette.augmentColor(PRIMARY_COLOR);
  const secondary = palette.augmentColor(SECONDARY_COLOR);

  return styles.createTheme(
    {
      palette: {
        contrastThreshold: 7.0,
        mode,
        primary: {
          main: primary[prop],
        },
        secondary: {
          main: secondary[prop],
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

  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
  const initialColorMode = prefersDark ? ColorMode.Dark : ColorMode.Light;

  const [colorMode, setColorMode] = useState(colorModeFromSettings || initialColorMode);

  const changeColorMode = useCallback(
    (colorMode: ColorMode) => {
      dispatch(settingsAct.changeColorMode(colorMode));
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
    if (colorModeFromSettings) {
      setColorMode(colorModeFromSettings);
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
