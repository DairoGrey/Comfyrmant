export enum MessageType {
  Status = 'status',
  ExecutionStart = 'execution_start',
  ExecutionCached = 'execution_cached',
  Executing = 'executing',
  Progress = 'progress',
  Executed = 'executed',
}

export type StatusMessage = {
  type: MessageType.Status;
  data: {
    sid: string;
    status: {
      exec_info: {
        queue_remaining: number;
      };
    };
  };
};

export type ExecutionStartMessage = {
  type: MessageType.ExecutionStart;
  data: {
    prompt_id: string;
  };
};

export type ExecutionCachedMessage = {
  type: MessageType.ExecutionStart;
  data: {
    prompt_id: string;
    nodes: string[];
  };
};

export type ExecutingMessage = {
  type: MessageType.Executing;
  data: {
    prompt_id: string;
    node: string | null;
  };
};

export type ProgressMessage = {
  type: MessageType.Executing;
  data: {
    prompt_id: string;
    node: string;
    value: number;
    max: number;
  };
};

export type ExecutedMessage = {
  type: MessageType.Executing;
  data: {
    prompt_id: string;
    node: string;
    output: {
      images: Array<{
        filename: string;
        subfolder: string;
        type: 'temp';
      }>;
    };
  };
};

export type Message =
  | StatusMessage
  | ExecutionStartMessage
  | ExecutionCachedMessage
  | ExecutingMessage
  | ProgressMessage
  | ExecutedMessage;
