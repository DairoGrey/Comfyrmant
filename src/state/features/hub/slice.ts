import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { QueueResponse } from '../api/types';

export type PromptState = {
  started?: boolean;
  executed?: boolean;
  number: number;
  timestamp?: string;
  cachedNodes?: string[];
  executingNode?: string | null;
  outputNodes: string[] | null;
  outputs: Record<string, PromptOutput>;
  progress?: {
    currentStep: number;
    steps: number;
  };
};

export type PromptOutput = {
  images: Array<{
    url: string;
    filename: string;
  }>;
};

type HubState = {
  status: {
    sid?: string;
    queue: {
      remaining: number;
    };
  };
  executingPrompt?: string;
  lastExecutedPrompt?: string;
  prompts: Record<string, PromptState>;
};

const initialState: HubState = {
  status: {
    queue: {
      remaining: 0,
    },
  },
  prompts: {},
};

const hubSlice = createSlice({
  name: '@hub',
  initialState,
  reducers: {
    status(state, action: PayloadAction<{ sid: string; remainingQueue: number }>) {
      if (action.payload.sid) {
        state.status.sid = action.payload.sid;
      }

      state.status.queue.remaining = action.payload.remainingQueue;
    },
    trackPrompt(state, action: PayloadAction<{ id: string; number: number }>) {
      state.prompts[action.payload.id] = {
        number: action.payload.number,
        timestamp: new Date().toISOString(),
        outputNodes: [],
        outputs: {},
      };
    },
    executionStart(state, action: PayloadAction<{ id: string }>) {
      const { id } = action.payload;

      state.executingPrompt = id;
      const prompt = state.prompts[id];

      if (prompt) {
        prompt.started = true;
        prompt.executed = false;
      }
    },
    executionCached(state, action: PayloadAction<{ id: string; nodes: string[] }>) {
      const { id, nodes } = action.payload;
      const prompt = state.prompts[id];

      if (prompt) {
        prompt.cachedNodes = nodes;
      }
    },
    executing(state, action: PayloadAction<{ id: string; node: string | null }>) {
      const { id, node } = action.payload;
      const prompt = state.prompts[id];

      if (prompt && node) {
        prompt.executingNode = node;
      } else if (prompt && node === null) {
        state.executingPrompt = undefined;
        state.lastExecutedPrompt = id;

        prompt.started = false;
        prompt.executed = true;
      }
    },
    progress(state, action: PayloadAction<{ id: string; node: string; currentStep: number; steps: number }>) {
      const { id, node, currentStep, steps } = action.payload;
      const prompt = state.prompts[id];

      if (prompt) {
        prompt.executingNode = node;
        prompt.progress = {
          currentStep,
          steps,
        };
      }
    },
    executed(state, action: PayloadAction<{ id: string; node: string; output: PromptOutput }>) {
      const { id, node, output } = action.payload;
      const prompt = state.prompts[id];

      if (prompt) {
        prompt.outputNodes?.push(node);
        prompt.outputs[node] = output;

        delete prompt.progress;
      }
    },
    restoreQueue(state, action: PayloadAction<QueueResponse>) {
      for (const q of action.payload.queue_pending) {
        const [num, id, , client, outputNodes] = q;

        if (client.client_id === state.status.sid) {
          state.prompts[id] = {
            number: num,
            outputNodes: outputNodes,
            outputs: {},
          };
        }
      }

      for (const q of action.payload.queue_running) {
        const [num, id, , client, outputNodes] = q;

        if (client.client_id === state.status.sid) {
          state.prompts[id] = {
            number: num,
            outputNodes: outputNodes,
            started: true,
            outputs: {},
          };
          state.executingPrompt = id;
        }
      }
    },
  },
});

export default hubSlice;

export const { status, trackPrompt, executionStart, executionCached, executing, progress, executed, restoreQueue } =
  hubSlice.actions;
