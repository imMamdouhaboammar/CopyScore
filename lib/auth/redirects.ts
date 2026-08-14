/**
 * Validates a redirect URL to prevent Open Redirect attacks.
 * Only relative application paths starting with '/' (and not '//') are allowed.
 */
export function getSafeRedirectUrl(nextUrl?: string | null, defaultUrl: string = '/'): string {
  if (!nextUrl) return defaultUrl;

  try {
    const trimmed = nextUrl.trim();
    // Reject absolute URLs (http://, https://, //evil.com, javascript:, data:)
    if (
      trimmed.startsWith('//') ||
      trimmed.startsWith('\\\\') ||
      /^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(trimmed)
    ) {
      return defaultUrl;
    }

    // Must start with single slash
    if (trimmed.startsWith('/')) {
      return trimmed;
    }

    return defaultUrl;
  } catch {
    return defaultUrl;
  }
}
