export enum Locale {
  EN_US = 'en-US',
  RU_RU = 'ru-RU',
}

export enum CodeTheme {
  Nnfx = 'nnfx',
  A11y = 'a11y',
  Solarized = 'solarized',
  Kimbie = 'kimbie',
  StackOverflow = 'stack-overflow',
  AtomOne = 'atom-one',
}

export enum WorkflowBackground {
  Dots = 'dots',
  Lines = 'lines',
  Cross = 'cross',
}

export enum WorkflowEdgeType {
  Curve = 'curve',
  SimpleCurve = 'simple-curve',
  SmoothStep = 'smooth-step',
  Step = 'step',
  Straight = 'straight',
}

export enum WorkflowHandleType {
  Circle = 'circle',
  Square = 'square',
  Arrow = 'arrow',
  Hexagon = 'hexagon',
}

export type WorkflowSettings = {
  edgeType: WorkflowEdgeType;
  handleType: WorkflowHandleType;
  background: WorkflowBackground;
  snapToGrid: boolean;
  snapGrid: number;
};
