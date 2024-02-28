import React, { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';

import { IconButton, Tooltip } from '@mui/material';

import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

const DARK_MODE_NAME = (
  <FormattedMessage
    id="ui.app-bar.toolbar.color-mode-switch.mode.dark"
    description="Dark color mode name"
    defaultMessage="dark"
  />
);

const LIGHT_MODE_NAME = (
  <FormattedMessage
    id="ui.app-bar.toolbar.color-mode-switch.mode.light"
    description="Light color mode name"
    defaultMessage="light"
  />
);

import { ColorMode, useChangeColorMode, useColorMode } from '_theme';

export const ColorModeToggle = () => {
  const colorMode = useColorMode();
  const changeColorMode = useChangeColorMode();

  const icon = colorMode === ColorMode.Dark ? <LightModeIcon /> : <DarkModeIcon />;
  const nextColorMode = colorMode === ColorMode.Dark ? ColorMode.Light : ColorMode.Dark;
  const colorModeName = nextColorMode === ColorMode.Dark ? DARK_MODE_NAME : LIGHT_MODE_NAME;
  const tooltip = (
    <FormattedMessage
      id="ui.app-bar.toolbar.color-mode-switch.tooltip"
      description="ColorModeSwitch description tooltip"
      defaultMessage="Switch to {mode}"
      values={{
        mode: colorModeName,
      }}
    />
  );

  const handleClick = useCallback(() => {
    changeColorMode(nextColorMode);
  }, [changeColorMode, nextColorMode]);

  return (
    <Tooltip title={tooltip}>
      <IconButton color="inherit" onClick={handleClick}>
        {icon}
      </IconButton>
    </Tooltip>
  );
};
