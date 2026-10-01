import type { AxiosResponse } from 'axios';
import axiosInstance from '.';

// Public configuration/home widgets only; search, CAPTCHA and mutations bypass this cache.
const entries = new Map<string, { until: number; response: AxiosResponse }>();
const pending = new Map<string, Promise<AxiosResponse>>();
const clone = (response: AxiosResponse) => ({ ...response, data: structuredClone(response.data) });
export async function cachedPublicGet(url: string): Promise<AxiosResponse> {
  const key = `${axiosInstance.defaults.baseURL}|${url}`;
  const entry = entries.get(key);
  if (entry && entry.until > Date.now()) return clone(entry.response);
  entries.delete(key);
  let request = pending.get(key);
  if (!request) {
    request = axiosInstance.get(url).then(response => {
      if (entries.size >= 48) entries.delete(entries.keys().next().value!);
      entries.set(key, { until: Date.now() + 30_000, response: clone(response) });
      return response;
    }).finally(() => pending.delete(key));
    pending.set(key, request);
  }
  return clone(await request);
}
