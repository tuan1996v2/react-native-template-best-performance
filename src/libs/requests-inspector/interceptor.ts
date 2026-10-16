import { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

import { useNetworkStore } from './networkStore';
import { HttpMethod, ResponseDetails } from './types';

interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  _requestsInspectorId?: string;
  _requestsInspectorSentTime?: number;
}

const safeHeadersToRecord = (headers?: unknown): Record<string, string> => {
  if (!headers || typeof headers !== 'object') {
    return {};
  }

  const result: Record<string, string> = {};

  if ('toJSON' in headers && typeof (headers as { toJSON: () => unknown }).toJSON === 'function') {
    const json = (headers as { toJSON: () => Record<string, unknown> }).toJSON();
    Object.entries(json).forEach(([k, v]) => {
      if (v !== undefined && v !== null) {
        result[k] = String(v);
      }
    });
    return result;
  }

  Object.entries(headers as Record<string, unknown>).forEach(([k, v]) => {
    if (v !== undefined && v !== null) {
      result[k] = String(v);
    }
  });

  return result;
};

const resolveFullUrl = (baseURL?: string, url?: string): string => {
  if (!url) {
    return baseURL || '';
  }
  if (!baseURL || /^https?:\/\//i.test(url)) {
    return url;
  }
  return `${baseURL.replace(/\/+$/, '')}/${url.replace(/^\/+/, '')}`;
};

export const requestsInspectorAxiosInterceptor = {
  request: (config: ExtendedAxiosRequestConfig): ExtendedAxiosRequestConfig => {
    const isEnabled = useNetworkStore.getState().isEnabled;
    if (!isEnabled) {
      return config;
    }

    const fullUrl = resolveFullUrl(config.baseURL, config.url);
    const method = (config.method?.toUpperCase() || 'GET') as HttpMethod;
    const sentTime = Date.now();

    const id = useNetworkStore.getState().addRequest({
      url: fullUrl,
      method,
      headers: safeHeadersToRecord(config.headers),
      body: config.data,
      queryParameters: config.params,
      sentTime,
    });

    config._requestsInspectorId = id;
    config._requestsInspectorSentTime = sentTime;

    return config;
  },

  response: (response: AxiosResponse): AxiosResponse => {
    const isEnabled = useNetworkStore.getState().isEnabled;
    const config = response.config as ExtendedAxiosRequestConfig;
    const id = config?._requestsInspectorId;

    if (!isEnabled || !id) {
      return response;
    }

    const sentTime = config._requestsInspectorSentTime || Date.now();
    const receivedTime = Date.now();

    const responseDetails: ResponseDetails = {
      statusCode: response.status,
      headers: safeHeadersToRecord(response.headers),
      body: response.data,
      receivedTime,
      durationMs: receivedTime - sentTime,
    };

    useNetworkStore.getState().updateResponse(id, responseDetails);
    return response;
  },

  error: (error: AxiosError): Promise<never> => {
    const isEnabled = useNetworkStore.getState().isEnabled;
    const config = error.config as ExtendedAxiosRequestConfig | undefined;
    const id = config?._requestsInspectorId;

    if (isEnabled && id) {
      const sentTime = config?._requestsInspectorSentTime || Date.now();
      const receivedTime = Date.now();

      const responseDetails: ResponseDetails = {
        statusCode: error.response?.status || 0,
        headers: safeHeadersToRecord(error.response?.headers),
        body: error.response?.data,
        receivedTime,
        durationMs: receivedTime - sentTime,
        error: error.message || 'Network Request Failed',
      };

      useNetworkStore.getState().updateResponse(id, responseDetails);
    }

    return Promise.reject(error);
  },
};

export const attachRequestsInspector = (axiosInstance: AxiosInstance): void => {
  axiosInstance.interceptors.request.use(requestsInspectorAxiosInterceptor.request);
  axiosInstance.interceptors.response.use(
    requestsInspectorAxiosInterceptor.response,
    requestsInspectorAxiosInterceptor.error,
  );
};

export const requestsInspectorFetch = async (
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> => {
  const isEnabled = useNetworkStore.getState().isEnabled;
  if (!isEnabled) {
    return fetch(input, init);
  }

  const url = typeof input === 'string' ? input : input.toString();
  const method = (init?.method?.toUpperCase() || 'GET') as HttpMethod;
  const sentTime = Date.now();

  const headersRecord: Record<string, string> = {};
  if (init?.headers) {
    if (init.headers instanceof Headers) {
      init.headers.forEach((val, key) => {
        headersRecord[key] = val;
      });
    } else if (Array.isArray(init.headers)) {
      init.headers.forEach(([key, val]) => {
        headersRecord[key] = val;
      });
    } else {
      Object.entries(init.headers).forEach(([k, v]) => {
        if (v !== undefined) {
          headersRecord[k] = String(v);
        }
      });
    }
  }

  const id = useNetworkStore.getState().addRequest({
    url,
    method,
    headers: headersRecord,
    body: init?.body,
    sentTime,
  });

  try {
    const res = await fetch(input, init);
    const receivedTime = Date.now();

    const responseHeaders: Record<string, string> = {};
    res.headers.forEach((val, key) => {
      responseHeaders[key] = val;
    });

    let bodyData: unknown;
    try {
      const cloned = res.clone();
      const text = await cloned.text();
      try {
        bodyData = JSON.parse(text);
      } catch {
        bodyData = text;
      }
    } catch {
      bodyData = '[Unable to parse response body]';
    }

    useNetworkStore.getState().updateResponse(id, {
      statusCode: res.status,
      headers: responseHeaders,
      body: bodyData,
      receivedTime,
      durationMs: receivedTime - sentTime,
      error: res.ok ? undefined : `HTTP Error ${res.status}`,
    });

    return res;
  } catch (err: unknown) {
    const receivedTime = Date.now();
    const errorMsg = err instanceof Error ? err.message : 'Fetch Failed';

    useNetworkStore.getState().updateResponse(id, {
      statusCode: 0,
      headers: {},
      receivedTime,
      durationMs: receivedTime - sentTime,
      error: errorMsg,
    });

    throw err;
  }
};
