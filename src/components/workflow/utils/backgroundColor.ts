import {
  amber,
  blue,
  blueGrey,
  brown,
  cyan,
  deepOrange,
  deepPurple,
  green,
  grey,
  indigo,
  lightBlue,
  lightGreen,
  lime,
  orange,
  pink,
  purple,
  red,
  teal,
  yellow,
} from '@mui/material/colors';
import { darken, Theme } from '@mui/material/styles';

import { NodeColor } from '_state/features/workflow/types';
import { ColorMode } from '_theme';

const DARKEN_KEY: keyof typeof red = 800;
const DARKEN_FACTOR = 0.85;

const MINIMAP_DARKEN_KEY: keyof typeof red = 700;
const MINIMAP_DARKEN_FACTOR = 0.5;

const NODE_COLORS: Record<ColorMode, Record<NodeColor, string>> = {
  [ColorMode.Dark]: {
    [NodeColor.Amber]: darken(amber[DARKEN_KEY], DARKEN_FACTOR),
    [NodeColor.Blue]: darken(blue[DARKEN_KEY], DARKEN_FACTOR),
    [NodeColor.BlueGrey]: darken(blueGrey[DARKEN_KEY], DARKEN_FACTOR),
    [NodeColor.Brown]: darken(brown[DARKEN_KEY], DARKEN_FACTOR),
    [NodeColor.Cyan]: darken(cyan[DARKEN_KEY], DARKEN_FACTOR),
    [NodeColor.DeepOrange]: darken(deepOrange[DARKEN_KEY], DARKEN_FACTOR),
    [NodeColor.DeepPurple]: darken(deepPurple[DARKEN_KEY], DARKEN_FACTOR),
    [NodeColor.Green]: darken(green[DARKEN_KEY], DARKEN_FACTOR),
    [NodeColor.Grey]: darken(grey[DARKEN_KEY], DARKEN_FACTOR),
    [NodeColor.Indigo]: darken(indigo[DARKEN_KEY], DARKEN_FACTOR),
    [NodeColor.LightBlue]: darken(lightBlue[DARKEN_KEY], DARKEN_FACTOR),
    [NodeColor.LightGreen]: darken(lightGreen[DARKEN_KEY], DARKEN_FACTOR),
    [NodeColor.Lime]: darken(lime[DARKEN_KEY], DARKEN_FACTOR),
    [NodeColor.Orange]: darken(orange[DARKEN_KEY], DARKEN_FACTOR),
    [NodeColor.Pink]: darken(pink[DARKEN_KEY], DARKEN_FACTOR),
    [NodeColor.Purple]: darken(purple[DARKEN_KEY], DARKEN_FACTOR),
    [NodeColor.Red]: darken(red[DARKEN_KEY], DARKEN_FACTOR),
    [NodeColor.Teal]: darken(teal[DARKEN_KEY], DARKEN_FACTOR),
    [NodeColor.Yellow]: darken(yellow[DARKEN_KEY], DARKEN_FACTOR),
  },
  [ColorMode.Light]: {
    [NodeColor.Amber]: amber[50],
    [NodeColor.Blue]: blue[50],
    [NodeColor.BlueGrey]: blueGrey[50],
    [NodeColor.Brown]: brown[50],
    [NodeColor.Cyan]: cyan[50],
    [NodeColor.DeepOrange]: deepOrange[50],
    [NodeColor.DeepPurple]: deepPurple[50],
    [NodeColor.Green]: green[50],
    [NodeColor.Grey]: grey[50],
    [NodeColor.Indigo]: indigo[50],
    [NodeColor.LightBlue]: lightBlue[50],
    [NodeColor.LightGreen]: lightGreen[50],
    [NodeColor.Lime]: lime[50],
    [NodeColor.Orange]: orange[50],
    [NodeColor.Pink]: pink[50],
    [NodeColor.Purple]: purple[50],
    [NodeColor.Red]: red[50],
    [NodeColor.Teal]: teal[50],
    [NodeColor.Yellow]: yellow[50],
  },
};

