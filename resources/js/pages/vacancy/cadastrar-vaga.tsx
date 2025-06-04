import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function CadastrarVaga() {
    const { auth } = usePage<SharedData>().props; 

    const [vaga, setVaga] = useState({
        id_process: '',
        titulo: '',
        responsabilidades: '',
        carga_horaria: '',
        remuneracao: '',
        requisitos: '',
        beneficios: '',
        quantidade: '',
        tipo_vaga: '',
        data_inicio: '',
        data_fim: '' as string | null,
    });

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const processId = queryParams.get('id');
        if (processId) {
            setVaga((prevState) => ({ ...prevState, id_process: processId }));
        }
    }, []);

    const submitVacancy = async (e: React.FormEvent) => {
        e.preventDefault();

        if (vaga.data_fim === '') {
            setVaga({ ...vaga, data_fim: null });
        }

        const queryParams = new URLSearchParams(window.location.search);
        const processId = queryParams.get('id');
        const adminId = auth.user.id;

        console.log(adminId)

        if (!processId) {
            console.error('Process ID não encontrado.');
            return;
        }

        try {
            const response: Response = await fetch(`http://localhost:8000/api/admin/${adminId}/process/${processId}/vacancy`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(vaga),
            });

            const data = await response.json();

            if (!response.ok) {
                console.error('Erro da API:', data);
                throw new Error(data.message || 'Erro desconhecido');
            }

            console.log('Resposta da API:', data);

            setVacancyRecentlySuccessful(true);
            setTimeout(() => {
                setVacancyRecentlySuccessful(false);
                setVaga((prev) => ({ ...prev, ...data }));
            }, 3000);

        } catch (error) {
            console.error('Erro ao cadastrar vaga:', error);
            if (error instanceof Error) {
                alert(error.message);
            } else {
                alert('Erro desconhecido');
            }
        }
    };

    const [vacancyRecentlySuccessful, setVacancyRecentlySuccessful] = useState(false);

    return (
        <AppLayout>
            <Head title="Cadastrar Vaga" />

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
                        <Label htmlFor="carga_horaria" className="block text-sm font-medium text-gray-700">
                            Carga Horária:
                        </Label>
                        <Input
                            type="text"
                            id="carga_horaria"
                            name="carga_horaria"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            required
                            placeholder="Carga Horária"
                            value={vaga.carga_horaria}
                            onChange={(e) => setVaga({ ...vaga, carga_horaria: e.target.value })}
                        />
                    </div>
                    <div>
                        <Label htmlFor="remuneracao" className="block text-sm font-medium text-gray-700">
                            Remuneração:
                        </Label>
                        <Input
                            type="text"
                            id="remuneracao"
                            name="remuneracao"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            required
                            placeholder="Remuneração"
                            value={vaga.remuneracao}
                            onChange={(e) => setVaga({ ...vaga, remuneracao: e.target.value })}
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
                    <div>
                        <Label htmlFor="quantidade" className="block text-sm font-medium text-gray-700">
                            Quantidade:
                        </Label>
                        <Input
                            type="text"
                            id="quantidade"
                            name="quantidade"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            required
                            placeholder="Quantidade"
                            value={vaga.quantidade}
                            onChange={(e) => setVaga({ ...vaga, quantidade: e.target.value })}
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
                        <Link href="/" className="w-full">
                            <Button type="button" variant="secondary">
                                Voltar
                            </Button>
                        </Link>
                        <Button type="submit">
                            Cadastrar Vaga
                        </Button>
                        <Transition
                            show={vacancyRecentlySuccessful}
                            enter="transition ease-in-out"
                            enterFrom="opacity-0"
                            leave="transition ease-in-out"
                            leaveTo="opacity-0"
                        >
                            <p className="text-sm text-neutral-600">Saved</p>
                        </Transition>
                    </div>
                </form>
            </div>
        </AppLayout> 
    );
}