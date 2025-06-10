import axios from 'axios';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { Button } from '@/components/ui/button';
import { Eye, Pen, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { SharedData } from '@/types';


export default function CadastrarVaga() {
    const { auth } = usePage<SharedData>().props;

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

    useEffect(() => {
        const fetchVacancy = async () => {
            try {
                const queryParams = new URLSearchParams(window.location.search);
                const processId = queryParams.get('id');

                console.log(processId)

                const response = await axios.get(`http://localhost:8000/api/process/${processId}/vacancy`);
                setVagas(response.data);
                console.log(response.data)
            } catch (error) {
                console.error('Error fetching vacancy:', error);
            }
        };

        fetchVacancy();
    }, []);

    console.log(vagas)

    // Route::delete('/admin/{adminId}/process/{processId}/vacancy/{vacancyId}/delete', [VacancyController::class, 'delete'])->name('vacancy.delete');//Deleta uma vaga

    async function handleDelete(vagaId: string) {
        const queryParams = new URLSearchParams(window.location.search);
        const processId = queryParams.get('id');
        const adminId = auth.user.id;

        if (!processId || !vagaId) {
            console.error('Invalid processId or vagaId');
            return;
        }

        try {
            const response = await fetch(`http://localhost:8000/api/admin/${adminId}/process/${processId}/vacancy/${vagaId}/delete`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            console.log('Delete successful:', response);
            window.location.reload();
        } catch (error) {
            console.error('Error deleting vacancy:', error);
        }
    }

    return (
        <AppLayout>
            <Head title="Visualizar Vaga" />
            <h1 className='text-3xl'>Vagas Abertas</h1>
            <div className='container mt-5'>
                <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead className="w-[500px]">Vaga</TableHead>
                        <TableHead>Data Inicio</TableHead>
                        <TableHead>Data Fim</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {vagas
                            .filter((vaga) => vaga.status === 'Aberto')
                            .map((vaga) => (
                                <TableRow key={vaga.id}>
                                    <TableCell className="font-medium">{vaga.titulo}</TableCell>
                                    <TableCell>{vaga.data_inicio}</TableCell>
                                    <TableCell>{vaga.data_fim}</TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Link href={`/processo/vagas/editar?id-processo=${vaga.id_process}&id-vaga=${vaga.id}`}><Button><Pen /> Editar</Button></Link>
                                        <Button onClick={() => handleDelete(vaga.id)} className='bg-red-600 hover:bg-red-700'><Trash2 /> Fechar</Button>
                                        <Link href={`/processo/vagas/detalhes?id-processo=${vaga.id_process}&id-vaga=${vaga.id}`}><Button className='bg-green-600 hover:bg-green-700'><Eye /> Visualizar</Button></Link>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </div>

            <h1 className='text-3xl mt-10'>Vagas Fechadas</h1>
            <div className='container mt-5'>
                <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead className="w-[500px]">Vaga</TableHead>
                        <TableHead>Data Inicio</TableHead>
                        <TableHead>Data Fim</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {vagas
                            .filter((vaga) => vaga.status === 'Fechado')
                            .map((vaga) => (
                                <TableRow key={vaga.id}>
                                    <TableCell className="font-medium">{vaga.titulo}</TableCell>
                                    <TableCell>{vaga.data_inicio}</TableCell>
                                    <TableCell>{vaga.data_fim}</TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Link href={`/processo/vagas/editar?id-processo=${vaga.id_process}&id-vaga=${vaga.id}`}><Button><Pen /> Editar</Button></Link>
                                        <Button onClick={() => handleDelete(vaga.id)} className='bg-red-600 hover:bg-red-700'><Trash2 /> Fechar</Button>
                                        <Link href={`/processo/vagas/detalhes?id-processo=${vaga.id_process}&id-vaga=${vaga.id}`}><Button className='bg-green-600 hover:bg-green-700'><Eye /> Visualizar</Button></Link>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </div>
        </AppLayout> 
    );
}