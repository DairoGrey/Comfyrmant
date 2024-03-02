import { getBezierPath, getSimpleBezierPath, getSmoothStepPath, getStraightPath } from 'reactflow';

import { WorkflowEdgeType } from '_state/features/settings/types';

type GetPath = typeof getBezierPath | typeof getSmoothStepPath | typeof getStraightPath | typeof getSimpleBezierPath;

export const EDGE_TYPE: Record<WorkflowEdgeType, GetPath> = {
  [WorkflowEdgeType.Curve]: getBezierPath,
  [WorkflowEdgeType.SimpleCurve]: getSimpleBezierPath,
  [WorkflowEdgeType.SmoothStep]: getSmoothStepPath,
  [WorkflowEdgeType.Step]: (props: Parameters<typeof getSmoothStepPath>[0]) =>
    getSmoothStepPath({ ...props, borderRadius: 0 }),
  [WorkflowEdgeType.Straight]: getStraightPath,
};
