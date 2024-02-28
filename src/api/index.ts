import axios from 'axios';

const base = axios.create({
  baseURL: process.env.API_URL,
});

export const getObjectInfo = async () => {
  const e = await base.get('/object_info', {
    responseType: 'json',
  });
  return e.data;
};

export const getImageView = async (filename: string, type: string, subfolder: string) => {
  const response = await base.get(
    `/view?filename=${encodeURIComponent(filename)}&type=${type}&subfolder=${subfolder}`,
    {
      responseType: 'blob',
    },
  );
  return response.data;
};

export const getPromptsQueue = async () => {
  const response = await base.get(`/prompt`, {
    responseType: 'json',
  });
  return response.data;
};

export const getQueue = async () => {
  const response = await base.get(`/queue`, {
    responseType: 'json',
  });
  return response.data;
};
