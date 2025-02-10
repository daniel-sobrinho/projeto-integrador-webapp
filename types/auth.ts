export interface LoginData {
  email: string
  senha: string
}

export interface RegisterData extends LoginData {}

export interface AuthResponse {
  token: string
  message?: string
}

