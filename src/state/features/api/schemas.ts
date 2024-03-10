import Ajv, { JSONSchemaType } from 'ajv';

import { ObjectInfoApiResponse, ObjectItemApiResponse } from './types';

const ajv = new Ajv();

const ObjectItemApiResponseSchema: JSONSchemaType<ObjectItemApiResponse> = {
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

export const validateObjectItemApiResponse = ajv.compile(ObjectItemApiResponseSchema);

const ObjectInfoApiResponseSchema: JSONSchemaType<ObjectInfoApiResponse> = {
  type: 'object',
  required: [],
  additionalProperties: ObjectItemApiResponseSchema,
};

export const validateObjectInfoApiResponse = ajv.compile(ObjectInfoApiResponseSchema);
