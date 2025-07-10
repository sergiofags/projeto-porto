import axios from 'axios';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from '@/components/ui/button';
import { BookText, List, Undo2, UserRoundSearch, ChevronLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area'

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
                    responseCandidacy.data.map(async (candidatura: { id_person: string; id: string }) => {
                        const responsePerson = await axios.get(`http://localhost:8000/api/person/${candidatura.id_person}`);
                        return { ...responsePerson.data, id_person: candidatura.id_person, id_candidacy: candidatura.id };
                    })
                );

                setPerson(personsData);

                setCandidatura(
                    responseCandidacy.data.map((candidatura: { id_person: string; id: string; data_candidatura: string }) => ({
                        ...candidatura,
                        data_candidatura: candidatura.data_candidatura ? candidatura.data_candidatura.split("-").reverse().join("/") : null
                    }))
                );
                
            } catch (error) {
                return error;
            }
        };

        fetchVacancy();
    }, [vancancyId]);

    return (
        <AppLayout>
            <Head title="Ver candidatos" />
            
            <div className="flex h-full max-h-full flex-1 flex-col  rounded-xl p-4">
            <nav className="text-sm text-muted-foreground ">
                <ol className="flex items-center space-x-2">
                    <li>
                        <Link href="/" className="hover:underline text-[#008DD0]">Início</Link>
                    </li>
                    <li>
                        <span className=" text-[#008DD0]">/</span>
                        <span className="text-[#008DD0]">Visualizar Cadastros Reserva</span>
                    </li>
                    <li>
                        <span className=" text-[#008DD0] mx-1 ">/</span>
                        <span className=" text-[#008DD0]">Visualizar Detalhes do Cadastro Reserva</span>
                    </li>
                    <li>
                        <span className=" text-[#008DD0] mx-1 ">/</span>
                        <span className="font-medium text-[#008DD0]">Ver Candidatos</span>
                    </li>
                </ol>
            </nav>
            <div className="mt-2 mb-1 w-fit">
                <h1 className="text-2xl text-black">Candidatos</h1>
                <hr className="mt-1 bg-[#008DD0] h-0.5 " />
            </div>
            <div className='container mt-5 pr-2'>
                <Table>
                    <ScrollArea className="max-h-[500px] w-full rounded-md border border-[#008DD0] p-4 overflow-auto">
                        <TableHeader className="sticky top-0 bg-white">
                            <TableRow>
                            <TableHead className="sticky top-0 bg-white w-[300px]">Candidato</TableHead>
                            <TableHead className="sticky top-0 bg-white">E-mail</TableHead>
                            <TableHead className="sticky top-0 bg-white">Telefone</TableHead>
                            <TableHead className="sticky top-0 bg-white">Data candidatura</TableHead>
                            <TableHead className="sticky top-0 bg-white text-center">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {person.map((pessoa) => (
                                <TableRow key={pessoa.id_person}>
                                    <TableCell>{pessoa.name}</TableCell>
                                    <TableCell>{pessoa.email}</TableCell>
                                    <TableCell>{pessoa.telefone}</TableCell>
                                    <TableCell>{candidatura.find(c => c.id_person === pessoa.id_person)?.data_candidatura}</TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Link href={`/processo/vagas/ver-candidatos/candidato/notas?id-processo=${processId}&id-vaga=${vancancyId}&id-candidato=${pessoa.id_person}&id-candidatura=${pessoa.id_candidacy}`}>
                                            <Button className='bg-cyan-600 hover:bg-cyan-700 cursor-pointer'><List /> Notas</Button>
                                        </Link>
                                        <Link
                                        href={`/entrevista-candidato?nome=${encodeURIComponent(pessoa.name)}&email=${encodeURIComponent(pessoa.email)}&telefone=${encodeURIComponent(pessoa.telefone)}&id-candidatura=${pessoa.id_candidacy}&id-processo=${processId}&id-vaga=${vancancyId}`}
                                        >
                                        <Button className='bg-blue-600 hover:bg-blue-700 cursor-pointer'>
                                            <UserRoundSearch /> Entrevista
                                        </Button>
                                        </Link>
                                        <Link href={`/processo/vagas/ver-candidatos/candidato?id-processo=${processId}&id-vaga=${vancancyId}&id-candidato=${pessoa.id_person}`}>
                                            <Button className='bg-yellow-600 hover:bg-yellow-700 cursor-pointer'><BookText /> Candidatura</Button>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </ScrollArea>
                </Table>

                <div className="mt-6 mb-6">
                    <Link className="w-fit flex" href={`/processo/vagas/detalhes?id-processo=${processId}&id-vaga=${vancancyId}`}>
                        <Button
                            className="flex items-center rounded-md px-4 py-2 text-sm duration-200 bg-gray-500 text-white shadow-xs hover:bg-gray-600">
                            <ChevronLeft /> Voltar
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
        </AppLayout> 
    );
}