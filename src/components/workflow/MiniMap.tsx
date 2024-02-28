import { MiniMap as _MiniMap, MiniMapProps } from 'reactflow';

import { styled } from '@mui/material';
import { grey } from '@mui/material/colors';

type Props = {
  minimap: string;
  node: string;
  mask: string;
};

const STYLES: Record<'dark' | 'light', Partial<Props>> = {
  dark: {
    minimap: grey[900],
    node: grey[500],
    mask: grey[700],
  },
  light: {},
};

export const MiniMap = styled(_MiniMap)<MiniMapProps>(({ theme }) => ({
  '&.react-flow__minimap': {
    backgroundColor: STYLES[theme.palette.mode].minimap,
    '& .react-flow__minimap-node': {
      fill: STYLES[theme.palette.mode].node,
    },
    '& .react-flow__minimap-mask': {
      fill: STYLES[theme.palette.mode].mask,
    },
  },
}));
