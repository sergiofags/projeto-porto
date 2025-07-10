import axios from 'axios';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Eye, Pen, Plus, Trash2 } from 'lucide-react';

type Setor = {
    id: string;
    nome: string;
};

export default function Setores() {

    const [setores, setSetores] = useState<Setor[]>([]);

    useEffect(() => {
        const fetchSetores = async () => {
          try {
            const response = await axios.get(`http://localhost:8000/api/setores`);

            setSetores(response.data);

          } catch (error) {
            alert(error);
          }
        };
    
        fetchSetores();
      }, []);
    
    const handleDelete = async (setorId: string, name: string) => {
        const confirmDelete = window.confirm(`Tem certeza que deseja excluir o setor "${name}"?`);
        if (!confirmDelete) {
            return;
        }

        try {
            await axios.delete(`http://localhost:8000/api/setores/${setorId}`);

            setSetores(prev => prev.filter(s => s.id !== setorId));

            alert("Setor excluído com sucesso!");

        } catch (error) {
            alert(error);
        }
    };

    return (
    <AppLayout>
        <Head title="Setores" />

        <div className="container mt-5 pl-2 pr-2">
            {setores.length === 0 ? (
                <div className='text-center'>
                    <h2 className="text-xl font-semibold block leading-tight break-words">
                        No momento não há setores cadastrados
                    </h2>
                    <hr className="mt-4 mb-4 w-full bg-[#008DD0] h-0.5" />
                    <p className="text-sm text-[#008DD0] mt-1">
                        Clique no botão para adicionar um setor
                    </p>
                </div>
            ) : (
                <Table>
                    <ScrollArea className="max-h-[400px] w-full rounded-md border border-[#008DD0] p-4 overflow-auto">
                    <TableHeader>
                        <TableRow>
                        <TableHead className="sticky top-0 bg-white font-semibold">Nome</TableHead>
                        <TableHead className="sticky top-0 bg-white text-center align-middle font-semibold">Opções</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {setores.map((setor) => (
                        <TableRow key={setor.id}>
                            <TableCell>{setor.nome}</TableCell>
                            <TableCell>
                            <div className='flex gap-2 justify-end'>
                                <Link href={`/setores/editar?id-setor=${setor.id}`}><Button className='bg-green-600 hover:bg-green-700'><Pen /> Editar</Button></Link>
                                <Button onClick={() => handleDelete(setor.id, setor.nome)} className='bg-red-600 hover:bg-red-700'><Trash2 /> Excluir</Button>
                                <Link href={`/setores/cursos?id-setor=${setor.id}`}><Button className='bg-blue-600 hover:bg-blue-700'><Eye /> Vizualizar</Button></Link>
                            </div>
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                    </ScrollArea>
                </Table>
            )}
        </div>

        <div className="flex justify-center mt-6 mb-4">
            <Link href="/setores/cadastrar">
                <Button className="p-4 sm:p-6 bg-[#008DD0] hover:bg-[#0072d0] text-sm sm:text-base">
                    Adicionar setor <Plus className="ml-2" />
                </Button>
            </Link>
        </div>

        <div className="mt-6 mb-6 pl-2">
            <Link className="w-fit flex" href={`/`}>
                <Button
                    className="flex items-center gap-2 rounded-md px-4 py-2 text-sm duration-200 bg-gray-500 text-white shadow-xs hover:bg-gray-600">
                    <ChevronLeft /> Voltar
                </Button>
            </Link>
        </div>
            
    </AppLayout>
)};