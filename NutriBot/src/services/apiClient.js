const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

function normalizeDocument(document) {
  if (!document || typeof document !== 'object') {
    return document;
  }

  if (Array.isArray(document)) {
    return document.map(normalizeDocument);
  }

  const normalized = Object.fromEntries(
    Object.entries(document).map(([key, value]) => [key, normalizeDocument(value)]),
  );

  if (normalized._id && !normalized.id) {
    normalized.id = normalized._id;
  }

  return normalized;
}

export async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    let message = `API request failed with status ${response.status}`;

    try {
      const errorBody = await response.json();
      message = errorBody.message || message;
    } catch {
      // Keep the generic status message when the response body is not JSON.
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }

  return normalizeDocument(await response.json());
}
