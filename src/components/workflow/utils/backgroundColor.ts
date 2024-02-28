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
import { darken } from '@mui/material/styles';

import { NodeColor } from '_state/features/workflow/types';
import { ColorMode } from '_theme';

const COLORS: Record<ColorMode, Record<NodeColor, string>> = {
  [ColorMode.Dark]: {
    [NodeColor.Green]: darken(green[900], 0.75),
    [NodeColor.Blue]: darken(blue[900], 0.75),
    [NodeColor.Orange]: darken(orange[900], 0.75),
    [NodeColor.Purple]: darken(purple[900], 0.75),
    [NodeColor.Yellow]: darken(yellow[900], 0.75),
    [NodeColor.DeepPurple]: darken(deepPurple[900], 0.75),
    [NodeColor.Indigo]: darken(indigo[900], 0.75),
    [NodeColor.Brown]: darken(brown[900], 0.75),
    [NodeColor.Pink]: darken(pink[900], 0.75),
    [NodeColor.Teal]: darken(teal[900], 0.75),
    [NodeColor.BlueGrey]: darken(blueGrey[900], 0.75),
  },
  [ColorMode.Light]: {
    [NodeColor.Green]: green[50],
    [NodeColor.Blue]: blue[50],
    [NodeColor.Orange]: orange[50],
    [NodeColor.Purple]: purple[50],
    [NodeColor.Yellow]: yellow[50],
    [NodeColor.DeepPurple]: deepPurple[50],
    [NodeColor.Indigo]: indigo[50],
    [NodeColor.Brown]: brown[50],
    [NodeColor.Pink]: pink[50],
    [NodeColor.Teal]: teal[50],
    [NodeColor.BlueGrey]: blueGrey[50],
  },
};

export const backgroundByType = (color: NodeColor, colorMode: ColorMode) => {
  return COLORS[colorMode][color];
};
