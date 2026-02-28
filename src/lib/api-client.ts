// ═══════════════════════════════════════════════════════════════════════════
// API Client — Centralized HTTP client for Laravel backend
// ═══════════════════════════════════════════════════════════════════════════

const API_BASE_URL = "/api";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000";

// ─── Types ───────────────────────────────────────────────────────────────

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  status: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

// ─── CSRF Cookie (Sanctum) ───────────────────────────────────────────────

let csrfInitialised = false;

/**
 * Fetch the Sanctum CSRF cookie.
 * Only performs the request once per page session.
 */
export async function ensureCsrfCookie(): Promise<void> {
  if (csrfInitialised) return;
  await fetch(`${BACKEND_URL}/sanctum/csrf-cookie`, {
    credentials: "include",
  });
  csrfInitialised = true;
}

// ─── Error Handling ──────────────────────────────────────────────────────

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    const error: ApiError = {
      message: body.message || `Request failed with status ${response.status}`,
      errors: body.errors,
      status: response.status,
    };
    throw error;
  }
  return response.json();
}

// ─── HTTP Methods ────────────────────────────────────────────────────────

function buildHeaders(): HeadersInit {
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
}

export const apiClient = {
  async get<T>(path: string, params?: Record<string, string>): Promise<T> {
    const url = new URL(`${API_BASE_URL}${path}`, window.location.origin);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) url.searchParams.set(key, value);
      });
    }
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: buildHeaders(),
      credentials: "include",
    });
    return handleResponse<T>(response);
  },

  async post<T>(path: string, body?: unknown): Promise<T> {
    await ensureCsrfCookie();
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: "POST",
      headers: buildHeaders(),
      credentials: "include",
      body: body ? JSON.stringify(body) : undefined,
    });
    return handleResponse<T>(response);
  },

  async put<T>(path: string, body?: unknown): Promise<T> {
    await ensureCsrfCookie();
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: "PUT",
      headers: buildHeaders(),
      credentials: "include",
      body: body ? JSON.stringify(body) : undefined,
    });
    return handleResponse<T>(response);
  },

  async delete<T = void>(path: string): Promise<T> {
    await ensureCsrfCookie();
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: "DELETE",
      headers: buildHeaders(),
      credentials: "include",
    });
    return handleResponse<T>(response);
  },
};
