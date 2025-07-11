import axios from 'axios';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Pencil, Trash, Eye, Plus, ChevronLeft } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SharedData } from '@/types';

type Setor = {
  id: string;
  nome: string;
};

export default function Setores() {
  const [setores, setSetores] = useState<Setor[]>([]);
  const { auth } = usePage<SharedData>().props;

  useEffect(() => {
    const fetchSetores = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/setores');
        setSetores(response.data);
      } catch (error) {
        alert('Erro ao carregar setores');
      }
    };
    fetchSetores();
  }, []);

  const handleDelete = async (setorId: string, name: string) => {
    const confirmDelete = window.confirm(`Tem certeza que deseja excluir o setor "${name}"?`);
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:8000/api/setores/${setorId}`);
      setSetores(prev => prev.filter(s => s.id !== setorId));
      alert('Setor excluído com sucesso!');
    } catch (error) {
      alert('Erro ao excluir setor');
    }
  };

  const nome = auth.user.name?.split(' ')[0];

  return (
    <AppLayout>
      <Head title="Setores" />

      <div className="flex h-full max-h-full flex-1 flex-col gap-4 rounded-xl p-4">
        <nav className="text-sm text-muted-foreground mb-4 items-center">
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/" className="hover:underline text-[#008DD0]">Início</Link>
            </li>
            <li>
              <span className="mx-1 text-[#008DD0]">/</span>
              <span className="font-medium text-[#008DD0]">Setores</span>
            </li>
          </ol>
        </nav>

        {setores.length === 0 ? (
          <div className="border relative max-h-[100vh] flex-1 overflow-hidden rounded-xl border-sidebar-border/70 flex items-center justify-center">
            <div className="text-center flex items-center justify-center h-full px-4">
              <div className="tracking-wide max-w-md w-full break-words whitespace-normal">
                <h2 className="text-xl font-semibold block leading-tight">
                  No momento não há setores cadastrados
                </h2>
                <hr className="mt-4 mb-4 w-full bg-[#008DD0] h-0.5" />
                <p className="text-sm text-[#008DD0] mt-1">
                  Clique no botão para adicionar um setor
                </p>

                <Link href="/setores/cadastrar">
                  <Button className="p-4 sm:p-6 bg-[#008DD0] hover:bg-[#0072d0] mt-4 text-sm sm:text-base">
                    Adicionar setor <Plus className="ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="max-w mx-auto w-full bg-white pt-0 pb-10">
              <div className="container mt-5">
                <Table>
                  <ScrollArea className="max-h-[400px] w-full rounded-md border border-[#008DD0] p-4 overflow-auto">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="sticky top-0 bg-white w-[500px] font-semibold">Setor</TableHead>
                        <TableHead className="sticky top-0 bg-white text-center font-semibold">Opções</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {setores.map((setor) => (
                        <TableRow key={setor.id}>
                          <TableCell>{setor.nome}</TableCell>
                          <TableCell>
                            <div className="flex gap-2 justify-center">
                              <Link href={`/setores/editar?id-setor=${setor.id}`}>
                                <Button className="bg-green-600 hover:bg-green-700 text-xs">
                                  <Pencil /> Editar
                                </Button>
                              </Link>
                              <Button
                                onClick={() => handleDelete(setor.id, setor.nome)}
                                className="bg-red-600 hover:bg-red-700 text-xs"
                              >
                                <Trash /> Excluir
                              </Button>
                              <Link href={`/setores/cursos?id-setor=${setor.id}`}>
                                <Button className="bg-[#008DD0] hover:bg-[#0072d0] text-xs">
                                  <Eye /> Visualizar
                                </Button>
                              </Link>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </ScrollArea>
                </Table>

              </div>
            </div>

            <div className="flex justify-center mt-6 mb-4">
              <Link href="/setores/cadastrar">
                <Button className="p-4 sm:p-6 bg-[#008DD0] hover:bg-[#0072d0] text-sm sm:text-base">
                  Adicionar setor <Plus className="ml-2" />
                </Button>
              </Link>
            </div>
          </>
        )}

        <div className="mt-6 mb-6 pl-2">
          <Link className="w-fit flex" href={`/`}>
            <Button className="flex items-center gap-2 rounded-md px-4 py-2 text-sm bg-gray-500 text-white shadow-xs hover:bg-gray-600">
              <ChevronLeft /> Voltar
            </Button>
          </Link>
        </div>
      </div>
    </AppLayout>
  );
}
