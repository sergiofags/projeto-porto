import axios from 'axios';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { SharedData, type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import TextLink from '@/components/text-link';


// import { BreadcrumbAuto } from '@/components/ui/breadcrumb-auto'
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

import { Eye, Pen, Plus } from 'lucide-react';


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
                
                <nav className="text-sm text-muted-foreground mb-4">
                    <ol className="flex items-center space-x-2">
                        <li>
                            <Link href="/inicio-processo" className="hover:underline">Processos</Link>
                        </li>
                        {segments.filter((seg, i) => !(i === 0 && seg === 'inicio-processo')).map((segment, index) => {
                            const href = '/' + segments.slice(0, index + 1).join('/');
                            const isLast = index === segments.length - 1;
                            const label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');

                            return (
                                <li key={href} className="flex items-center space-x-2">
                                    <span className="mx-1">/</span>
                                    {isLast ? (
                                        <span className="font-medium">{label}</span>
                                    ) : (
                                        <Link href={href} className="hover:underline">{label}</Link>
                                    )}
                                </li>
                            );
                        })}
                    </ol>

                    <h1 className="text-2xl font-semibold mt-4 text-black">Olá, {nome}.</h1>

                </nav>

                <div className="border-sidebar-border/70 dark:border-sidebar-border relative max-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min flex items-center justify-center ">

                {process.length === 0 ? (
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

                ) : (
                    <>
                        <div className="grid gap-4">
                            {process.map((processo) => (
                                <div key={processo.numero_processo} className="border rounded p-4">
                                    <h3 className="font-semibold">Descrição: {processo.descricao}</h3>
                                    <p>Status: {processo.status}</p>
                                    <p>Número Processo: {processo.numero_processo}</p>
                                    <p>Data Inicio: {processo.data_inicio}</p>
                                    <p>Data Fim: {processo.data_fim}</p>
                                    <div className="space-y-6 space-x-2">
                                        {auth.user.tipo_perfil === 'Admin' && (
                                            <div className="flex gap-2 mt-4">
                                                {processo.status !== 'Fechado' && (
                                                    <Link href={`/processo/cadastrar-vaga?id=${processo.id}`}>
                                                        <Button className="p-4 sm:p-6 bg-[#008DD0] hover:bg-[#0072d0] text-sm sm:text-base">
                                                            Cadastrar Vaga <Plus />
                                                        </Button>
                                                    </Link>
                                                )}
                                                <Link href={`/processo/vagas?id=${processo.id}`}>
                                                    <Button className="p-4 sm:p-6 bg-gray-500 hover:bg-gray-600 mt-4 text-sm sm:text-base">
                                                        Visualizar Vagas <Eye />
                                                    </Button>
                                                </Link>
                                            </div>
                                        )}
                                        <a
                                            href={`/storage/${processo.edital}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <Button className="p-4 sm:p-6 bg-blue-500 hover:bg-blue-600 text-sm sm:text-base">
                                                Visualizar
                                            </Button>
                                        </a>
                                        <Link href={`/process/edita-processo?id=${processo.id}`}>
                                            <Button className="p-4 sm:p-6 bg-green-500 hover:bg-green-600 text-sm sm:text-base">
                                                Editar
                                            </Button>
                                        </Link>
                                        {processo.status !== 'Fechado' && (
                                            <Button
                                                className="p-4 sm:p-6 bg-red-600 hover:bg-red-800 text-white"
                                                onClick={() => fecharProcesso(processo.id)}
                                            >
                                                Fechar
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {auth.user.tipo_perfil === 'Admin' && (
                                <Link href="/cadastra-processo">
                                    <Button className="p-4 sm:p-6 bg-[#008DD0] hover:bg-[#0072d0] mt-4 text-sm sm:text-base">
                                    Adicionar processo <Plus />
                                    </Button>
                                </Link>
                            )}
                        </div>
                        
                    </>
                )}
                </div>

            </div>
        </AppLayout>
    );
}
