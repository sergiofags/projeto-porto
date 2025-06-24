import axios from 'axios';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from '@/components/ui/button';
import { Undo2 } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function VerCandidatos() {
    const queryParams = new URLSearchParams(window.location.search);
    const vancancyId = queryParams.get('id-vaga');
    const processId = queryParams.get('id-processo');

    const [candidatura, setCandidatura] = useState<Array<{
        id: string;
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

    const [classificacao, setClassificacao] = useState<Array<{
        name: string;
        id_candidacy: string;
        id_vacancy: string;
        id_admin: string;
        nota_coeficiente_rendimento: string | null;
        nota_entrevista: string | null;
        nota_historico: string | null;
        situacao: 'Habilitado' | 'Inabilitado' | 'Desclassificado';
        motivo_situacao: string | null;
    }>>([]);

    useEffect(() => {
        const fetchVacancy = async () => {
            try {
                const responseCandidacy = await axios.get(`http://localhost:8000/api/vacancy/${vancancyId}/candidacy`);
                setCandidatura(responseCandidacy.data);
                setCandidatura(
                    responseCandidacy.data.map((candidatura: { id_person: string; id_vacancy: string; id_process: string; status: 'Cancelado' | 'Analise' | 'Completo'; data_candidatura: string; }) => ({
                        ...candidatura,
                        data_candidatura: candidatura.data_candidatura ? candidatura.data_candidatura.split("-").reverse().join("/") : null
                    }))
                );

                const personsData = await Promise.all(
                    responseCandidacy.data.map(async (candidatura: { id_person: string; id_vacancy: string; id_process: string; status: 'Cancelado' | 'Analise' | 'Completo'; data_candidatura: string; }) => {
                        const responsePerson = await axios.get(`http://localhost:8000/api/person/${candidatura.id_person}`);
                        return { ...responsePerson.data, id_person: candidatura.id_person };
                    })
                );
                setPerson(personsData);
                
                if (!vancancyId) {
                    alert("Vaga não encontrada")
                    return;
                }

                const responseClassificacao = await axios.get(`http://localhost:8000/api/vacancy/${vancancyId}/classification`);
                console.log(responseClassificacao)

                if (responseClassificacao.data && responseClassificacao.data.length > 0) {
                    setClassificacao(
                        responseClassificacao.data.map((classificacao: {
                            id_candidacy: string;
                            id_vacancy: string;
                            id_admin: string;
                            nota_coeficiente_rendimento: string | null;
                            nota_entrevista: string | null;
                            nota_historico: string | null;
                            situacao: 'Habilitado' | 'Inabilitado' | 'Desclassificado';
                            motivo_situacao: string | null;
                        }) => ({
                            ...classificacao,
                            nota_coeficiente_rendimento: classificacao.nota_coeficiente_rendimento || null,
                            nota_entrevista: classificacao.nota_entrevista || null,
                            nota_historico: classificacao.nota_historico || null,
                            situacao: classificacao.situacao || 'Desclassificado',
                            motivo_situacao: classificacao.motivo_situacao || null
                        }))
                    );
                }
                
            } catch (error) {
                alert(error)
                return;
            }
        };

        fetchVacancy();
    }, [vancancyId]);

    return (
        <AppLayout>
            <Head title="Classificação" />
            <Link href={`/processo/vagas/detalhes?id-processo=${processId}&id-vaga=${vancancyId}`}><Button><Undo2 /> Voltar</Button></Link>
            <h1 className='text-3xl'>Classificação</h1>
            <div className='container mt-5'>
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
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {classificacao
                            .sort((a, b) => {
                                const notaFinalA = Number(a.nota_historico || 0) + Number(a.nota_entrevista || 0);
                                const notaFinalB = Number(b.nota_historico || 0) + Number(b.nota_entrevista || 0);
                                return notaFinalB - notaFinalA;
                            })
                            .map((classificacaoItem) => (
                                <TableRow key={classificacaoItem.id_candidacy}>
                                    <TableCell>{classificacao.findIndex(c => c.id_candidacy === classificacaoItem.id_candidacy) + 1}</TableCell>
                                    <TableCell>
                                        {(() => {
                                            const cand = candidatura.find(c => c.id === classificacaoItem.id_candidacy);
                                            if (!cand) return "Não informado";
                                            const p = person.find(p => p.id_person === cand.id_person);
                                            return p ? p.name : "Não informado";
                                        })()}
                                    </TableCell>
                                    <TableCell>{classificacaoItem.nota_coeficiente_rendimento || "Não informado"}</TableCell>
                                    <TableCell>{classificacaoItem.nota_entrevista || "Não informado"}</TableCell>
                                    <TableCell>{classificacaoItem.nota_historico || "Não informado"}</TableCell>
                                    <TableCell>{(Number(classificacaoItem.nota_historico || 0) + Number(classificacaoItem.nota_entrevista || 0)) || "Não informado"}</TableCell>
                                    <TableCell>{classificacaoItem.situacao}</TableCell>
                                    <TableCell>{classificacaoItem.motivo_situacao || ""}</TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </div>
        </AppLayout> 
    );
}
