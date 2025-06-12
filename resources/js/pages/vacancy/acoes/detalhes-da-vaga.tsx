import axios from 'axios';
import AppLayout from '@/layouts/app-layout';
import { SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

export default function DetalhesVaga() {

    const { auth } = usePage<SharedData>().props;
    
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
                    const queryParams = new URLSearchParams(window.location.search);
                    const processId = queryParams.get('id-processo');
                    const vacancyId = queryParams.get('id-vaga');
    
                    console.log(processId)
    
                    const response = await axios.get(`http://localhost:8000/api/process/${processId}/vacancy/${vacancyId}`);

                    setVaga(Array.isArray(response.data) ? response.data : [response.data]);

                    console.log(response.data)

                } catch (error) {
                    console.error('Error fetching vacancy:', error);
                }
            };
    
            fetchVacancy();
        }, []);

    const queryParams = new URLSearchParams(window.location.search);
    const processId = queryParams.get('id-processo');

    return (
        <AppLayout>
            <Head title="Detalhes da Vaga" />
            <div className="flex flex-row gap-2">
                <Link href={`/processo/vagas?id=${processId}`} className="w-full">
                    <Button type="button" variant="secondary">
                        Voltar
                    </Button>
                </Link>
            </div>

            <div className="grid gap-4">
                <div className="border rounded p-4">
                
                    {vaga.map((item) => (
                        <div key={item.id}>
                            <h2 className="text-xl font-bold">{item.titulo}</h2>
                            <p><strong>Responsabilidades:</strong> {item.responsabilidades || 'Não informado'}</p>
                            <p><strong>Requisitos:</strong> {item.requisitos || 'Não informado'}</p>
                            <p><strong>Carga Horária:</strong> {item.carga_horaria}</p>
                            <p><strong>Remuneração:</strong> R$ {item.remuneracao.toFixed(2)}</p>
                            <p><strong>Benefícios:</strong> {item.beneficios || 'Não informado'}</p>
                            <p><strong>Quantidade:</strong> {item.quantidade}</p>
                            <p><strong>Data de Início:</strong> {item.data_inicio}</p>
                            <p><strong>Data de Fim:</strong> {item.data_fim}</p>
                            <p><strong>Status:</strong> {item.status}</p>
                            <p><strong>Tipo de Vaga:</strong> {item.tipo_vaga}</p>
                        </div>
                    ))}
                    
                </div>
            </div>
        </AppLayout> 
    );
}