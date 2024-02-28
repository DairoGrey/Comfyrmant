import type { NodeErrorType } from '../api/types';
export { NodeErrorType } from '../api/types';

export enum NodeColor {
  Green = 'green',
  Blue = 'blue',
  Orange = 'orange',
  Purple = 'purple',
  Yellow = 'yellow',
  DeepPurple = 'deepPurple',
  Indigo = 'indigo',
  Brown = 'brown',
  Pink = 'pink',
  Teal = 'teal',
  BlueGrey = 'blueGrey',
}

export type NodeInput = {
  index: number;
  name: string;
  type: string | string[];
  options?: Record<string, unknown>;
  required?: boolean;
};

export type NodeOutput = {
  index: number;
  name: string;
  type: string | string[];
  isList?: boolean;
};

export type NodeType = {
  type: string;
  title: string;
  category: string;
  isOutput: boolean;
  readonly inputs: Record<string, NodeInput>;
  readonly outputs: Record<string, NodeOutput>;
};

export type NodeTypes = {
  [k: string]: NodeType;
};

export type NodeInputState = NodeInput & {
  hidden?: boolean;
};

export type NodeOutputState = NodeOutput & {
  hidden?: boolean;
};

export type NodeWidgetState = {
  name: string;
  type: 'input' | 'output';
  options?: Record<string, unknown>;
  /**
   * input or output name
   **/
  id: string;
};

export type NodeErrorState = {
  name: string;
  type: NodeErrorType;
  details?: string | Record<string, unknown>;
};

export type NodeStateData = {
  readonly nodeType: NodeType;
  readonly inputs: Record<string, NodeInputState>;
  readonly outputs: Record<string, NodeOutputState>;
  widgets?: Record<string, NodeWidgetState>;
  values?: Record<string, unknown>;
  errors?: Record<string, NodeErrorState>;
  color?: NodeColor;
  tags?: string[];
};
