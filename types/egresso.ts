export interface Egresso {
  id: string
  nome: string
  email: string
  telefone: string
  curso: string
  anoFormatura: number
}

export type CreateEgressoData = Omit<Egresso, "id">
export type UpdateEgressoData = Partial<CreateEgressoData>

