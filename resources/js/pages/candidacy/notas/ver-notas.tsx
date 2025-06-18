import axios from 'axios';
import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SharedData } from '@/types';
import { Pen } from 'lucide-react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function VerNotas() {
    const { auth } = usePage<SharedData>().props;
    const queryParams = new URLSearchParams(window.location.search);
    const vacancyId = queryParams.get('id-vaga');
    const candidacyId = queryParams.get('id-candidatura');
    const candidatoId = queryParams.get('id-candidato');
    const adminId = auth.user.id;

    const [note, setNote] = useState<Array<{
        id: number;
        id_candidacy: number;
        id_vacancy: number;
        id_admin: number;
        nota_coeficiente_rendimento: string;
        nota_entrevista: string;
        nota_historico: string;
        situacao: 'Habilitado' | 'Inabilitado' | 'Desclassificado';
        motivo_situacao: '';
    }>>([]);

    const [person, setPerson] = useState<Array<{
        id_user: string;
        id_person: string ,
        name: string;
        foto_perfil?: string;
        sobre?: string;
        linkedin?: string;
        instagram?: string;
        facebook?: string;
        cpf?: string;
        data_nascimento?: string;
        genero?: 'Masculino' | 'Feminino' | 'Outro';
        deficiencia?: boolean;
        qual_deficiencia?: string | null;
        servico_militar?: boolean;
        telefone?: string;
        rua?: string;
        bairro?: string;
        cidade?: string;
        estado?: string;
        numero?: string;
        complemento?: string;
        cep?: string;
        referencia?: string;
        estou_ciente?: boolean;
        email?: string;
    }>>([]);

    useEffect(() => {
        const fetchVacancy = async () => {
            try {
                const responseNotes = await axios.get(`http://localhost:8000/api/vacancy/${vacancyId}/candidacy/${candidacyId}/note`);
                setNote(Array.isArray(responseNotes.data) ? responseNotes.data : [responseNotes.data]);

                const responsePerson = await axios.get(`http://localhost:8000/api/person/${candidatoId}`);
                setPerson(Array.isArray(responsePerson.data) ? responsePerson.data : [responsePerson.data]);
                setPerson([{
                    ...responsePerson.data,
                    data_nascimento: responsePerson.data.data_nascimento.split("-").reverse().join("/"),
                }])
                
            } catch (error) {
                alert(error)
                return;
            }
        };

        fetchVacancy();
    }, []);

    const handleUpdateNote = async (e: React.FormEvent) => {
        e.preventDefault();
        const classificationId = note[0]?.id;
        if (!classificationId) {
            alert('Erro: classificationId não encontrado.');
            return;
        }

        try {
            const coeficienteRendimento = parseFloat(note[0]?.nota_coeficiente_rendimento || '0');
            if (coeficienteRendimento > 10.0 || coeficienteRendimento < 0.0) {
                alert('Nota Coeficiente Rendimento deve ser entre 0.0 e 10.0');
                return;
            }
            const entrevista = parseFloat(note[0]?.nota_entrevista || '0');
            if (entrevista > 50.0 || entrevista < 0.0) {
                alert('Nota Entrevista deve ser entre 0.0 e 50.0')
                return;
            }

            await axios.put(`http://localhost:8000/api/admin/${adminId}/candidacy/${candidacyId}/classification/${classificationId}/note`, note[0]);
            alert('Atualizada com sucesso!');
            window.location.reload();
        } catch (error) {
            alert('Erro ao atualizar nota: ' + error);
        }
    };

    return (
        <AppLayout>
            <Head title="Ver notas" />
            <h1>Candidato: {person[0]?.name}</h1>
            <p>Email: {person[0]?.email}</p>
            <p>Telefone: {person[0]?.telefone}</p>

            <div>
                <p>Nota Histórico: {note[0]?.nota_historico ?? "Não informado"}</p>
                <p>Nota Coeficiente Rendimento: {note[0]?.nota_coeficiente_rendimento ?? "Não informado"}</p>
                <p>Nota Entrevista: {note[0]?.nota_entrevista ?? "Não informado"}</p>
                <p>Situação: {note[0]?.situacao}</p>
                {note[0]?.situacao === 'Desclassificado' && (
                    <p>Motivo situação: {note[0]?.motivo_situacao}</p>
                )}
                <p>Resultado final: {(parseFloat(note[0]?.nota_historico || '0') + parseFloat(note[0]?.nota_entrevista || '0')).toFixed(2)}</p>
            </div>
            <div>
                <form onSubmit={handleUpdateNote}>
                    <div className="grid gap-2">
                        <Label htmlFor="coeficiente_rendimento">Nota Coeficiente Rendimento: 0.0 - 10.0</Label>
                        <Input
                            id="coeficiente_rendimento"
                            value={note[0]?.nota_coeficiente_rendimento || ''}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (/^\d{0,2}(\.\d{0,2})?$/.test(value)) {
                                    const updatedNote = [...note];
                                    if (updatedNote[0]) {
                                        updatedNote[0].nota_coeficiente_rendimento = value;
                                    }
                                    setNote(updatedNote);
                                }
                            }}
                            placeholder="Nota Coeficiente Rendimento: 0.0 - 10.0"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="entrevista">Nota Entrevista: 0.0 - 50.0</Label>
                        <Input
                            id="entrevista"
                            value={note[0]?.nota_entrevista || ''}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (/^\d{0,2}(\.\d{0,2})?$/.test(value)) {
                                    const updatedNote = [...note];
                                    if (updatedNote[0]) {
                                        updatedNote[0].nota_entrevista = value;
                                    }
                                    setNote(updatedNote);
                                }
                            }}
                            placeholder="Nota Entrevista: 0.0 - 50.0"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="situacao">Situação</Label>
                        <Select
                            value={note[0]?.situacao || ''}
                            onValueChange={(value) => {
                                const updatedNote = [...note];
                                if (updatedNote[0]) {
                                    updatedNote[0].situacao = value as 'Habilitado' | 'Inabilitado' | 'Desclassificado';
                                }
                                setNote(updatedNote);
                            }}
                            required
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Selecione a situação" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Situação</SelectLabel>
                                    <SelectItem value="Habilitado">Habilitado</SelectItem>
                                    <SelectItem value="Inabilitado">Inabilitado</SelectItem>
                                    <SelectItem value="Desclassificado">Desclassificado</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    {note[0]?.situacao === 'Desclassificado' && (
                        <div className="grid gap-2">
                            <Label htmlFor="motivo_situacao">Motivo da Situação</Label>
                            <Input
                                id="motivo_situacao"
                                value={note[0]?.motivo_situacao || ''}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    const updatedNote = [...note];
                                    if (updatedNote[0]) {
                                        updatedNote[0].motivo_situacao = value as '';
                                    }
                                    setNote(updatedNote);
                                }}
                                placeholder="Informe o motivo da situação"
                            />
                        </div>
                    )}
                    <Button className='hover:cursor-pointer'>Alterar Notas <Pen /></Button>
                </form>
            </div>
        </AppLayout> 
    );
}
