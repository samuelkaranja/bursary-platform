const BASE_URL = "https://api.kandarabursary.com/api/v1";

export const apiFetch = async (
  endpoint: string,
  options: RequestInit = {},
  token?: string,
) => {
  // Use the Headers class to safely handle all header types
  const headers = new Headers(options.headers);

  // Set Content-Type if body is not FormData
  if (!(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  // Set Authorization if token is provided
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  // Make the fetch call
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const contentType = response.headers.get("content-type") || "";
  let data: any = null;

  if (contentType.includes("application/json")) {
    try {
      data = await response.json();
    } catch {
      data = null;
    }
  } else {
    const text = await response.text().catch(() => "");
    data = { detail: text };
  }

  if (!response.ok) {
    throw new Error(data?.detail || `Request failed (${response.status})`);
  }

  return data;
};
