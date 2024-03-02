import React, { FC, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { BaseEdge, EdgeProps } from 'reactflow';

import * as settingsSel from '_state/features/settings/selector';
import * as workflowSel from '_state/features/workflow/selector';
import { RootState } from '_state/store';
import { useColorMode } from '_theme';

import { colorByType } from '../utils/colorByType';
import { EDGE_TYPE } from '../utils/edgeTypes';

export const ColoredEdge: FC<EdgeProps> = ({ id, selected, ...props }) => {
  const colorMode = useColorMode();

  const edgeType = useSelector(settingsSel.getWorkflowEdgeType);

  const [path] = EDGE_TYPE[edgeType](props);

  const sourceHandleId: string | undefined = props.sourceHandleId || undefined;
  const source = props.source;

  const getOutput = useCallback(
    (state: RootState) => workflowSel.getNodeOutput(state, source, sourceHandleId),
    [source, sourceHandleId],
  );

  const output = useSelector(getOutput);
  const color = output ? colorByType(output.type, colorMode) : undefined;

  const style = useMemo(() => ({ stroke: color, strokeWidth: selected ? 3 : 2 }), [selected]);

  return (
    <>
      <BaseEdge id={id} path={path} style={style} />
    </>
  );
};
