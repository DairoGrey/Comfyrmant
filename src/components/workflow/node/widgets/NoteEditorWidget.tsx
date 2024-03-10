import React, { memo } from 'react';
import { FC } from 'react';

import { MarkdownEditor } from '_components/markdown-editor';
import { NodeInputState, NodeOutputState, NodeWidgetState } from '_state/features/workflow/types';

type Props = {
  widget?: NodeWidgetState;

  input?: NodeInputState;

  output?: NodeOutputState;

  value?: unknown;

  onChange: (value: unknown) => void;

  onOptionsChange: (options: Record<string, unknown>) => void;
};

export const NoteEditorWidget: FC<Props> = memo(({ value, onChange }) => {
  return <MarkdownEditor value={value as string} onChange={onChange} />;
});
NoteEditorWidget.displayName = 'NoteEditorWidget';
