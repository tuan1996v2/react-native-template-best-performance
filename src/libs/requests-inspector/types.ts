import React from 'react';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';

export interface RequestDetails {
  id: string;
  url: string;
  method: HttpMethod;
  headers: Record<string, string>;
  body?: unknown;
  queryParameters?: Record<string, string>;
  sentTime: number;
}

export interface ResponseDetails {
  statusCode: number;
  headers: Record<string, string>;
  body?: unknown;
  receivedTime: number;
  durationMs: number;
  error?: string;
}

export interface NetworkLog extends RequestDetails {
  response?: ResponseDetails;
  status: 'pending' | 'success' | 'error';
}

export type FilterType = 'ALL' | 'ERROR' | 'SUCCESS';

export interface RequestsInspectorProps {
  children: React.ReactNode;
  enabled?: boolean;
}
