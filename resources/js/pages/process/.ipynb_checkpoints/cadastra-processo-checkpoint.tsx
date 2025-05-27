import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { SharedData, type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import TextLink from '@/components/text-link';

// import { BreadcrumbAuto } from '@/components/ui/breadcrumb-auto'
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

// const breadcrumbs: BreadcrumbItem[] = [
//     {
//         title: 'Cadastrar Processo',
//         href: '/cadastra-processo',
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
            <Head title="Cadastrar Processo" />
            
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
                    <div className="absolute top-0 left-0 m-4">
                        <div className="tracking-wide max-w-md w-full break-words whitespace-normal">
                            <h2 className="text-xl font-semibold block leading-tight text-black break-words">
                            Cadastre o Processo
                            </h2>
                            <hr className="mt-4 mb-4 w-full bg-blue-600 h-0.5" /> {/* linha azul */}
                            <form>
                                <div className="mb-3">
                                    <label htmlFor="descricao" className="block text-sm font-medium text-gray-700">
                                        Descrição:
                                    </label>
                                    <input type='text' id="descricao" name="descricao" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" placeholder="Ex: Edital de Processo Seletivo de Estágio a descrição do processo" div style={{width: '100%', paddingLeft: 10, paddingRight: 10, paddingTop: 20, paddingBottom: 20, background: 'white', boxShadow: '0px 4px 4px rgba(32, 127, 205, 0.43)', borderRadius: 10, border: '1px #207FCD solid'}} />

                                    <label htmlFor="num_processo" className="block text-sm font-medium text-gray-700">
                                        Número do Processo:
                                    </label>
                                    <input type='text' id="descricao" name="descricao" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" placeholder="Ex: N°001/2025" div style={{width: '100%', paddingLeft: 10, paddingRight: 10, paddingTop: 20, paddingBottom: 20, background: 'white', boxShadow: '0px 4px 4px rgba(32, 127, 205, 0.43)', borderRadius: 10, border: '1px #207FCD solid'}} />

                                    <label htmlFor="edital" className="block text-sm font-medium text-gray-700">
                                        Edital:
                                    </label>
                                    <input type='file' id="edital" name="edital" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" placeholder="" div style={{width: '100%', paddingLeft: 10, paddingRight: 10, paddingTop: 20, paddingBottom: 20, background: 'white', boxShadow: '0px 4px 4px rgba(32, 127, 205, 0.43)', borderRadius: 10, border: '1px #207FCD solid'}} />

                                    <label htmlFor="data_ini" className="block text-sm font-medium text-gray-700">
                                        Data início inscrições:
                                    </label>
                                    <input type='date' id="data_ini" name="data_ini" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" placeholder="" div style={{width: '100%', paddingLeft: 10, paddingRight: 10, paddingTop: 20, paddingBottom: 20, background: 'white', boxShadow: '0px 4px 4px rgba(32, 127, 205, 0.43)', borderRadius: 10, border: '1px #207FCD solid'}} />

                                    <label htmlFor="data_fim" className="block text-sm font-medium text-gray-700">
                                        Data fim inscrições:
                                    </label>
                                    <input type='date' id="data_fim" name="data_fim" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" placeholder="" div style={{width: '100%', paddingLeft: 10, paddingRight: 10, paddingTop: 20, paddingBottom: 20, background: 'white', boxShadow: '0px 4px 4px rgba(32, 127, 205, 0.43)', borderRadius: 10, border: '1px #207FCD solid'}} />
                                    
                                </div>
                            </form>
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
