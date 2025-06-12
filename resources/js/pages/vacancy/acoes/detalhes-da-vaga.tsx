import axios from 'axios';
import AppLayout from '@/layouts/app-layout';
import { SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

export default function DetalhesVaga() {

    const { auth } = usePage<SharedData>().props;
    const queryParams = new URLSearchParams(window.location.search);
    const processId = queryParams.get('id-processo');
    const vacancyId = queryParams.get('id-vaga');
    const adminId = auth.user.id;
    
        const [vaga, setVaga] = useState<Array<{
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
    
        useEffect(() => {
            const fetchVacancy = async () => {
                try {
                    const response = await axios.get(`http://localhost:8000/api/process/${processId}/vacancy/${vacancyId}`);

                    if (!response.data) {
                        return;
                    }

                    setVaga(Array.isArray(response.data) ? response.data : [response.data]);

                    setVaga([{
                        ...response.data,
                        data_inicio: response.data.data_inicio.split("-").reverse().join("/"),
                        data_fim: response.data.data_fim ? response.data.data_fim.split("-").reverse().join("/") : null
                    }])

                } catch (error) {
                    alert(error)
                    return;
                }
            };
    
            fetchVacancy();
        }, []);

        async function handleDelete(vagaId: string) {
            if (!processId || !vagaId) {
                alert("Id do processo ou vaga inválido")
                return;
            }
    
            try {
                const selectedVaga = vaga.find((v: { id: string; titulo: string }) => v.id === vagaId);
                if (!selectedVaga || !confirm(`Você tem certeza que deseja deletar a vaga "${selectedVaga.titulo}"?`)) {
                    return;
                }
                await axios.delete(`http://localhost:8000/api/admin/${adminId}/process/${processId}/vacancy/${vagaId}/delete`);
                alert("Vaga deletada com sucesso!")
                window.location.href = `/processo/vagas?id=${processId}`;
    
            } catch (error) {
                return error;
            }
        }

    return (
        <AppLayout>
            <Head title="Detalhes da Vaga" />

            <div className="grid gap-4 p-4">
                <div className="border rounded p-4 pl-10 pr-10">
                
                    {vaga.map((item) => (
                        <div key={item.id}>
                            <h1 className="text-3xl  mt-6">{item.titulo}</h1>

                            <div className="flex flex-col sm:flex-row gap-2 mt-6 mb-6">
                                <Button type="button" className="flex-1 p-4 sm:p-6 bg-[#008DD0] hover:bg-[#0072d0] mt-4 text-sm">
                                    <Link href={``} className="w-full">
                                    Ver candidatos
                                    </Link>
                                </Button>
                                <Button type="button" className="flex-1 p-4 sm:p-6  bg-[#008DD0] hover:bg-[#0072d0] mt-4 text-sm ">
                                    <Link href={``} className="w-full">
                                    Classificação
                                    </Link>
                                </Button>
                                <Button type="button" className="flex-1 p-4 sm:p-6 bg-green-500 hover:bg-green-600 mt-4 text-sm ">
                                    <Link href={`/processo/vagas/editar?id-processo=${item.id_process}&id-vaga=${item.id}`} className="w-full">
                                    Editar
                                    </Link>
                                </Button>
                                <Button type="button" className="flex-1 p-4 sm:p-6  bg-red-600 hover:bg-red-800 mt-4 text-sm ">
                                    <Link href="#" onClick={() => handleDelete(item.id)} className="w-full">
                                    Fechar
                                    </Link>
                                </Button>
                            </div>

                            <h1 className="text-xl"><strong>Responsabilidades:</strong></h1>
                            <p>{item.responsabilidades || 'Não informado'}</p>
                            
                            <br></br>
                            <h1 className="text-xl"><strong>Requisitos:</strong></h1>
                            <p>{item.requisitos || 'Não informado'}</p>

                            {/* <p><strong>Carga Horária:</strong> <br></br>{item.carga_horaria}</p>
                            <p><strong>Remuneração:</strong> <br></br>R$ {item.remuneracao.toFixed(2)}</p> */}
                            <br></br>
                            <h1 className="text-xl"><strong>Benefícios:</strong></h1>
                            <p>{item.beneficios || 'Não informado'}</p>

                            <br></br>
                            {/* <p><strong>Quantidade:</strong> <br></br>{item.quantidade}</p> */}
                            <h1 className="text-xl"><strong>Data de Início:</strong></h1>
                            <p>{item.data_inicio}</p>

                            <br></br>
                            <h1 className="text-xl"><strong>Data de Fim:</strong></h1>
                            <p>{item.data_fim}</p>

                            <br></br>
                            <h1 className="text-xl"><strong>Status:</strong></h1>
                            <p>{item.status}</p>

                            <br></br>
                            <h1 className="text-xl"><strong>Tipo de Vaga:</strong></h1>
                            <p>{item.tipo_vaga}</p>
                        </div>
                    ))}
                    

                    <div className="mt-6 mb-6">
                        <Link className="w-fit flex" href={`/processo/vagas?id=${processId}`}>
                            <Button
                                className="flex items-center gap-2 rounded-md px-4 py-2 text-sm duration-200 bg-gray-500 text-white shadow-xs hover:bg-gray-600">
                                <ChevronLeft /> Voltar
                            </Button>
                        </Link>
                    </div>
                </div>

            </div>
        </AppLayout> 
    );
}