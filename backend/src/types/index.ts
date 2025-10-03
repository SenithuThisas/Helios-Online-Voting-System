export * from './auth.types';
export * from './election.types';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: Array<{ field: string; message: string }>;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface SocketEvent {
  event: string;
  data: any;
}

export interface ErrorResponse {
  success: false;
  error: string;
  message: string;
  statusCode: number;
  stack?: string;
}
