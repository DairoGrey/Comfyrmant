import joi from 'joi';

import { ObjectInfoApiResponse, ObjectItemApiResponse } from './types';

const ObjectItemApiResponseSchema = joi.object<ObjectItemApiResponse, true>({
  api_node: joi.boolean(),
  category: joi.string(),
  deprecated: joi.boolean(),
  description: joi.string().required(),
  display_name: joi.string().optional(),
  input: joi
    .object({
      required: joi.object().required(),
    })
    .required(),
  input_order: joi
    .object({
      required: joi.array().items(joi.string()).required(),
    })
    .required(),
  name: joi.string().required(),
  output: joi.array().items(joi.string()).required(),
  output_is_list: joi.array().items(joi.boolean().optional()).required(),
  output_matchtypes: joi.string().optional().required(),
  output_name: joi.array().items(joi.string()).required(),
  output_node: joi.boolean().required(),
  output_tooltips: joi.array().items(joi.string().optional()).required(),
  experimental: joi.boolean().required(),
  python_module: joi.string().required(),
});

export const validateObjectItemApiResponse = (data: unknown) => ObjectItemApiResponseSchema.validate(data);

const ObjectInfoApiResponseSchema = joi.object<ObjectInfoApiResponse, true>().pattern(/^/, ObjectItemApiResponseSchema);

export const validateObjectInfoApiResponse = (data: unknown) => ObjectInfoApiResponseSchema.validate(data);
