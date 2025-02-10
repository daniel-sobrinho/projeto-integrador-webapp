"use server"

import { cookies } from "next/headers"
import type { LoginData, RegisterData, AuthResponse } from "@/types/auth"

const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function login(data: LoginData): Promise<AuthResponse> {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  const json = await res.json()

  if (!res.ok) {
    throw new Error(json.error || "Erro ao fazer login")
  }

  cookies().set("token", json.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  })

  return json
}

export async function register(data: RegisterData): Promise<AuthResponse> {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  const json = await res.json()

  if (!res.ok) {
    throw new Error(json.error || "Erro ao registrar")
  }

  return json
}

export async function logout() {
  cookies().delete("token")
}

