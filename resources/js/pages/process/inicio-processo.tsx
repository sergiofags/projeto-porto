import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { SharedData, type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import TextLink from '@/components/text-link';

// import { BreadcrumbAuto } from '@/components/ui/breadcrumb-auto'
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Início',
        href: '/inicio-processo',
    },
];

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

export default function Inicio({ processos = [], user }: Props) {
    const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
    const segments = pathname.split('/').filter(Boolean);

    const [process, setProcess] = useState([]);
    const {auth}=usePage<SharedData>().props;
    //const [data] = useState({name: auth.user.name});
    const nomeCompleto = auth.user.name;
    const partes = nomeCompleto.trim().split(' ');
    const nome =partes[0];

    useEffect(() => {
        async function getProcess() {
            const url = "https://localhost:8000/api/process";
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`Response status: ${response.status}`);
                }

                const json = await response.json();
                setProcess(json);
            } catch (e) {
                console.log('Deu erro', e);
            }
        }

        getProcess();
    }, []);
    

    return (
        <AppLayout>
            <Head title="Início" />
            
            <div className="flex h-full max-h-full flex-1 flex-col gap-4 rounded-xl p-4">
                
                <nav className="text-sm text-muted-foreground mb-4">
                    <ol className="flex items-center space-x-2">
                        <li>
                            <Link href="/" className="hover:underline">Início</Link>
                        </li>
                        {segments.map((segment, index) => {
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

                {processos.length === 0 ? (
                    <div className="text-center flex items-center justify-center h-full px-4">
                        <div className="tracking-wide max-w-md w-full break-words whitespace-normal">
                            <h2 className="text-xl font-semibold block leading-tight text-black break-words">
                            No momento não há processos cadastrados
                            </h2>
                            <hr className="mt-4 mb-4 w-full bg-blue-600 h-0.5" />
                            <p className="text-sm text-blue-600 mt-1">
                            Clique no botão para adicionar um processo
                            </p>
                            <Button className="p-4 sm:p-6 bg-blue-600 hover:bg-blue-800 mt-4 text-sm sm:text-base">
                            Adicionar processo <span className="ml-1">＋</span>
                            </Button>
                        </div>
                    </div>

                ) : (
                    <div className="grid gap-4">
                        {processos.map((processo) => (
                            <div key={processo.id} className="border rounded p-4">
                                <h3 className="font-semibold">{process.nome}</h3> {/* substitua por campo correto */}
                                <p>{process.descricao}</p>
                                <p>{process.numero_processo}</p>
                            </div>
                        ))}
                    </div>
                )}
                </div>

            </div>
        </AppLayout>
    );
}
