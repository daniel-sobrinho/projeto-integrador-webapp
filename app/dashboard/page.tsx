"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getEgressos, createEgresso, updateEgresso, deleteEgresso } from "../actions/egressos"
import { logout } from "../actions/auth"
import type { Egresso, CreateEgressoData } from "@/types/egresso"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PhoneInput } from "@/components/ui/phone-input"

export default function DashboardPage() {
  const router = useRouter()
  const [egressos, setEgressos] = useState<Egresso[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingEgresso, setEditingEgresso] = useState<Egresso | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [egressoToDelete, setEgressoToDelete] = useState<Egresso | null>(null)

  useEffect(() => {
    loadEgressos()
  }, [])

  async function loadEgressos() {
    try {
      const data = await getEgressos()
      setEgressos(data)
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao carregar egressos",
        variant: "destructive",
      })
      if (error instanceof Error && error.message.includes("401")) {
        router.push("/login")
      }
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    try {
      const formData = new FormData(event.currentTarget)
      const data: CreateEgressoData = {
        nome: formData.get("nome") as string,
        email: formData.get("email") as string,
        telefone: formData.get("telefone") as string,
        curso: formData.get("curso") as string,
        anoFormatura: Number(formData.get("anoFormatura")),
      }

      if (editingEgresso) {
        await updateEgresso(editingEgresso.id, data)
        toast({
          title: "Sucesso!",
          description: "Egresso atualizado com sucesso",
        })
      } else {
        await createEgresso(data)
        toast({
          title: "Sucesso!",
          description: "Egresso criado com sucesso",
        })
      }

      setDialogOpen(false)
      setEditingEgresso(null)
      loadEgressos()
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao salvar egresso",
        variant: "destructive",
      })
    }
  }

  async function handleDelete(egresso: Egresso) {
    try {
      await deleteEgresso(egresso.id)
      toast({
        title: "Sucesso!",
        description: "Egresso excluído com sucesso",
      })
      loadEgressos()
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao excluir egresso",
        variant: "destructive",
      })
    } finally {
      setDeleteDialogOpen(false)
      setEgressoToDelete(null)
    }
  }

  async function handleLogout() {
    await logout()
    router.push("/login")
  }

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Carregando...</div>
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Egressos</h1>
        <div className="space-x-2">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingEgresso(null)}>Novo Egresso</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingEgresso ? "Editar Egresso" : "Novo Egresso"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome</Label>
                  <Input id="nome" name="nome" defaultValue={editingEgresso?.nome} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" defaultValue={editingEgresso?.email} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <PhoneInput 
                    id="telefone" 
                    name="telefone" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="curso">Curso</Label>
                  <Input id="curso" name="curso" defaultValue={editingEgresso?.curso} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="anoFormatura">Ano de Formatura</Label>
                  <Input
                    id="anoFormatura"
                    name="anoFormatura"
                    type="number"
                    defaultValue={editingEgresso?.anoFormatura}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  {editingEgresso ? "Atualizar" : "Criar"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
          <Button variant="outline" onClick={handleLogout}>
            Sair
          </Button>
        </div>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente o egresso{" "}
              <span className="font-semibold">{egressoToDelete?.nome}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => egressoToDelete && handleDelete(egressoToDelete)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Telefone</TableHead>
            <TableHead>Curso</TableHead>
            <TableHead>Ano de Formatura</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {egressos.map((egresso) => (
            <TableRow key={egresso.id}>
              <TableCell>{egresso.nome}</TableCell>
              <TableCell>{egresso.email}</TableCell>
              <TableCell>{egresso.telefone}</TableCell>
              <TableCell>{egresso.curso}</TableCell>
              <TableCell>{egresso.anoFormatura}</TableCell>
              <TableCell>
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingEgresso(egresso)
                      setDialogOpen(true)
                    }}
                  >
                    Editar
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={() => {
                      setEgressoToDelete(egresso)
                      setDeleteDialogOpen(true)
                    }}
                  >
                    Excluir
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

