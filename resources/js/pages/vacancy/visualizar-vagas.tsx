import axios from 'axios';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { Button } from '@/components/ui/button';
import { Eye, Trash2, Plus, ChevronLeft, Pen } from 'lucide-react';
import { useEffect, useState } from 'react';
import { SharedData } from '@/types';
import { ScrollArea } from '@/components/ui/scroll-area'
import { AnimatePresence, motion } from 'framer-motion';

export default function CadastrarVaga() {
    const { auth } = usePage<SharedData>().props;
    
    const queryParams = new URLSearchParams(window.location.search);
    const processId = queryParams.get('id');

    const [vagas, setVagas] = useState<Array<{
        id_process: string;
        id: string;
        titulo: string;
        responsabilidades: string | null;
        requisitos: string | null;
        carga_horaria: string;
        remuneracao: number;
        beneficios: string | null;
        quantidade: number;
        data_inicio: string;
        data_fim: string;
        status: 'Aberto' | 'Fechado';
        tipo_vaga: 'Graduacao' | 'Pos-Graduacao';
    }>>([]);

    const [processo, setProcesso] = useState<{ descricao: string; numero_processo: string } | null>(null);

    useEffect(() => {
        // Busca as vagas do processo
        const fetchVacancy = async () => {
            try {
                const queryParams = new URLSearchParams(window.location.search);
                const processId = queryParams.get('id');

                const response = await axios.get(`http://localhost:8000/api/process/${processId}/vacancy`);
                setVagas(response.data);
            } catch (error) {
                console.error('Erro ao buscar cadastros reserva:', error);
            }
        };

        fetchVacancy();
    }, []);

    useEffect(() => {
        // Busca os dados do processo atual
        const fetchProcesso = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/process/${processId}`);
                setProcesso(response.data);
            } catch (error) {
                console.error('Erro ao carregar o processo:', error);
            }
        };

        if (processId) {
            fetchProcesso();
        }
    }, [processId]);


    const [modalFechar, setModalFechar] = useState<{ aberto: boolean; vagaId?: string }>({ aberto: false });
    const [modalSucesso, setModalSucesso] = useState(false); // 1. Novo estado

    async function handleDelete(vagaId: string) {
        const queryParams = new URLSearchParams(window.location.search);
        const processId = queryParams.get('id');
        const adminId = auth.user.id;

        if (!processId || !vagaId) {
            console.error('processId ou vagaId inválidos');
            return;
        }

        try {
            await fetch(`http://localhost:8000/api/admin/${adminId}/process/${processId}/vacancy/${vagaId}/delete`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            setModalFechar({ aberto: false }); // Fecha modal de confirmação
            setModalSucesso(true); // 2. Abre modal de sucesso
            // Remover a vaga da lista sem recarregar (opcional):
            setVagas(vagas => vagas.filter(v => v.id !== vagaId));
        } catch (error) {
            console.error('Erro ao excluir cadastro reserva:', error);
        }
    }

    // function setModalSucesso(arg0: boolean): void {
    //     throw new Error('Function not implemented.');
    // }

    return (
        <AppLayout>
            <Head title="Visualizar Cadastro Reserva" />

             {vagas.length === 0 ? (
        <>
         <div className="flex h-full max-h-full flex-1 flex-col  rounded-xl p-4">
        <nav className="text-sm text-muted-foreground mb-4">
                        <ol className="flex items-center space-x-2">
                            <li>
                                <Link href="/" className="hover:underline text-[#008DD0]">Início</Link>
                            </li>
                            <li>
                                <span className="mx-1 text-[#008DD0]">/</span>
                                <span className="font-medium text-[#008DD0]">Visualizar Cadastros Reserva</span>
                            </li>
                        </ol>
        </nav>
          {processo && (
            <div className=" pr-4 mt-4">
                <h2 className="text-2xl font-semibold">
                    {processo.descricao} - {processo.numero_processo}
                </h2>
            </div>
          )}

            <div className="flex h-full max-h-full flex-1 flex-col gap-4 rounded-xl pt-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative max-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min flex items-center justify-center">
                        <div className="text-center flex items-center justify-center h-full px-4">
                            <div className="tracking-wide max-w-md w-full break-words whitespace-normal">
                                <h2 className="text-xl font-semibold block leading-tight break-words">
                                No momento não há cadastros reserva cadastrado
                                </h2>
                                <hr className="mt-4 mb-4 w-full bg-[#008DD0] h-0.5" />
                                <p className="text-sm text-[#008DD0] mt-1">
                                Clique no botão para adicionar um cadastro reserva
                                </p>

                                {auth.user.tipo_perfil === 'Admin' && (
                                    <Link href={`/processo/cadastrar-vaga?id=${processId}`}>
                                        <Button className="p-4 sm:p-6 bg-[#008DD0] hover:bg-[#0072d0] mt-4 text-sm sm:text-base">
                                        Adicionar Cadastro Reserva <Plus />
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
             </>
            ) : (
                <>
                 <div className="flex h-full max-h-full flex-1 flex-col  rounded-xl p-4">
                    <nav className="text-sm text-muted-foreground mb-4">
                        <ol className="flex items-center space-x-2">
                            <li>
                                <Link href="/" className="hover:underline text-[#008DD0]">Início</Link>
                            </li>
                            <li>
                                <span className="mx-1 text-[#008DD0]">/</span>
                                <span className="font-medium text-[#008DD0]">Visualizar Cadastros Reserva</span>
                            </li>
                        </ol>
                    </nav>
                    <div className="max-w mx-auto w-full bg-white pt-0 pb-10">
                        <div className="mt-2 mb-1 w-fit">
                                <h1 className="text-2xl text-black">Adicione Cadastros Reserva ao Processo</h1>
                                <hr className="mt-1 bg-[#008DD0] h-0.5" />
                        </div>
                
                    {processo && (
                        <div className="flex items-center justify-between mt-4">
                                <h2 className="text-2xl">
                                    Processo {processo.numero_processo}
                                </h2>
                                <Link href={`/processo/cadastrar-vaga?id=${processId}`} className="w-fit">
                                    <Button className="flex items-center gap-2 rounded-md p-4 sm:p-6 bg-[#008DD0] hover:bg-[#0072d0] text-sm sm:text-base">
                                        Adicionar Cadastro Reserva <Plus />
                                    </Button>
                                </Link>
                        </div>
                    )}
                            <div className='container mt-5'>
                                <Table>
                                    <ScrollArea className="max-h-[400px] w-full rounded-md border border-[#008DD0] p-4 overflow-auto">
                                        <TableHeader>
                                            <TableRow>
                                            <TableHead className="sticky top-0 bg-white w-[400px] font-semibold">Cadastro Reserva</TableHead>
                                            <TableHead className="sticky top-0 bg-white text-center font-semibold">Status</TableHead>
                                            <TableHead className="sticky top-0 bg-white text-center font-semibold">Tipo</TableHead>
                                            <TableHead className="sticky top-0 bg-white text-center font-semibold">Quantidade</TableHead>
                                            <TableHead className="sticky top-0 bg-white text-center align-middle font-semibold">Opções</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {vagas
                                                .filter((vaga) => vaga.status === 'Aberto')
                                                .map((vaga) => (
                                                    <TableRow key={vaga.id}>
                                                        <TableCell className=" align-middle">{vaga.titulo}</TableCell>
                                                        <TableCell className="text-center align-middle">{vaga.status}</TableCell>
                                                        <TableCell className="text-center align-middle">{vaga.tipo_vaga}</TableCell>
                                                        <TableCell className="text-center align-middle">{vaga.quantidade}</TableCell>
                                                        <TableCell className="text-center space-x-2 align-middle">
                                                            <Link href={`/processo/vagas/editar?id-processo=${vaga.id_process}&id-vaga=${vaga.id}`}><Button className='bg-green-600 hover:bg-green-700'><Pen /> Editar</Button></Link>
                                                            <Button onClick={() => setModalFechar({ aberto: true, vagaId: vaga.id })} className='bg-red-600 hover:bg-red-700'><Trash2 /> Excluir</Button>
                                                            <Link href={`/processo/vagas/detalhes?id-processo=${vaga.id_process}&id-vaga=${vaga.id}`} ><Button className='bg-[#008DD0] hover:bg-[#0072d0]'><Eye /> Visualizar</Button></Link>
                                                            <AnimatePresence>
                                                                {modalFechar.aberto && modalFechar.vagaId === vaga.id && (
                                                                    <motion.div
                                                                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
                                                                        initial={{ opacity: 0 }}
                                                                        animate={{ opacity: 1 }}
                                                                        exit={{ opacity: 0 }}
                                                                        onClick={() => setModalFechar({ aberto: false })}
                                                                    >
                                                                        <motion.div
                                                                            className="bg-white w-full max-w-sm rounded-xl shadow-lg p-8 relative flex items-center"
                                                                            initial={{ scale: 0.9, opacity: 0 }}
                                                                            animate={{ scale: 1, opacity: 1 }}
                                                                            exit={{ scale: 0.9, opacity: 0 }}
                                                                            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                                                                            onClick={e => e.stopPropagation()}>
                                                                                <div>
                                                                                    <h2 className="text-xl font-semibold mb-4 text-red-600">Você tem certeza que deseja excluir este cadastro reserva?</h2>
                                                                                    <div className="flex gap-4 mt-2">
                                                                                        <button
                                                                                            className="mt-2 px-6 py-2 bg-[#008DD0] hover:bg-[#0072d0] text-white rounded shadow"
                                                                                            onClick={() => {
                                                                                                handleDelete(vaga.id);
                                                                                                setModalFechar({ aberto: false });
                                                                                            }}>
                                                                                            Confirmar
                                                                                        </button>
                                                                                        <button
                                                                                            className="mt-2 px-6 py-2 bg-gray-400 hover:bg-gray-600 text-white rounded shadow"
                                                                                            onClick={() => setModalFechar({ aberto: false })} >
                                                                                            Cancelar
                                                                                        </button>
                                                                                    </div>
                                                                                </div>
                                                                        </motion.div>
                                                                    </motion.div>
                                                                )}
                                                            </AnimatePresence>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                        </TableBody>
                                    </ScrollArea>
                                </Table>
                            </div>
                            <div className="mt-6 mb-6 py-2">
                                <Link className="w-full md:w-auto"href="/">
                                    <Button
                                        type="button"  className="flex items-center bg-[#808080] hover:bg-[#404040] gap-2 rounded-md px-4 py-2 text-sm shadow-md transition-colors duration-200 text-white">
                                        <ChevronLeft /> Voltar
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                    </>
            )}
            
        </AppLayout> 
    );
}