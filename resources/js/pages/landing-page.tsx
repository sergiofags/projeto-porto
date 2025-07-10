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
                    

                    <main className="flex flex-col items-center">
                         <section className="max-w-7xl w-full mt-3 space-y-6">
                            <div >
                                <div className="mt-2 mb-3 w-fit">
                                    <h1 className="text-2xl text-black">Programa de Estágio</h1>
                                    <hr className="mt-1 bg-[#008DD0] h-0.5 " />
                                </div>

                                <p className="text-md text-gray-700">
                                    São oferecidas oportunidades de estágio de ensino superior nas diversas áreas que formam a administração portuária (Comunicação, Compras, Engenharia, Financeiro, Jurídico, Licitações, Meio Ambiente, Operações Logísticas, Recursos Humanos, Segurança do Trabalho e Tecnologia da Informação). A seleção para cadastro reserva de estágio é realizada via Edital. Confira abaixo os processos seletivos abertos:
                                </p>
                            </div>

                            {/* Accordion - Editais em aberto */}
                            <div className="border border-[#008DD0]  rounded-xl p-4">
                               <div>
                                <div
                                    className="flex justify-between items-center cursor-pointer"
                                    onClick={() => setAbertoEditais(!abertoEditais)}
                                >
                                    <div className="inline-block">
                                    <h2 className="text-lg font-medium inline-block">Editais em aberto</h2>
                                    <hr className="mt-2 h-0.5 bg-[#008DD0]" />
                                    </div>
                                    {abertoEditais ? <ChevronUp /> : <ChevronDown />}
                                </div>
                                </div>


                                {abertoEditais && (
                                    <div className="mt-4 space-y-6 transition-all duration-300">
                                        <div>
                                            {/* <h3 className="text-md font-semibold">
                                                {processo.length > 0 ? processo[0].numero_processo : ''}
                                            </h3> */}
                                            <ul className="space-y-4">
                                                {processo.filter((p) => p.status === 'Aberto').length === 0 ? (
                                                    <div className="text-gray-600">
                                                        <p>Nenhum edital aberto no momento.</p>
                                                    </div>
                                                ) : (
                                                    processo
                                                        .filter((p) => p.status === 'Aberto')
                                                        .map((processo) => (
                                                            <div key={processo.numero_processo}>
                                                                <div className="space-y-6 space-x-2">
                                                                    <ul>   
                                                                    <h3 >{processo.descricao} - {processo.numero_processo}</h3>
                                                                    <li className="list-disc list-inside text-black underline">
                                                                        <a className="text-black"
                                                                        href={`/storage/${processo.edital}`}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer">
                                                                            {/* <Button className="p-4 sm:p-6 bg-blue-500 hover:bg-blue-600 text-sm sm:text-base"> */}
                                                                                {processo.edital ? 'Edital' : 'Edital'}
                                                                        </a>
                                                                    </li>
                                                                    <button className="mt-2 px-4 py-1 text-white rounded-full bg-[#008DD0] hover:bg-[#145F7F]">
                                                                        <Link href={`/process/inicio-vaga?id=${processo.id}`}>Visualizar</Link>
                                                                    </button>
                                                                </ul>
                                                                </div>
                                                            </div>
                                                        ))
                                                )}
                                            </ul>
                                        </div>
                                    </div>
                                )}
                            </div>
                            

                            {/* Accordion - Editais encerrados */}
                              <div className="border border-[#008DD0]  rounded-xl p-4">
                                <div>
                                    <div
                                        className="flex justify-between items-center cursor-pointer"
                                        onClick={() => setAbertoEncerrados(!abertoEncerrados)}
                                    >
                                        <div className="inline-block">
                                        <h2 className="text-lg font-medium inline-block">Editais Encerrados</h2>
                                        <hr className="mt-2 h-0.5 bg-[#008DD0] mb-0" />
                                        </div>
                                        {abertoEncerrados ? <ChevronUp /> : <ChevronDown />}
                                    </div>
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