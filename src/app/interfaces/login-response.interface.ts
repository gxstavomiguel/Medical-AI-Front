export interface LoginResponse {
  success: boolean;
  message?: string;
  requires_password_change?: boolean;
  action_required?: string;
  access_token?: string;
  refresh_token?: string;
  token_type?: string;
  expires_in?: number;
  expires_at?: number;
  session?: {
    access_token?: string;
    refresh_token?: string;
    expires_at?: number;
    expires_in?: number;
  };
  user: {
    id: string;
    email: string;
    name: string | null;
    student_code?: string | null;
    avatar_url: string | null;
    role?: string;
    user_metadata?: {
      email_verified?: boolean;
      [k: string]: any;
    };
  };
  error?: {
    code: string;
    message: string;
    attempts_remaining?: number;
    retry_after_minutes?: number;
  };
}
