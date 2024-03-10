import { ImageOutputResponse, PromptNodeData } from '../api/types';

export type HistoryEntry = {
  info: {
    number: number;
    id: string;
    prompt: Record<string, PromptNodeData>;
    clientId: string;
    outputNodes: string[];
  };
  outputs: Record<string, Record<'images', ImageOutputResponse[]>>;
  status: {
    status_str: string;
    completed: boolean;
    messages: Array<[string, Record<string, unknown>]>;
  };
};

export type HistoryEntries = Record<string, HistoryEntry>;
