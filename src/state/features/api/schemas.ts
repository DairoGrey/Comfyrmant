import Ajv, { JSONSchemaType } from 'ajv';

import { ComponentResponse, ComponentsResponse } from './types';

const ajv = new Ajv();

const ComponentResponseSchema: JSONSchemaType<ComponentResponse> = {
  type: 'object',
  properties: {
    category: { type: 'string' },
    description: { type: 'string' },
    display_name: { type: 'string' },
    name: { type: 'string' },
    input: {
      type: 'object',
      properties: {
        required: {
          type: 'object',
        },
      },
      required: ['required'],
      additionalProperties: true,
    },
    output: {
      type: 'array',
      items: {
        oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }],
      },
    },
    output_name: { type: 'array', items: { type: 'string' } },
    output_is_list: { type: 'array', items: { type: 'boolean' } },
    output_node: { type: 'boolean' },
  },
  required: [
    'category',
    'description',
    'display_name',
    'name',
    'input',
    'output',
    'output_name',
    'output_is_list',
    'output_node',
  ],
  additionalProperties: false,
};

export const validateComponentResponse = ajv.compile(ComponentResponseSchema);

const ComponentsResponseSchema: JSONSchemaType<ComponentsResponse> = {
  type: 'object',
  required: [],
  additionalProperties: ComponentResponseSchema,
};

export const validateComponentsResponse = ajv.compile(ComponentsResponseSchema);
