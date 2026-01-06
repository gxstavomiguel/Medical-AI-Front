export type UserRole = 'student' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  avatar_url: string | null;
  student_code: string | null;
  role: UserRole;
  requires_password_change: boolean;
  created_at: string;
  updated_at: string;
}
