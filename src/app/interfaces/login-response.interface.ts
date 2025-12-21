export interface LoginResponse {
  success: boolean;
  requires_password_change: boolean;
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  expires_at: number;
  user: {
    id: string;
    email: string;
    name: string | null;
    avatar_url: string | null;
    role: string;
  };
  message?: string;
  error?: {
    code: string;
    message: string;
    attempts_remaining?: number;
    retry_after_minutes?: number;
  };
}
