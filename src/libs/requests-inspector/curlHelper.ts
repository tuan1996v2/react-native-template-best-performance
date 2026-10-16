import { NetworkLog } from './types';

export const generateCurlCommand = (log: NetworkLog): string => {
  let url = log.url;

  // Append query parameters if any and not already in URL
  if (log.queryParameters && Object.keys(log.queryParameters).length > 0) {
    const hasQuery = url.includes('?');
    const queryString = Object.entries(log.queryParameters)
      .map(([key, val]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(val ?? ''))}`)
      .join('&');

    if (!hasQuery) {
      url = `${url}?${queryString}`;
    }
  }

  const parts: string[] = [`curl -X ${log.method.toUpperCase()} "${url}"`];

  // Headers
  if (log.headers) {
    Object.entries(log.headers).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        const sanitizedValue = String(value).replace(/"/g, '\\"');
        parts.push(`  -H "${key}: ${sanitizedValue}"`);
      }
    });
  }

  // Body
  if (
    log.body !== undefined &&
    log.body !== null &&
    log.method !== 'GET' &&
    log.method !== 'HEAD'
  ) {
    let bodyString: string;
    if (typeof log.body === 'string') {
      bodyString = log.body;
    } else {
      try {
        bodyString = JSON.stringify(log.body);
      } catch {
        bodyString = String(log.body);
      }
    }

    if (bodyString) {
      // Escape single quotes for bash safe argument
      const escapedBody = bodyString.replace(/'/g, "'\\''");
      parts.push(`  --data '${escapedBody}'`);
    }
  }

  return parts.join(' \\\n');
};
