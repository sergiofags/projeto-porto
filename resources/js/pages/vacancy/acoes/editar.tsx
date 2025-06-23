import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function CadastrarVaga() {
    const { auth } = usePage<SharedData>().props;
    const queryParams = new URLSearchParams(window.location.search);
    const vacancyId = queryParams.get('id-vaga');
    const processId = queryParams.get('id-processo');
    const adminId = auth.user.id;

    const [vaga, setVaga] = useState({
        id_process: '',
        titulo: '',
        responsabilidades: '',
        carga_horaria: null,
        remuneracao: null,
        requisitos: '',
        beneficios: '',
        quantidade: null,
        tipo_vaga: '',
        status: '',
        data_inicio: '',
        data_fim: '' as string | null,
    });

    useEffect(() => {
        const fetchVacancy = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/process/${processId}/vacancy/${vacancyId}`);
                setVaga(response.data);

                setVaga({
                    ...response.data,
                    data_inicio: response.data.data_inicio.split("-").reverse().join("/"),
                    data_fim: response.data.data_fim ? response.data.data_fim.split("-").reverse().join("/") : null
                })

            } catch (error) {
                alert(error)
                return;
            }
        };

        fetchVacancy();

    }, []);

    const submitVacancy = async (e: React.FormEvent) => {
        e.preventDefault();

        if (vaga.data_fim === '') {
            setVaga({ ...vaga, data_fim: null });
        }

        if (!processId) {
            alert('Id do processo não encontrado.');
            return;
        }

        try {
            const formattedVaga = {
                ...vaga,
                data_inicio: vaga.data_inicio.split("/").reverse().join("-"),
                data_fim: vaga.data_fim ? vaga.data_fim.split("/").reverse().join("-") : null
            };

            const response = await axios.put(`http://localhost:8000/api/admin/${adminId}/process/${processId}/vacancy/${vacancyId}`, formattedVaga);
            const data = await response.data;

            if (data.error) {
                alert(data.error);
                return;
            }

            alert('Vaga atualizada com sucesso!');
            window.location.href = `/processo/vagas?id=${processId}`;

        } catch (error) {
            alert(error)
            return;
        }
    };

    return (
        <AppLayout>
            <Head title="Editar Vaga" />

            <div className="flex h-full max-h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <nav className="text-sm text-muted-foreground mb-4">
                    <ol className="flex items-center space-x-2">
                        <li>
                            <Link href="/" className="hover:underline">Início</Link>
                        </li>
                        <li>
                            <span className="mx-1">/</span>
                            <span className="font-medium">Processo</span>
                        </li>
                        <li>
                            <span className="mx-1">/</span>
                            <span className="font-medium">Cadastrar Vaga</span>
                        </li>
                    </ol>
                </nav>
                <form onSubmit={submitVacancy} className='space-y-6'>
                    <h2 className="text-xl font-">Cadastre a Vaga</h2>
                    <div className="grid gap-2">
                        <Label htmlFor="titulo">Titulo</Label>
                        <Input
                            id="titulo"
                            value={vaga.titulo}
                            onChange={(e) => setVaga({ ...vaga, titulo: e.target.value })}
                            placeholder="Titulo"
                        />
                    </div>
                    <div>
                        <Label htmlFor="responsabilidades" className="block text-sm font-medium text-gray-700">
                            Responsabilidades:
                        </Label>
                        <Textarea
                            typeof="text"
                            id="responsabilidades"
                            name="responsabilidades"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            required
                            placeholder="Responsabilidades"
                            value={vaga.responsabilidades}
                            onChange={(e) => setVaga({ ...vaga, responsabilidades: e.target.value })}
                        />
                    </div>
                    <div>
                        <Label htmlFor="requisitos" className="block text-sm font-medium text-gray-700">
                            Requisitos:
                        </Label>
                        <Textarea
                            typeof="text"
                            id="requisitos"
                            name="requisitos"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            required
                            placeholder="Requisitos"
                            value={vaga.requisitos}
                            onChange={(e) => setVaga({ ...vaga, requisitos: e.target.value })}
                        />
                    </div>
                    <div>
                        <Label htmlFor="beneficios" className="block text-sm font-medium text-gray-700">
                            Beneficios:
                        </Label>
                        <Input
                            type="text"
                            id="beneficios"
                            name="beneficios"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            required
                            placeholder="Beneficios"
                            value={vaga.beneficios}
                            onChange={(e) => setVaga({ ...vaga, beneficios: e.target.value })}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="tipo">Tipo</Label>
                        <Select
                            value={vaga.tipo_vaga}
                            onValueChange={(value) => setVaga({ ...vaga, tipo_vaga: value })}
                            required
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Selecione o tipo" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Niveis</SelectLabel>
                                    <SelectItem value="Graduacao">Graduação</SelectItem>
                                    <SelectItem value="Pos-Garduacao">Pós-Graduação</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="status">Status</Label>
                        <Select
                            value={vaga.status}
                            onValueChange={(value) => setVaga({ ...vaga, status: value })}
                            required
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Selecione o status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Status</SelectLabel>
                                    <SelectItem value="Aberto">Aberto</SelectItem>
                                    <SelectItem value="Fechado">Fechado</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="data_inicio">Data início</Label>
                        <Input
                            id="data_inicio"
                            value={vaga.data_inicio}
                            onChange={(e) => {
                                let value = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters
                                if (value.length > 2) value = value.slice(0, 2) + '/' + value.slice(2);
                                if (value.length > 5) value = value.slice(0, 5) + '/' + value.slice(5, 9);
                                    setVaga({ ...vaga, data_inicio: value });
                                }}
                            placeholder="Data início"
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="data_fim">Data fim</Label>
                        <Input
                            id="data_fim"
                            value={vaga.data_fim ?? ''}
                            onChange={(e) => {
                                let value = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters
                                if (value.length > 2) value = value.slice(0, 2) + '/' + value.slice(2);
                                if (value.length > 5) value = value.slice(0, 5) + '/' + value.slice(5, 9);
                                    setVaga({ ...vaga, data_fim: value });
                                }}
                            placeholder="Data fim"
                        />
                    </div>
                    <div className="flex flex-row gap-2">
                        <Link href={`/processo/vagas?id=${processId}`} className="w-full">
                            <Button type="button" variant="secondary">
                                Voltar
                            </Button>
                        </Link>
                        <Button type="submit">
                            Atualizar Vaga
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout> 
    );
}