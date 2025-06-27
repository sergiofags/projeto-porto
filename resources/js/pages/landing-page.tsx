import axios from 'axios';
import React, { useEffect, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const LandingPage: React.FC = () => {
    const segments: string[] = [];

    const [abertoEditais, setAbertoEditais] = useState(true);
    const [abertoEncerrados, setAbertoEncerrados] = useState(false);

    const [processo, setProcesso] = useState<Array<{
        id: number;
        id_admin: number;
        descricao: string;
        status: 'Pendente' | 'Aberto' | 'Fechado';
        numero_processo: string;
        edital: string | null;
        data_inicio: string;
        data_fim: string | null;
    }>>([]);

    useEffect(() => {
        const fetchProcess = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/process`);
                setProcesso(response.data);

                console.log(response.data);

                setProcesso(
                    response.data.map((processo: any) => ({
                        ...processo,
                        data_inicio: processo.data_inicio ? processo.data_inicio.split("-").reverse().join("/") : null,
                        data_fim: processo.data_fim ? processo.data_fim.split("-").reverse().join("/") : null
                    }))
                );
                
            } catch (error) {
                alert(error)
                return;
            }
        }
        fetchProcess();
    });
        

    return (
        <>
            <AppLayout>
                <Head title="Início" />
                <div className="flex h-full max-h-full flex-1 flex-col gap-4 rounded-xl p-4">
                    {/* Breadcrumb */}
                    <nav className="text-sm text-muted-foreground mb-4">
                        <ol className="flex items-center space-x-2">
                            <li>
                                <Link href="/inicio-processo" className="hover:underline">Início</Link>
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

                    <main className="flex flex-col items-center">
                        <section className="max-w-4xl w-full mt-4 space-y-6">
                            <div>
                                <h1 className="text-xl font-semibold">Programa de estágio</h1>
                                <hr className="mt-4 mb-4 w-full bg-[#008DD0] h-0.5" />
                                <p className="text-md text-gray-700">
                                    São oferecidas oportunidades de estágio de ensino superior nas diversas áreas que formam a administração portuária (Comunicação, Compras, Engenharia, Financeiro, Jurídico, Licitações, Meio Ambiente, Operações Logísticas, Recursos Humanos e Segurança do Trabalho). A seleção para cadastro reserva de estágio é realizada via Edital. Confira abaixo os processos seletivos abertos:
                                </p>
                            </div>
                            {/* Accordion - Editais em aberto */}
                            <div className="border border-blue-300 rounded-xl p-4">
                                <div
                                    className="flex justify-between items-center cursor-pointer"
                                    onClick={() => setAbertoEditais(!abertoEditais)}>
                                    <h2 className="text-lg font-medium">Editais em aberto</h2>
                                    {abertoEditais ? <ChevronUp /> : <ChevronDown />}
                                </div>

                                {abertoEditais && (
                                    <div className="mt-4 space-y-6 transition-all duration-300">
                                        <div>
                                            {/* <h3 className="text-md font-semibold">
                                                {processo.length > 0 ? processo[0].numero_processo : ''}
                                            </h3> */}
                                            <ul className="space-y-4">
                                                {processo
                                                .filter((processo) => processo.status === 'Aberto')
                                                .map((processo) => (
                                                    <div key={processo.numero_processo}>
                                                        <div className="space-y-6 space-x-2">
                                                            <ul>   
                                                                <h3 className="font-semibold">{processo.descricao} - {processo.numero_processo}</h3>
                                                                <li className="list-disc list-inside text-blue-600 underline">
                                                                    <a
                                                                    href={`/storage/${processo.edital}`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer">
                                                                        {/* <Button className="p-4 sm:p-6 bg-blue-500 hover:bg-blue-600 text-sm sm:text-base"> */}
                                                                            {processo.edital ? 'Edital' : 'Edital'}
                                                                    </a>
                                                                </li>
                                                                <button className="mt-2 px-4 py-1 text-white bg-blue-500 rounded-full hover:bg-blue-600">
                                                                    <Link href={`/process/inicio-vaga?id=${processo.id}`}>Visualizar</Link>
                                                                </button>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                )}
                            </div>
                            

                            {/* Accordion - Editais encerrados */}
                            <div className="border border-blue-300 rounded-xl p-4">
                                <div
                                    className="flex justify-between items-center cursor-pointer"
                                    onClick={() => setAbertoEncerrados(!abertoEncerrados)}
                                >
                                    <h2 className="text-lg font-medium">Editais Encerrados</h2>
                                    {abertoEncerrados ? <ChevronUp /> : <ChevronDown />}
                                </div>

                                {abertoEncerrados && (
                                    <div className="mt-4 space-y-6 transition-all duration-300">
                                        {processo.filter(p => p.status === 'Fechado').length === 0 ? (
                                            <div className="text-gray-600">
                                                <p>Nenhum edital encerrado no momento.</p>
                                            </div>
                                            ) : (
                                            processo
                                            .filter(p => p.status === 'Fechado')
                                            .map((processo) => (
                                                <div key={processo.id} className="mb-4">
                                                    <h3 className="font-semibold">{processo.descricao} - {processo.numero_processo}</h3>
                                                    <ul className="list-disc list-inside text-blue-600 underline">
                                                        <li>
                                                            <a
                                                                href={`/storage/${processo.edital}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                            >
                                                                {processo.edital ? 'Edital' : 'Edital'}
                                                            </a>
                                                        </li>
                                                    </ul>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}
                            </div>
                        </section>
                    </main>
                </div>
            </AppLayout>
        </>
    );
};

export default LandingPage;