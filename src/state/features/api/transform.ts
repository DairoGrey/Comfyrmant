import { NodeInput, NodeOutput, NodeType, NodeTypes } from '_state/features/workflow/types';

import { ComponentsResponse } from './types';

export const transformObjectInfo = (apiValue: ComponentsResponse): NodeTypes =>
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

export const transformHistory = (apiValue: any) => apiValue;
