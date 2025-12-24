import { BaseQueryApi, BaseQueryFn, createApi, FetchArgs } from '@reduxjs/toolkit/query/react';
import axios from 'axios';

import { NodeTypes } from '_state/features/workflow/types';

import { HistoryEntries } from '../history/types';

import { validateObjectInfoApiResponse } from './schemas';
import { transformHistory, transformObjectInfo } from './transform';
import { PromptRequest, PromptResponse } from './types';

const base = axios.create({
  baseURL: location.toString(),
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
    throw e?.response?.data ? { error: e.response.data } : e;
  }
};

const apiSlice = createApi({
  reducerPath: '@api',
  tagTypes: ['nodes', 'queue', 'history', 'system_stats', 'metadata'],
  baseQuery: axiosQuery,
  endpoints: (builder) => ({
    getObjectInfo: builder.query<NodeTypes, void>({
      query: () => 'object_info',
      providesTags: [{ type: 'nodes', id: 'list' }],
      extraOptions: {
        validate: validateObjectInfoApiResponse,
      },
      transformResponse: transformObjectInfo,
    }),
    getHistory: builder.query<HistoryEntries, void>({
      query: () => 'history',
      providesTags: [{ type: 'history', id: 'list' }],
      extraOptions: {
        // validate: validateHistoryResponse,
      },
      transformResponse: transformHistory,
    }),
    getHistoryById: builder.query<HistoryEntries, string>({
      query: (id: string) => `history/${id}`,
      providesTags: (res, err, id) => [{ type: 'history', id }],
      extraOptions: {
        // validate: validateHistoryResponse,
      },
      transformResponse: transformHistory,
    }),
    getSystemStats: builder.query<any, void>({
      query: () => 'system_stats',
      providesTags: [{ type: 'system_stats' }],
    }),
    getMetadata: builder.query<any, { folder: string; filename: string }>({
      query: ({ folder, filename }) => ({ url: `view_metadata/${folder}?filename=${filename}` }),
      providesTags: (res, err, { folder, filename }) => [{ type: 'system_stats', id: `${folder}/${filename}` }],
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
    clearQueue: builder.mutation<PromptResponse, void>({
      query: () => ({
        url: 'prompt',
        method: 'POST',
        body: { clear: true },
      }),
      invalidatesTags: ['queue'],
    }),
    removeFromQueue: builder.mutation<PromptResponse, string[]>({
      query: (list) => ({
        url: 'prompt',
        method: 'POST',
        body: { delete: list },
      }),
      invalidatesTags: ['queue'],
    }),
    interrupt: builder.mutation<PromptResponse, string | void>({
      query: (id) => ({
        url: 'interrupt',
        method: 'POST',
        body: id ? { prompt_id: id } : undefined,
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
