import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import ReactSyntaxHighlighter from 'react-syntax-highlighter';
import * as styles from 'react-syntax-highlighter/dist/esm/styles/hljs';

import { useTheme } from '@mui/material';

import * as settingsSel from '_state/features/settings/selector';
import { CodeTheme } from '_state/features/settings/types';
import { ColorMode } from '_theme';

const STYLES: Record<ColorMode, Record<CodeTheme, any>> = {
  [ColorMode.Light]: {
    [CodeTheme.A11y]: styles.a11yLight,
    [CodeTheme.AtomOne]: styles.atomOneLight,
    [CodeTheme.Kimbie]: styles.kimbieLight,
    [CodeTheme.Nnfx]: styles.nnfx,
    [CodeTheme.Solarized]: styles.solarizedLight,
    [CodeTheme.StackOverflow]: styles.stackoverflowLight,
  },
  [ColorMode.Dark]: {
    [CodeTheme.A11y]: styles.a11yDark,
    [CodeTheme.AtomOne]: styles.atomOneDark,
    [CodeTheme.Kimbie]: styles.kimbieDark,
    [CodeTheme.Nnfx]: styles.nnfxDark,
    [CodeTheme.Solarized]: styles.solarizedDark,
    [CodeTheme.StackOverflow]: styles.stackoverflowDark,
  },
};

type Props = {
  language: string;
  code: string;
};

export const SyntaxHighlighter: FC<Props> = ({ language, code }) => {
  const theme = useTheme();

  const codeTheme = useSelector(settingsSel.getCodeTheme);
  const style = STYLES[theme.palette.mode][codeTheme];

  return (
    <ReactSyntaxHighlighter
      language={language}
      style={style}
      customStyle={{ margin: 0, width: 'fit-content', minWidth: '100%', overflowX: 'unset' }}
      showLineNumbers
    >
      {code}
    </ReactSyntaxHighlighter>
  );
};
