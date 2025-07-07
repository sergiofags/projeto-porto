import axios from 'axios';
//import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
//import { SharedData, type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
//import TextLink from '@/components/text-link';
import { Pencil, Trash, TableOfContents, FileDown} from 'lucide-react';


// import { BreadcrumbAuto } from '@/components/ui/breadcrumb-auto'
import { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

import { Plus } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { SharedData } from '@/types';
import { AnimatePresence, motion } from 'framer-motion';

// const breadcrumbs: BreadcrumbItem[] = [
//     {
//         title: 'Início',
//         href: '/inicio-processo',
//     },
// ];

type Processo = {
    id: number;
    nome: string;
    descricao: string;
};

type Props = {
    processos?: Processo[];
    user?: {
        name: string;
    };
};

export default function Inicio({ processos = [] }: Props) {
    const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
    const segments = pathname.split('/').filter(Boolean);
    
    const {auth}=usePage<SharedData>().props;
    //const [data] = useState({name: auth.user.name});
    const nomeCompleto = auth.user.name;
    const partes = nomeCompleto.trim().split(' ');
    const nome =partes[0];

    function formatarData(dataISO: string) {
        const [ano, mes, dia] = dataISO.split('-');
        return `${dia}/${mes}/${ano}`;
    }


    const [process, setProcess] = useState<Array<{
        id: string;
        descricao: string;
        status: string;
        numero_processo: string;
        edital: string;
        data_inicio: string;
        data_fim: string;
    }>>([]);

    useEffect(() => {
        const fetchProcess = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/process`);
                setProcess(response.data);
                console.log(response.data)
            } catch (error) {
                console.error('Error fetching process:', error);
            }
        };

        fetchProcess();
    }, []);
   // Estado para modal de confirmação
    const [modalFechar, setModalFechar] = useState<{ aberto: boolean; processoId: string | null }>({ aberto: false, processoId: null });
    // Estado para modal de sucesso
    const [modalSucesso, setModalSucesso] = useState(false);

    // Função para fechar o processo
    const fecharProcesso = async (processoId: string) => {
        try {
            const adminId = auth.user.id;
            const formData = new FormData();
            formData.append('_method', 'PUT');
            formData.append('status', 'Fechado');

            // Busca os dados atuais do processo para enviar os campos obrigatórios
            const resGet = await fetch(`/api/process/${processoId}`);
            const dados = await resGet.json();

            formData.append('descricao', dados.descricao);
            formData.append('numero_processo', dados.numero_processo);
            formData.append('data_inicio', dados.data_inicio);
            formData.append('data_fim', dados.data_fim ?? '');
            // Não precisa enviar edital novamente

            const res = await fetch(`/api/admin/${adminId}/process/${processoId}`, {
                method: 'POST',
                body: formData,
                credentials: 'include',
            });

            if (res.ok) {
                // Atualiza a lista de processos após fechar
                setProcess(process.map(p =>
                    p.id === processoId ? { ...p, status: 'Fechado' } : p
                ));
                setModalSucesso(true); // Abre o modal de sucesso
            } else {
                alert('Erro ao fechar processo');
            }
        } catch {
            alert('Erro ao conectar com o servidor');
        }
    };

    return (
    <AppLayout>
        <Head title="Início" />

        <div className="flex h-full max-h-full flex-1 flex-col gap-4 rounded-xl p-4">
            <nav className="text-sm text-muted-foreground mb-4 items-center">
                <ol className="flex items-center space-x-2">
                   <li>
                        <Link href="/" className="hover:underline text-[#008DD0]">Início</Link>
                    </li>
                </ol>
                <h1 className="text-2xl font-semibold mt-4 text-black">Olá, {nome}.</h1>
            </nav>

            {/* VERIFICA SE TEM PROCESSOS */}
            {process.length === 0 ? (
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative max-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min flex items-center justify-center">
                    <div className="text-center flex items-center justify-center h-full px-4">
                        <div className="tracking-wide max-w-md w-full break-words whitespace-normal">
                            <h2 className="text-xl font-semibold block leading-tight break-words">
                                No momento não há processos cadastrados
                            </h2>
                            <hr className="mt-4 mb-4 w-full bg-[#008DD0] h-0.5" />
                            <p className="text-sm text-[#008DD0] mt-1">
                                Clique no botão para adicionar um processo
                            </p>

                            {auth.user.tipo_perfil === 'Admin' && (
                                <Link href="/cadastra-processo">
                                    <Button className="p-4 sm:p-6 bg-[#008DD0] hover:bg-[#0072d0] mt-4 text-sm sm:text-base">
                                        Adicionar processo <Plus />
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    {/* Nova Estrutura da Tabela de Processos */}
                    <div className="max-w mx-auto w-full bg-white pt-0 pb-10">
                        <div className="container mt-5 ">
                            <Table>
                                <ScrollArea className="max-h-[400px] w-full rounded-md border border-[#008DD0] p-4 overflow-auto">
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="sticky top-0 bg-white w-[500px] font-semibold">Processo</TableHead>
                                            <TableHead className="sticky top-0 bg-white font-semibold">Data Início</TableHead>
                                            <TableHead className="sticky top-0 bg-white font-semibold">Data Fim</TableHead>
                                            <TableHead className="sticky top-0 bg-white font-semibold">Status</TableHead>
                                            <TableHead className="sticky top-0 bg-white text-center align-middle font-semibold">Opções</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {[...process]
                                            .sort((a, b) => {
                                                const ordemStatus = ['Pendente', 'Aberto', 'Fechado'];
                                                return ordemStatus.indexOf(a.status) - ordemStatus.indexOf(b.status);
                                            })
                                            .map((processo) => (
                                                <TableRow key={processo.numero_processo}>
                                                    <TableCell>{processo.descricao} Nº {processo.numero_processo}</TableCell>
                                                    <TableCell>{formatarData(processo.data_inicio)}</TableCell>
                                                    <TableCell>{formatarData(processo.data_fim)}</TableCell>
                                                    <TableCell className={`font-semibold ${
                                                        processo.status === 'Aberto'
                                                            ? 'text-[#20CD4E]'
                                                            : processo.status === 'Pendente'
                                                            ? 'text-yellow-600'
                                                            : 'text-red-600'
                                                    }`}>
                                                        {processo.status}
                                                    </TableCell>
                                                    <TableCell className="text-center space-x-2 align-middle">
                                                        {auth.user.tipo_perfil === 'Admin' && (
                                                            <>
                                                                <Link href={`/process/edita-processo?id=${processo.id}`}>
                                                                    <Button className=" bg-green-600 hover:bg-green-700 text-xs">
                                                                        <Pencil /> Editar
                                                                    </Button>
                                                                </Link>
                                                                {processo.status !== 'Fechado' && (
                                                                    <Button
                                                                        className="bg-red-600 hover:bg-red-700 text-xs"
                                                                        onClick={() => setModalFechar({ aberto: true, processoId: processo.id })}
                                                                    >
                                                                        <Trash /> Fechar
                                                                    </Button>
                                                                )}
                                                            </>
                                                        )}
                                                        <Link href={`/processo/vagas?id=${processo.id}`}>
                                                            <Button className="bg-[#008DD0] hover:bg-[#0072d0] text-xs">
                                                                <TableOfContents /> Visualizar
                                                            </Button>
                                                        </Link>
                                                        <a
                                                            href={`/storage/${processo.edital}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            <Button className="bg-[#CD5C20] hover:bg-[#943400] text-xs">
                                                                <FileDown /> Edital
                                                            </Button>
                                                        </a>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                    </TableBody>
                                </ScrollArea>
                            </Table>
                        </div>
                    </div>

                    {/* Botão Adicionar Processo */}
                    {auth.user.tipo_perfil === 'Admin' && (
                        <div className="flex justify-center mt-6 mb-4">
                            <Link href="/cadastra-processo">
                                <Button className="p-4 sm:p-6 bg-[#008DD0] hover:bg-[#0072d0] text-sm sm:text-base">
                                    Adicionar processo <Plus className="ml-2" />
                                </Button>
                            </Link>
                        </div>
                    )}
                </>
            )}
        </div>

<AnimatePresence>
                    {modalFechar.aberto && (
                        <motion.div
                            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setModalSucesso(false)}
                        >
                            <motion.div
                                className="bg-white w-full max-w-sm rounded-xl shadow-lg p-8 relative flex items-center"
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                                onClick={e => e.stopPropagation()}>
                                    <div>
                                        <h2 className="text-xl font-semibold mb-4 text-red-600">Você tem certeza que deseja fechar este processo?</h2>
                                        <div className="flex gap-4 mt-2">
                                            <button
                                                className="mt-2 px-6 py-2 bg-[#008DD0] hover:bg-[#0072d0] text-white rounded shadow"
                                                onClick={async () => {
                                                    if (modalFechar.processoId) {
                                                        await fecharProcesso(modalFechar.processoId);
                                                    }
                                                    setModalFechar({ aberto: false, processoId: null });
                                                }}
                                            >
                                                Confirmar
                                            </button>
                                            <button
                                                className="mt-2 px-6 py-2 bg-gray-400 hover:bg-gray-600 text-white rounded shadow"
                                                onClick={() => setModalFechar({ aberto: false, processoId: null })}
                                            >
                                                Cancelar
                                            </button>
                                        </div>
                                    </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Modal de sucesso */}
                <AnimatePresence>
                    {modalSucesso && (
                        <motion.div
                            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setModalSucesso(false)}
                        >
                            <motion.div
                                className="bg-white w-full max-w-sm rounded-xl shadow-lg p-8 relative flex flex-col items-center"
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                                onClick={e => e.stopPropagation()}>
                                <h2 className="text-xl font-semibold mb-4 text-green-600">Processo encerrado com sucesso!</h2>
                                <button
                                    className="mt-2 px-6 py-2 bg-[#008DD0] hover:bg-[#0072d0] text-white rounded shadow"
                                    onClick={() => router.visit(route('inicio-processo'))}>Concluir
                                </button>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
    </AppLayout>
)};