import axios from 'axios';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from '@/components/ui/button';
import { BookText, List, Undo2, UserRoundSearch } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function VerCandidatos() {
    const queryParams = new URLSearchParams(window.location.search);
    const vancancyId = queryParams.get('id-vaga');
    const processId = queryParams.get('id-processo');

    const [candidatura, setCandidatura] = useState<Array<{
        id_person: string;
        id_vacancy: string;
        id_process: string;
        status: 'Cancelado' | 'Analise' | 'Completo';
        data_candidatura: string;
    }>>([]);

    const [person, setPerson] = useState<Array<{
        id_person: string;
        name: string;
        email: string;
        telefone: string;
        id_candidacy: string;
    }>>([]);

    useEffect(() => {
        const fetchVacancy = async () => {
            try {
                const responseCandidacy = await axios.get(`http://localhost:8000/api/vacancy/${vancancyId}/candidacy`);

                setCandidatura(responseCandidacy.data);

                console.log(responseCandidacy.data);

                const personsData = await Promise.all(
                    responseCandidacy.data.map(async (candidatura: any) => {
                        const responsePerson = await axios.get(`http://localhost:8000/api/person/${candidatura.id_person}`);
                        return { ...responsePerson.data, id_person: candidatura.id_person, id_candidacy: candidatura.id };
                    })
                );

                setPerson(personsData);

                setCandidatura(
                    responseCandidacy.data.map((candidatura: any) => ({
                        ...candidatura,
                        data_candidatura: candidatura.data_candidatura ? candidatura.data_candidatura.split("-").reverse().join("/") : null
                    }))
                );
                
            } catch (error) {
                console.log(error)
                return;
            }
        };

        fetchVacancy();
    }, []);

    return (
        <AppLayout>
            <Head title="Ver candidatos" />
            <Link href={`/processo/vagas/detalhes?id-processo=${processId}&id-vaga=${vancancyId}`}><Button><Undo2 /> Voltar</Button></Link>
            <h1 className='text-3xl'>Vagas Abertas</h1>
            <div className='container mt-5'>
                <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead className="w-[300px]">Candidato</TableHead>
                        <TableHead>E-mail</TableHead>
                        <TableHead>Telefone</TableHead>
                        <TableHead>Data candidatura</TableHead>
                        <TableHead className="text-center">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {person.map((pessoa) => (
                            <TableRow key={pessoa.id_person}>
                                <TableCell className="font-medium">{pessoa.name}</TableCell>
                                <TableCell>{pessoa.email}</TableCell>
                                <TableCell>{pessoa.telefone}</TableCell>
                                <TableCell>{candidatura.find(c => c.id_person === pessoa.id_person)?.data_candidatura}</TableCell>
                                <TableCell className="text-right space-x-2">
                                    <Link href={`/processo/vagas/ver-candidatos/candidato/notas?id-processo=${processId}&id-vaga=${vancancyId}&id-candidato=${pessoa.id_person}&id-candidatura=${pessoa.id_candidacy}`}>
                                        <Button className='bg-cyan-600 hover:bg-cyan-700 cursor-pointer'><List /> Notas</Button>
                                    </Link>
                                    <Link href={``}>
                                        <Button className='bg-blue-600 hover:bg-blue-700 cursor-pointer'><UserRoundSearch /> Entrevista</Button>
                                    </Link>
                                    <Link href={`/processo/vagas/ver-candidatos/candidato?id-processo=${processId}&id-vaga=${vancancyId}&id-candidato=${pessoa.id_person}`}>
                                        <Button className='bg-yellow-600 hover:bg-yellow-700 cursor-pointer'><BookText /> Candidatura</Button>
                                    </Link>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </AppLayout> 
    );
}
