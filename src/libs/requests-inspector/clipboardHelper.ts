import { Clipboard } from 'react-native';

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    if (!text) {
      return false;
    }

    // Try optional dynamic import for @react-native-clipboard/clipboard
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const CommunityClipboard = require('@react-native-clipboard/clipboard');
      const clipboardLib = CommunityClipboard.default || CommunityClipboard;
      if (clipboardLib && typeof clipboardLib.setString === 'function') {
        clipboardLib.setString(text);
        return true;
      }
    } catch {
      // Ignore and fallback to React Native core Clipboard
    }

    if (Clipboard && typeof Clipboard.setString === 'function') {
      Clipboard.setString(text);
      return true;
    }

    return false;
  } catch {
    return false;
  }
};

export const extractAuthToken = (headers?: Record<string, string>): string | null => {
  if (!headers) {
    return null;
  }

  for (const [key, value] of Object.entries(headers)) {
    if (key.toLowerCase() === 'authorization' && typeof value === 'string') {
      const trimmed = value.trim();
      return trimmed.replace(/^Bearer\s+/i, '').trim();
    }
  }

  return null;
};
