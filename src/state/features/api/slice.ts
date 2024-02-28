import { BaseQueryApi, BaseQueryFn, createApi, FetchArgs } from '@reduxjs/toolkit/query/react';
import axios from 'axios';

import { NodeTypes } from '_state/features/workflow/types';

import { validateComponentsResponse } from './schemas';
import { transformHistory, transformObjectInfo } from './transform';
import { HistoryResponse, PromptRequest, PromptResponse } from './types';

const base = axios.create({
  baseURL: process.env.API_URL,
});

const axiosQuery: BaseQueryFn = async (
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions: { validate?: any },
) => {
  try {
    const response = await base.request({
      url: typeof args === 'string' ? args : args.url,
      method: typeof args === 'string' ? 'GET' : args.method,
      signal: api.signal,
      data: typeof args === 'string' ? undefined : args.body,
      responseType: 'json',
      transformResponse(payload) {
        const data = JSON.parse(payload);

        if (extraOptions?.validate) {
          if (!extraOptions.validate(data)) {
            throw extraOptions.validate.errors;
          }
        }

        return data;
      },
    });

    return { data: response.data };
  } catch (e: any) {
    return { error: e.response.data };
  }
};

const apiSlice = createApi({
  reducerPath: '@api',
  tagTypes: ['nodes', 'queue', 'history'],
  baseQuery: axiosQuery,
  endpoints: (builder) => ({
    getObjectInfo: builder.query<NodeTypes, void>({
      query: () => 'object_info',
      providesTags: [{ type: 'nodes', id: 'list' }],
      extraOptions: {
        validate: validateComponentsResponse,
      },
      transformResponse: transformObjectInfo,
    }),
    getHistory: builder.query<HistoryResponse, void>({
      query: () => 'history',
      providesTags: [{ type: 'history', id: 'list' }],
      extraOptions: {
        // validate: validateHistoryResponse,
      },
      transformResponse: transformHistory,
    }),
    getHistoryById: builder.query<HistoryResponse, string>({
      query: (id: string) => `history/${id}`,
      providesTags: (res, err, id) => [{ type: 'history', id }],
      extraOptions: {
        // validate: validateHistoryResponse,
      },
      transformResponse: transformHistory,
    }),
    getQueue: builder.query<any, void>({
      query: () => 'queue',
      providesTags: [{ type: 'queue', id: 'list' }],
      extraOptions: {
        // validate: validateQueueResponse,
      },
      // transformResponse: transformQueue,
    }),
    queuePrompt: builder.mutation<PromptResponse, PromptRequest>({
      query: (value) => ({
        url: 'prompt',
        method: 'POST',
        body: value,
      }),
      invalidatesTags: ['queue'],
    }),
  }),
});

export default apiSlice;

export const {
  useGetObjectInfoQuery,
  useLazyGetObjectInfoQuery,
  useGetHistoryQuery,
  useLazyGetHistoryQuery,
  useGetHistoryByIdQuery,
  useLazyGetHistoryByIdQuery,
  useGetQueueQuery,
  useLazyGetQueueQuery,
  useQueuePromptMutation,
  usePrefetch,
} = apiSlice;
