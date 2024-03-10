import { NodeInput, NodeOutput, NodeType, NodeTypes } from '_state/features/workflow/types';

import { HistoryEntries, HistoryEntry } from '../history/types';

import { HistoryApiResponse, ObjectInfoApiResponse } from './types';

export const transformObjectInfo = (apiValue: ObjectInfoApiResponse): NodeTypes =>
  Object.entries(apiValue).reduce(
    (result, [k, v]) => ({
      ...result,
      [k]: {
        type: v.name,
        title: v.display_name,
        category: v.category,
        isOutput: v.output_node,
        outputs: v.output.reduce(
          (result, type, i) => ({
            ...result,
            [v.output_name[i]]: {
              index: i,
              name: v.output_name[i],
              type: type,
              isList: v.output_is_list[i],
            } satisfies NodeOutput,
          }),
          {},
        ),
        inputs: Object.entries(v.input.required).reduce(
          (result, [k, v], i) => ({
            ...result,
            [k]: {
              index: i,
              name: k,
              type: v[0],
              options: v[1],
              required: true,
            } satisfies NodeInput,
          }),
          {},
        ),
      } satisfies NodeType,
    }),
    {},
  ) satisfies NodeTypes;

export const transformHistory = (apiValue: HistoryApiResponse): HistoryEntries =>
  Object.entries(apiValue).reduce(
    (
      result,
      [
        key,
        {
          prompt: [number, id, prompt, { client_id }, outputNodes],
          outputs,
          status,
        },
      ],
    ) => ({
      ...result,
      [key]: {
        info: {
          number,
          id,
          prompt,
          clientId: client_id,
          outputNodes,
        },
        outputs,
        status,
      } satisfies HistoryEntry,
    }),
    {},
  );
