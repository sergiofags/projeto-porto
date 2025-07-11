import axios from 'axios';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Pencil, Trash, Plus, ChevronLeft } from 'lucide-react';
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

type Curso = {
  id: string;
  nome: string;
};

export default function Cursos() {
  const queryParams = new URLSearchParams(window.location.search);
  const setorId = queryParams.get('id-setor');

  const [cursos, setCursos] = useState<Curso[]>([]);
  const { auth } = usePage<SharedData>().props;

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/courses/setor/${setorId}`);
        setCursos(response.data);
      } catch (error) {
        // Log de erro, mas não exibir erro para o usuário
        console.error(error);
      }
    };

    fetchCursos();
  }, [setorId]);

  const handleDelete = async (cursoId: string, name: string) => {
    const confirmDelete = window.confirm(`Tem certeza que deseja excluir o curso "${name}"?`);
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:8000/api/courses/${cursoId}`);
      setCursos(prev => prev.filter(c => c.id !== cursoId));
      alert('Curso excluído com sucesso!');
    } catch (error) {
      alert('Erro ao excluir curso');
    }
  };

  return (
    <AppLayout>
      <Head title="Cursos" />

      <div className="flex h-full max-h-full flex-1 flex-col gap-4 rounded-xl p-4">
        <nav className="text-sm text-muted-foreground mb-4 items-center">
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/" className="hover:underline text-[#008DD0]">Início</Link>
            </li>
            <li>
              <span className="mx-1 text-[#008DD0]">/</span>
              <Link href="/setores" className="hover:underline text-[#008DD0]">Setores</Link>
            </li>
            <li>
              <span className="mx-1 text-[#008DD0]">/</span>
              <span className="font-medium text-[#008DD0]">Visualizar Setor</span>
            </li>
          </ol>
        </nav>

        {/* Se não houver cursos, exibe a mensagem "Não há cursos cadastrados" */}
        {cursos.length === 0 ? (
          <div className="border relative max-h-[100vh] flex-1 overflow-hidden rounded-xl border-sidebar-border/70 flex items-center justify-center">
            <div className="text-center flex items-center justify-center h-full px-4">
              <div className="tracking-wide max-w-md w-full break-words whitespace-normal">
                <h2 className="text-xl font-semibold block leading-tight">
                  No momento não há cursos cadastrados
                </h2>
                <hr className="mt-4 mb-4 w-full bg-[#008DD0] h-0.5" />
                <p className="text-sm text-[#008DD0] mt-1">
                  Clique no botão para adicionar um curso
                </p>

                <Link href={`/setores/cursos/cadastrar?id-setor=${setorId}`}>
                  <Button className="p-4 sm:p-6 bg-[#008DD0] hover:bg-[#0072d0] mt-4 text-sm sm:text-base">
                    Adicionar curso <Plus className="ml-2" />
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
                        <TableHead className="sticky top-0 bg-white w-[500px] font-semibold">Curso</TableHead>
                        <TableHead className="sticky top-0 bg-white text-center font-semibold">Opções</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cursos.map((curso) => (
                        <TableRow key={curso.id}>
                          <TableCell>{curso.nome}</TableCell>
                          <TableCell>
                            <div className="flex gap-2 justify-center">
                              <Link href={`/setores/cursos/editar?id-curso=${curso.id}&id-setor=${setorId}`}>
                                <Button className="bg-green-600 hover:bg-green-700 text-xs">
                                  <Pencil /> Editar
                                </Button>
                              </Link>
                              <Button
                                onClick={() => handleDelete(curso.id, curso.nome)}
                                className="bg-red-600 hover:bg-red-700 text-xs"
                              >
                                <Trash /> Excluir
                              </Button>
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
              <Link href={`/setores/cursos/cadastrar?id-setor=${setorId}`}>
                <Button className="p-4 sm:p-6 bg-[#008DD0] hover:bg-[#0072d0] text-sm sm:text-base">
                  Adicionar curso <Plus className="ml-2" />
                </Button>
              </Link>
            </div>
          </>
        )}

        <div className="mt-6 mb-6 pl-2">
          <Link className="w-fit flex" href={`/setores`}>
            <Button className="flex items-center gap-2 rounded-md px-4 py-2 text-sm bg-gray-500 text-white shadow-xs hover:bg-gray-600">
              <ChevronLeft /> Voltar
            </Button>
          </Link>
        </div>
      </div>
    </AppLayout>
  );
}
