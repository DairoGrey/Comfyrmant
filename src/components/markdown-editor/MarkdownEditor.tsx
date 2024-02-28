import { FC, useMemo, useState } from 'react';
import React from 'react';

import { defaultValueCtx, Editor, rootCtx } from '@milkdown/core';
import { listener, listenerCtx } from '@milkdown/plugin-listener';
import { commonmark } from '@milkdown/preset-commonmark';
import { gfm } from '@milkdown/preset-gfm';
import { Milkdown, MilkdownProvider, useEditor } from '@milkdown/react';
import { ProsemirrorAdapterProvider, usePluginViewFactory } from '@prosemirror-adapter/react';

import { Button, ButtonGroup, Grid, Stack } from '@mui/material';

import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';

import { slash, SlashView } from './SlashView';

type Props = {
  value?: string;

  onChange: (value: string) => void;
};

const createEditorFactory =
  ({ value = '', onChange }: Props, pluginViewFactory: ReturnType<typeof usePluginViewFactory>) =>
  (root: HTMLElement) => {
    const editor = Editor.make()
      .config((ctx) => {
        ctx.set(rootCtx, root);
        ctx.set(defaultValueCtx, value);
        ctx.set(slash.key, {
          view: pluginViewFactory({
            component: SlashView,
          }),
        });
        ctx.get(listenerCtx).markdownUpdated((ctx, markdown) => {
          onChange(markdown);
        });
      })
      .use(listener)
      .use(commonmark)
      .use(gfm)
      .use(slash);

    return editor;
  };

const MilkdownEditor: FC<Props> = (props) => {
  const pluginViewFactory = usePluginViewFactory();

  const createEditor = useMemo(() => createEditorFactory(props, pluginViewFactory), [props, pluginViewFactory]);

  useEditor(createEditor);

  return <Milkdown />;
};

export const MarkdownEditor: FC<Props> = ({ value = '', onChange }) => {
  const [previewEnabled, setPreviewEnabled] = useState(false);

  const editor = (
    <MilkdownProvider>
      <ProsemirrorAdapterProvider>
        <Stack gap={2} height="100%">
          <Stack direction="row" gap={2}>
            <ButtonGroup>
              <Button>
                <FormatBoldIcon />
              </Button>

              <Button>
                <FormatItalicIcon />
              </Button>

              <Button>
                <FormatUnderlinedIcon />
              </Button>
            </ButtonGroup>
            <ButtonGroup>
              <Button>
                <FormatAlignLeftIcon />
              </Button>
              <Button>
                <FormatAlignCenterIcon />
              </Button>
              <Button>
                <FormatAlignRightIcon />
              </Button>
              <Button>
                <FormatAlignJustifyIcon />
              </Button>
            </ButtonGroup>
          </Stack>
          <MilkdownEditor value={value} onChange={onChange} />
        </Stack>
      </ProsemirrorAdapterProvider>
    </MilkdownProvider>
  );

  if (previewEnabled) {
    return (
      <Grid container>
        <Grid item xs={6}>
          {editor}
        </Grid>
        <Grid item xs={6}></Grid>
      </Grid>
    );
  }

  return editor;
};
