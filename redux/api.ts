const BASE_URL = "https://bursary-platform-backend.fly.dev/api/v1";

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

  const data = await response.json();

  // Handle errors
  if (!response.ok) {
    throw new Error(data.detail || "Something went wrong");
  }

  return data;
};
