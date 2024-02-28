import {
  blue,
  blueGrey,
  brown,
  deepPurple,
  green,
  indigo,
  orange,
  pink,
  purple,
  teal,
  yellow,
} from '@mui/material/colors';

import { ColorMode } from '_theme';

const COLOR_BY_TYPE: Record<ColorMode, Record<string, string>> = {
  [ColorMode.Dark]: {
    INT: green[200],
    FLOAT: blue[200],
    VAE: orange[200],
    MODEL: purple[200],
    CLIP: yellow[200],
    LATENT: deepPurple[200],
    STRING: indigo[200],
    CONDITIONING: brown[200],
    IMAGE: pink[200],
    UPSCALE_MODEL: teal[200],
    GENERIC: teal[200],
  },
  [ColorMode.Light]: {
    INT: green[400],
    FLOAT: blue[400],
    VAE: orange[400],
    MODEL: purple[400],
    CLIP: yellow[600],
    LATENT: deepPurple[400],
    STRING: indigo[400],
    CONDITIONING: brown[400],
    IMAGE: pink[400],
    UPSCALE_MODEL: teal[400],
    GENERIC: teal[400],
  },
};

export const colorByType = (type: string | string[], colorMode: ColorMode) => {
  if (Array.isArray(type)) {
    return colorMode === ColorMode.Dark ? blueGrey[200] : blueGrey[400];
  }

  return COLOR_BY_TYPE[colorMode][type];
};
