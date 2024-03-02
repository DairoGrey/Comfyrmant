import { MiniMap as _MiniMap, MiniMapProps } from 'reactflow';

import { alpha, styled } from '@mui/material';
import { grey } from '@mui/material/colors';

type Props = {
  minimap: string;
  node: string;
  mask: string;
};

const STYLES: Record<'dark' | 'light', Partial<Props>> = {
  dark: {
    mask: alpha(grey[900], 0.8),
  },
  light: {},
};

export const MiniMap = styled(_MiniMap)<MiniMapProps>(({ theme }) => ({
  '&.react-flow__minimap': {
    backgroundColor: theme.palette.background.paper,
    '& > svg': {
      borderRadius: theme.shape.borderRadius,
      border: `1px solid ${theme.palette.divider}`,
    },
    '& .react-flow__minimap-mask': {
      fill: STYLES[theme.palette.mode].mask,
    },
  },
}));
