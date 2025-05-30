import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { SharedData, type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import TextLink from '@/components/text-link';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

import { Plus, ChevronLeft } from 'lucide-react';


'use client';

type Vaga = {
    id: number;
    titulo: string;
    data_inicio: Date;
};

type Props = {
    vagas?: Vaga[];
    processo: {
        descricao: string;
        numero_processo: string;
    };
};

export default function Inicio({ vagas = [] }: Props) {
    const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
    const segments = pathname.split('/').filter(Boolean);

    const [vacancy, setVacancy] = useState([]);

    useEffect(() => {
        async function getVacancy() {
            const url = "https://localhost:8000/api/vacancy";
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`Response status: ${response.status}`);
                }

                const json = await response.json();
                setVacancy(json);
            } catch (e) {
                console.log('Deu erro', e);
            }
        }

        getVacancy();
    }, []);
    

    return (
        <AppLayout>
            <Head title="Vagas" />
            
            <div className="flex h-full max-h-full flex-1 flex-col gap-4 rounded-xl p-4">
                
                <nav className="text-sm text-muted-foreground mb-4">
                    <ol className="flex items-center space-x-2">
                        <li>
                            <Link href="/inicio-processo" className="hover:underline">Processos</Link>
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

                </nav>

                

                <div className="border-sidebar-border/70 dark:border-sidebar-border relative max-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min flex items-center justify-center ">

                    {vagas.length === 0 ? (
                        <div className="text-center flex items-center justify-center h-full px-4">
                            <div className="tracking-wide max-w-md w-full break-words whitespace-normal">
                                <h2 className="text-xl font-semibold block leading-tight break-words">
                                No momento não há nenhum Cadastro Reserva vinculado neste processo
                                </h2>
                                <hr className="mt-4 mb-4 w-full h-0.5  bg-[#008DD0]" />
                                <p className="text-sm mt-1 text-[#008DD0]">
                                Clique no botão para adicionar um cadastro reserva
                                </p>
                                <Button className="p-4 sm:p-6 mt-4 text-sm sm:text-base bg-[#008DD0] hover:bg-[#0072d0]">
                                Adicionar cadastro reserva <Plus />
                                </Button>
                            </div>
                        </div>

                    ) : (
                        <div className="grid gap-4">
                            {vagas.map((vaga) => (
                                <div key={vaga.id} className="border rounded p-4">
                                    <h3 className="font-semibold">{vacancy.nome}</h3> {/* substitua por campo correto */}
                                    <p>{vacancy.titulo}</p>
                                    <p>{vacancy.data_inicio}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="absolute bottom-10 left-10">
                        <Link href="/inicio-processo">
                            <Button
                                className="flex items-center gap-2 rounded-md px-4 py-2 text-sm shadow-md transition-colors duration-200"
                                variant="voltar">
                                <ChevronLeft />
                                Voltar
                            </Button>
                        </Link>
                    </div>
                </div>
                
            </div>
        </AppLayout>
    );
}