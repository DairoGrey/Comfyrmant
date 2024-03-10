export type QueueItem = [
  number, // prompt.number
  string, // prompt.id,
  Record<string | number, PromptNodeData>, // prompt,
  { client_id: string }, // client info
  string[], // output nodes
];

export type ImageOutputResponse = {
  filename: string;
  type: 'temp' | 'output';
  subfolder: string;
};

export type QueueResponse = {
  queue_running: QueueItem[];
  queue_pending: QueueItem[];
};

export type HistoryItemApiResponse = {
  outputs: Record<string, Record<'images', ImageOutputResponse[]>>;
  prompt: QueueItem;
  status: {
    status_str: string;
    completed: boolean;
    messages: Array<[string, Record<string, unknown>]>;
  };
};

export type HistoryApiResponse = Record<string, HistoryItemApiResponse>;

export type ObjectItemApiResponse = {
  category: string;
  description: string;
  display_name: string;
  name: string;
  input: {
    required: Record<string, any>;
  };
  output: (string | string[])[];
  output_name: string[];
  output_is_list: boolean[];
  output_node: boolean;
};

export type ObjectInfoApiResponse = {
  [k: string]: ObjectItemApiResponse;
};

export enum NodeErrorType {
  RequiredInputMissing = 'required_input_missing',
  ValueSmallerThanMin = 'value_smaller_than_min',
}

export type NodeErrorResponse = {
  class_type: string;
  dependent_outputs: string[];
  errors: Array<{
    // todo: change to descriminated union
    details: string;
    extra_info: Record<string, unknown>;
    message: string;
    type: NodeErrorType;
  }>;
};

export type PromptResponse = {
  prompt_id: string;
  number: number;
  node_errors: Record<string, unknown>;
};

export enum PromptErrorType {
  OutputsFailedValidation = 'prompt_outputs_failed_validation',
}

export type PromptErrorResponse = {
  error: {
    details?: string;
    extra_info: Record<string, unknown>;
    message: string;
    type: PromptErrorType;
  };
  node_errors: Record<string, NodeErrorResponse>;
};

export type PromptNodeInput = string | number | [string | number, number];

export type PromptNodeData = {
  class_type: string;
  inputs: Record<string, PromptNodeInput>;
};

export type PromptRequest = {
  client_id: string;
  prompt: Record<string, PromptNodeData>;
};
