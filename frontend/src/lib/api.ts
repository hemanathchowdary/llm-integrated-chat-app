const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code: string;
    details?: unknown;
  };
  message?: string;
}

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    // Load token from localStorage on initialization
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        this.token = storedToken;
      }
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Request failed');
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  async put<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);

