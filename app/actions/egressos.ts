"use server"

import { cookies } from "next/headers"
import type { Egresso, CreateEgressoData, UpdateEgressoData } from "@/types/egresso"

const API_URL = process.env.NEXT_PUBLIC_API_URL

async function getAuthHeader() {
  const token = cookies().get("token")
  if (!token) {
    throw new Error("401: Não autorizado")
  }
  return {
    Authorization: `Bearer ${token.value}`,
    "Content-Type": "application/json",
  }
}

export async function getEgressos(): Promise<Egresso[]> {
  const res = await fetch(`${API_URL}/egressos`, {
    headers: await getAuthHeader(),
  })

  const json = await res.json()

  if (!res.ok) {
    throw new Error(json.error || "Erro ao buscar egressos")
  }

  return json
}

export async function getEgresso(id: string): Promise<Egresso> {
  const res = await fetch(`${API_URL}/egressos/${id}`, {
    headers: await getAuthHeader(),
  })

  const json = await res.json()

  if (!res.ok) {
    throw new Error(json.error || "Erro ao buscar egresso")
  }

  return json
}

export async function createEgresso(data: CreateEgressoData): Promise<Egresso> {
  const res = await fetch(`${API_URL}/egressos`, {
    method: "POST",
    headers: await getAuthHeader(),
    body: JSON.stringify(data),
  })

  const json = await res.json()

  if (!res.ok) {
    throw new Error(json.error || "Erro ao criar egresso")
  }

  return json
}

export async function updateEgresso(id: string, data: UpdateEgressoData): Promise<Egresso> {
  const res = await fetch(`${API_URL}/egressos/${id}`, {
    method: "PUT",
    headers: await getAuthHeader(),
    body: JSON.stringify(data),
  })

  const json = await res.json()

  if (!res.ok) {
    throw new Error(json.error || "Erro ao atualizar egresso")
  }

  return json
}

export async function deleteEgresso(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/egressos/${id}`, {
    method: "DELETE",
    headers: await getAuthHeader(),
  })

  if (!res.ok) {
    const json = await res.json()
    throw new Error(json.error || "Erro ao deletar egresso")
  }
}

