import { createSelector } from '@reduxjs/toolkit';

import { RootState } from '_state/store';
import { firstFree, secondFree } from '_state/utils';

import slice, { PromptOutput, PromptState } from './slice';

const getHub = (state: RootState) => state[slice.name];

const getHubStatus = createSelector(getHub, (hub) => hub.status);

export const getClientId = createSelector(getHubStatus, (status) => status.sid);

export const getRemainingQueue = createSelector(getHubStatus, (status) => status.queue.remaining);

export const getExecutedPrompts = createSelector(getHub, (hub) => {
  return Object.values(hub.prompts).filter((prompt) => prompt.started === false && prompt.executed).length;
});

export const getProgress: (state: RootState, id: string) => [boolean, { steps: number; currentStep: number } | null] =
  createSelector([getHub, firstFree<string>], (hub, id) => {
    const executingPrompt = hub.executingPrompt;

    if (!executingPrompt) {
      return [false, null];
    }

    const prompt = hub.prompts[executingPrompt];

    if (!prompt) {
      return [false, null];
    }

    if (prompt.executingNode !== id) {
      return [false, null];
    }

    return [true, prompt.progress ?? null];
  });

export const getOutputValueFromLatestPrompt = createSelector(
  [getHub, firstFree<string>, secondFree<keyof PromptOutput>],
  (hub, id, input) => {
    const get = (promptId?: string) => {
      if (!promptId) {
        return;
      }

      let prompt = hub.prompts[promptId];

      if (!prompt) {
        return;
      }

      if (!prompt.outputNodes?.includes(id)) {
        if (prompt.cachedNodes?.includes(id)) {
          const n = prompt.number;

          const prompts = Object.values(hub.prompts)

            .reduce((result, prompt) => {
              if (prompt.number < n && prompt.outputNodes?.includes(id) && prompt.outputs[id]) {
                return [...result, prompt];
              }

              return result;
            }, [] as PromptState[])

            .sort((a, b) => b.number - a.number);

          if (!prompts.length) {
            return;
          }

          prompt = prompts[0];
        } else {
          return;
        }
      }

      if (!prompt.outputs[id]) {
        return;
      }

      if (!prompt.outputs[id][input]) {
        return;
      }

      return prompt.outputs[id][input];
    };

    return get(hub.executingPrompt) || get(hub.lastExecutedPrompt);
  },
);
