import axios from 'axios';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from '@/components/ui/button';
import { BookText, Undo2 } from 'lucide-react';
import { useEffect, useState } from 'react';

type Candidatura = {
    id: string;
    id_person: string;
    id_vacancy: string;
    id_process: string;
    status: 'Cancelado' | 'Analise' | 'Completo';
    data_candidatura: string;
};

type Person = {
    id_person: string;
    name: string;
    email: string;
    telefone: string;
    id_candidacy: string;
};

type Classificacao = {
    name: string;
    id_candidacy: string;
    id_vacancy: string;
    id_admin: string;
    nota_coeficiente_rendimento: string | null;
    nota_entrevista: string | null;
    nota_historico: string | null;
    situacao: 'Habilitado' | 'Inabilitado' | 'Desclassificado';
    motivo_situacao: string | null;
};


export default function VerCandidatos() {
    const queryParams = new URLSearchParams(window.location.search);
    const vancancyId = queryParams.get('id-vaga');
    const processId = queryParams.get('id-processo');

    const [candidatura, setCandidatura] = useState<Candidatura[]>([]);
    const [person, setPerson] = useState<Person[]>([]);
    const [classificacao, setClassificacao] = useState<Classificacao[]>([]);

    useEffect(() => {
        if (!vancancyId) {
            console.error("ID da vaga não encontrado na URL.");
            return;
        }

        const fetchVacancyData = async () => {
            try {
                const responseCandidacy = await axios.get(`http://localhost:8000/api/vacancy/${vancancyId}/candidacy`);
                const candidaturasData: Candidatura[] = responseCandidacy.data.map((cand: { id: string; id_person: string; id_vacancy: string; id_process: string; status: 'Cancelado' | 'Analise' | 'Completo'; data_candidatura: string; }) => ({
                    ...cand,
                    data_candidatura: cand.data_candidatura ? cand.data_candidatura.split("-").reverse().join("/") : "N/A"
                }));
                setCandidatura(candidaturasData);

                const personsData = await Promise.all(
                    candidaturasData.map(async (cand: Candidatura) => {
                        const responsePerson = await axios.get(`http://localhost:8000/api/person/${cand.id_person}`);
                        return { ...responsePerson.data, id_person: cand.id_person };
                    })
                );
                setPerson(personsData);
                
                const responseClassificacao = await axios.get(`http://localhost:8000/api/vacancy/${vancancyId}/classification`);
                if (responseClassificacao.data && responseClassificacao.data.length > 0) {
                    setClassificacao(responseClassificacao.data);
                }
                
            } catch (err) {
                console.error("Erro ao buscar dados da vaga:", err);
            }
        };

        fetchVacancyData();
    }, [vancancyId]);

    return (
        <AppLayout>
            <Head title="Classificação" />
            <Link href={`/processo/vagas/detalhes?id-processo=${processId}&id-vaga=${vancancyId}`}>
                <Button><Undo2 className="mr-2 h-4 w-4" /> Voltar</Button>
            </Link>
            <h1 className='text-3xl font-bold my-4'>Classificação</h1>
            <div className='container mx-auto mt-5 border rounded-lg p-4'>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Classificação</TableHead>
                            <TableHead className="w-[300px]">Candidato</TableHead>
                            <TableHead>Nota Coeficiente</TableHead>
                            <TableHead>Nota Entrevista</TableHead>
                            <TableHead>Nota Histórico</TableHead>
                            <TableHead>Nota Total</TableHead>
                            <TableHead>Situação</TableHead>
                            <TableHead>Motivo</TableHead>
                            <TableHead>Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {classificacao
                            .sort((a, b) => {
                                const notaFinalA = Number(a.nota_historico || 0) + Number(a.nota_entrevista || 0);
                                const notaFinalB = Number(b.nota_historico || 0) + Number(b.nota_entrevista || 0);
                                return notaFinalB - notaFinalA;
                            })
                            .map((classificacaoItem, index) => {
                                const cand = candidatura.find(c => c.id === classificacaoItem.id_candidacy);
                                const personInfo = cand ? person.find(p => p.id_person === cand.id_person) : null;
                                
                                const candidatoId = personInfo ? personInfo.id_person : null;
                                const notaFinal = (Number(classificacaoItem.nota_historico || 0) + Number(classificacaoItem.nota_entrevista || 0));

                                return (
                                    <TableRow key={classificacaoItem.id_candidacy}>
                                        <TableCell className="font-medium">{index + 1}º</TableCell>
                                        <TableCell>{personInfo ? personInfo.name : "Candidato não encontrado"}</TableCell>
                                        <TableCell>{classificacaoItem.nota_coeficiente_rendimento || "N/A"}</TableCell>
                                        <TableCell>{classificacaoItem.nota_entrevista || "N/A"}</TableCell>
                                        <TableCell>{classificacaoItem.nota_historico || "N/A"}</TableCell>
                                        <TableCell>{notaFinal > 0 ? notaFinal : "N/A"}</TableCell>
                                        <TableCell>{classificacaoItem.situacao}</TableCell>
                                        <TableCell>{classificacaoItem.motivo_situacao || ""}</TableCell>
                                        <TableCell>
                                            {candidatoId && (
                                                <Link href={`/processo/vagas/ver-candidatos/candidato-contratacao?id-processo=${processId}&id-vaga=${vancancyId}&id-candidato=${candidatoId}`}>
                                                    <Button className='bg-yellow-600 hover:bg-yellow-700 cursor-pointer text-white'>
                                                        <BookText className="mr-2 h-4 w-4" /> Contratação
                                                    </Button>
                                                </Link>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                    </TableBody>
                </Table>
            </div>
        </AppLayout> 
    );
}
