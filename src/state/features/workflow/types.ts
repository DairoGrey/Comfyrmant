import type { NodeErrorType } from '../api/types';
import { WorkflowSettings } from '../settings/types';
export { NodeErrorType } from '../api/types';

export enum NodeColor {
  Amber = 'amber',
  Blue = 'blue',
  BlueGrey = 'blueGrey',
  Brown = 'brown',
  Cyan = 'cyan',
  DeepOrange = 'deepOrange',
  DeepPurple = 'deepPurple',
  Green = 'green',
  Grey = 'grey',
  Indigo = 'indigo',
  LightBlue = 'lightBlue',
  LightGreen = 'lightGreen',
  Lime = 'lime',
  Orange = 'orange',
  Pink = 'pink',
  Purple = 'purple',
  Red = 'red',
  Teal = 'teal',
  Yellow = 'yellow',
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
  connected?: boolean;
};

export type NodeOutputState = NodeOutput & {
  hidden?: boolean;
  connected?: boolean;
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
  resizing?: boolean;
  collapsed?: boolean;
  tags?: string[];
};

export type ExportedNode = {
  id: string;
  type: string;
  x: number;
  y: number;
  width?: number;
  height?: number;

  inputs: Record<string, NodeInputState>;
  outputs: Record<string, NodeOutputState>;
  widgets?: Record<string, NodeWidgetState>;
  values?: Record<string, unknown>;
  tags?: string[];
};

export type ExportedWorkflow = {
  settings?: WorkflowSettings;
  nodes: ExportedNode[];
  edges: string[];
};
