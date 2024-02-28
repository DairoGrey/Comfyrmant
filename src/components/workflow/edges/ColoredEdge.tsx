import React, { FC, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { BaseEdge, EdgeProps, getBezierPath, getSmoothStepPath, getStraightPath } from 'reactflow';

import * as settingsSel from '_state/features/settings/selector';
import { WorkflowEdgeType } from '_state/features/settings/types';
import * as workflowSel from '_state/features/workflow/selector';
import { RootState } from '_state/store';
import { useColorMode } from '_theme';

import { colorByType } from '../utils/colorByType';

const EDGE_TYPE: Record<WorkflowEdgeType, typeof getBezierPath | typeof getSmoothStepPath | typeof getStraightPath> = {
  [WorkflowEdgeType.Curve]: getBezierPath,
  [WorkflowEdgeType.SmoothStep]: getSmoothStepPath,
  [WorkflowEdgeType.Straight]: getStraightPath,
};

export const ColoredEdge: FC<EdgeProps> = ({ id, ...props }) => {
  const colorMode = useColorMode();

  const edgeType = useSelector(settingsSel.getWorkflowEdgeType);

  const [edgePath] = EDGE_TYPE[edgeType](props);

  const sourceHandleId: string | undefined = props.sourceHandleId || undefined;
  const source = props.source;

  const getOutput = useCallback(
    (state: RootState) => workflowSel.getNodeOutput(state, source, sourceHandleId),
    [source, sourceHandleId],
  );

  const output = useSelector(getOutput);
  const color = output ? colorByType(output.type, colorMode) : undefined;

  return (
    <>
      <BaseEdge id={id} path={edgePath} style={{ stroke: color, strokeWidth: props.selected ? 3 : 2 }} />
    </>
  );
};
