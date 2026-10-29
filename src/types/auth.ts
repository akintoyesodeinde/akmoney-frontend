export interface User {
  id: number;
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  mobile: string;
  country_name?: string;
  country_code?: string;
  balance?: string | number;
  kv: number; // 0=Unverified, 1=Verified, 2=Pending
  ev: number; // Email verified
  sv: number; // SMS verified
  tv: number; // 2FA verified
  ts: number; // 2FA enabled
  force_tfa?: number;
  has_pin?: boolean;
  created_at?: string;
}

export interface AuthResponse {
  remark?: string;
  status: string;
  message: {
    success?: string[];
    error?: string[];
  };
  data?: {
    access_token?: string;
    token_type?: string;
    user?: User;
  };
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface RegisterPayload {
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  mobile: string;
  country_code: string;
  password: string;
  password_confirmation: string;
}