const MINIMAP_NODE_COLORS: Record<ColorMode, Record<NodeColor, string>> = {
  [ColorMode.Dark]: {
    [NodeColor.Amber]: darken(amber[MINIMAP_DARKEN_KEY], MINIMAP_DARKEN_FACTOR),
    [NodeColor.Blue]: darken(blue[MINIMAP_DARKEN_KEY], MINIMAP_DARKEN_FACTOR),
    [NodeColor.BlueGrey]: darken(blueGrey[MINIMAP_DARKEN_KEY], MINIMAP_DARKEN_FACTOR),
    [NodeColor.Brown]: darken(brown[MINIMAP_DARKEN_KEY], MINIMAP_DARKEN_FACTOR),
    [NodeColor.Cyan]: darken(cyan[MINIMAP_DARKEN_KEY], MINIMAP_DARKEN_FACTOR),
    [NodeColor.DeepOrange]: darken(deepOrange[MINIMAP_DARKEN_KEY], MINIMAP_DARKEN_FACTOR),
    [NodeColor.DeepPurple]: darken(deepPurple[MINIMAP_DARKEN_KEY], MINIMAP_DARKEN_FACTOR),
    [NodeColor.Green]: darken(green[MINIMAP_DARKEN_KEY], MINIMAP_DARKEN_FACTOR),
    [NodeColor.Grey]: darken(grey[MINIMAP_DARKEN_KEY], MINIMAP_DARKEN_FACTOR),
    [NodeColor.Indigo]: darken(indigo[MINIMAP_DARKEN_KEY], MINIMAP_DARKEN_FACTOR),
    [NodeColor.LightBlue]: darken(lightBlue[MINIMAP_DARKEN_KEY], MINIMAP_DARKEN_FACTOR),
    [NodeColor.LightGreen]: darken(lightGreen[MINIMAP_DARKEN_KEY], MINIMAP_DARKEN_FACTOR),
    [NodeColor.Lime]: darken(lime[MINIMAP_DARKEN_KEY], MINIMAP_DARKEN_FACTOR),
    [NodeColor.Orange]: darken(orange[MINIMAP_DARKEN_KEY], MINIMAP_DARKEN_FACTOR),
    [NodeColor.Pink]: darken(pink[MINIMAP_DARKEN_KEY], MINIMAP_DARKEN_FACTOR),
    [NodeColor.Purple]: darken(purple[MINIMAP_DARKEN_KEY], MINIMAP_DARKEN_FACTOR),
    [NodeColor.Red]: darken(red[MINIMAP_DARKEN_KEY], MINIMAP_DARKEN_FACTOR),
    [NodeColor.Teal]: darken(teal[MINIMAP_DARKEN_KEY], MINIMAP_DARKEN_FACTOR),
    [NodeColor.Yellow]: darken(yellow[MINIMAP_DARKEN_KEY], MINIMAP_DARKEN_FACTOR),
  },
  [ColorMode.Light]: {
    [NodeColor.Amber]: amber[100],
    [NodeColor.Blue]: blue[100],
    [NodeColor.BlueGrey]: blueGrey[100],
    [NodeColor.Brown]: brown[100],
    [NodeColor.Cyan]: cyan[100],
    [NodeColor.DeepOrange]: deepOrange[100],
    [NodeColor.DeepPurple]: deepPurple[100],
    [NodeColor.Green]: green[100],
    [NodeColor.Grey]: grey[100],
    [NodeColor.Indigo]: indigo[100],
    [NodeColor.LightBlue]: lightBlue[100],
    [NodeColor.LightGreen]: lightGreen[100],
    [NodeColor.Lime]: lime[100],
    [NodeColor.Orange]: orange[100],
    [NodeColor.Pink]: pink[100],
    [NodeColor.Purple]: purple[100],
    [NodeColor.Red]: red[100],
    [NodeColor.Teal]: teal[100],
    [NodeColor.Yellow]: yellow[100],
  },
};

export const backgroundByType = (color: NodeColor, theme: Theme, colorMode: ColorMode) => {
  return NODE_COLORS[colorMode][color];
};

export const progressBarByType = (color: NodeColor, theme: Theme, colorMode: ColorMode) => {
  const value = NODE_COLORS[colorMode][color];

  return colorMode === ColorMode.Dark
    ? [value, theme.lighten(value, 0.45)]
    : [theme.darken(value, 0.1), theme.darken(value, 0.3)];
};

export const createMiniMapNodeColorGetter =
  (colorMode: ColorMode, theme: Theme, fallback: string) => (color?: NodeColor, bypass?: boolean) => {
    if (bypass) {
      return colorMode === ColorMode.Dark ? theme.darken(fallback, 0.5) : theme.lighten(fallback, 0.5);
    }

    if (!color) {
      return fallback;
    }

    return MINIMAP_NODE_COLORS[colorMode][color];
  };
