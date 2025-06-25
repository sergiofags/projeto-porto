import axios from 'axios';
import { Button } from '@/components/ui/button';
//import { Input } from '@/components/ui/input';
//import { Label } from '@/components/ui/label';
//import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
//import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { SharedData } from '@/types';
//import { Transition } from '@headlessui/react';
import { Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function CadastrarVaga() {
    const { auth } = usePage<SharedData>().props;
    const queryParams = new URLSearchParams(window.location.search);
    const processId = queryParams.get('id');
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
        if (processId) {
            setVaga((prevState) => ({ ...prevState, id_process: processId }));
        }
    }, []);

    const submitVacancy = async (e: React.FormEvent) => {
        e.preventDefault();

        if (vaga.data_fim === '') {
            setVaga({ ...vaga, data_fim: null });
        }

        if (!processId) {
            console.error('Process ID não encontrado.');
            return;
        }

        try {
            const formattedVaga = {
                ...vaga,
                data_inicio: vaga.data_inicio.split("/").reverse().join("-"),
                data_fim: vaga.data_fim ? vaga.data_fim.split("/").reverse().join("-") : null
            };

            const response = await axios.post(`http://localhost:8000/api/admin/${adminId}/process/${processId}/vacancy`, formattedVaga);
            const data = await response.data;

            if (data.error) {
                alert(data.error);
                return;
            }

            alert('Vaga cadastrada com sucesso!');
            window.location.href = `/processo/vagas?id=${processId}`;

        } catch (error) {
            alert(error)
            return;
        }
    };

    return (
    <AppLayout>
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

            <div className="max-w mx-auto w-full bg-white p-10">
                <div className="mt-2 mb-1 w-fit">
                    <h1 className="text-2xl text-black">Cadastro da Vaga</h1>
                    <hr className="mt-1 bg-[#008DD0] h-0.5" />
                </div>

                <form onSubmit={submitVacancy} className="grid grid-cols-1 gap-4 md:grid-cols-6">
                    <div className="md:col-span-4 mt-5">
                        <label htmlFor="titulo" className="block mb-2">Título</label>
                        <input
                            id="titulo"
                            type="text"
                            value={vaga.titulo}
                            onChange={(e) => setVaga({ ...vaga, titulo: e.target.value })}
                            placeholder="Título da vaga"
                            className="w-full pl-2 pr-2 py-2 border border-[#008DD0] rounded-md focus:outline-none focus:border-[#145F7F] text-black shadow-md"
                            required
                        />
                    </div>

                    <div className="md:col-span-6 mt-5">
                        <label htmlFor="responsabilidades" className="block mb-2">Responsabilidades</label>
                        <textarea
                            id="responsabilidades"
                            value={vaga.responsabilidades}
                            onChange={(e) => setVaga({ ...vaga, responsabilidades: e.target.value })}
                            placeholder="Responsabilidades"
                            required
                            className="w-full pl-2 pr-2 py-2 border border-[#008DD0] rounded-md text-black shadow-md focus:outline-none focus:border-[#145F7F]"
                        />
                    </div>

                    <div className="md:col-span-6 mt-5">
                        <label htmlFor="requisitos" className="block mb-2">Requisitos</label>
                        <textarea
                            id="requisitos"
                            value={vaga.requisitos}
                            onChange={(e) => setVaga({ ...vaga, requisitos: e.target.value })}
                            placeholder="Requisitos"
                            required
                            className="w-full pl-2 pr-2 py-2 border border-[#008DD0] rounded-md text-black shadow-md focus:outline-none focus:border-[#145F7F]"
                        />
                    </div>

                    <div className="md:col-span-4 mt-5">
                        <label htmlFor="beneficios" className="block mb-2">Benefícios</label>
                        <input
                            type="text"
                            id="beneficios"
                            value={vaga.beneficios}
                            onChange={(e) => setVaga({ ...vaga, beneficios: e.target.value })}
                            placeholder="Benefícios"
                            required
                            className="w-full pl-2 pr-2 py-2 border border-[#008DD0] rounded-md text-black shadow-md focus:outline-none focus:border-[#145F7F]"
                        />
                    </div>

                    <div className="md:col-span-2 mt-5">
                        <label className="block mb-2">Tipo</label>
                        <div className="relative">
                            <select
                                value={vaga.tipo_vaga}
                                onChange={(e) => setVaga({ ...vaga, tipo_vaga: e.target.value })}
                                required
                                className="w-full pl-2 pr-10 py-2 border border-[#008DD0] rounded-md text-black shadow-md focus:outline-none focus:border-[#145F7F]"
                            >
                                <option value="">Selecione o tipo</option>
                                <option value="Graduacao">Graduação</option>
                                <option value="Pos-Graduacao">Pós-Graduação</option>
                            </select>
                        </div>
                    </div>

                    <div className="md:col-span-2 mt-5">
                        <label className="block mb-2">Status</label>
                        <div className="relative">
                            <select
                                value={vaga.status}
                                onChange={(e) => setVaga({ ...vaga, status: e.target.value })}
                                required
                                className="w-full pl-2 pr-10 py-2 border border-[#008DD0] rounded-md text-black shadow-md focus:outline-none focus:border-[#145F7F]"
                            >
                                <option value="">Selecione o status</option>
                                <option value="Aberto">Aberto</option>
                                <option value="Fechado">Fechado</option>
                            </select>
                        </div>
                    </div>

                    <div className="md:col-span-2 mt-5">
                        <label htmlFor="data_inicio" className="block mb-2">Data início</label>
                        <input
                            type="text"
                            id="data_inicio"
                            value={vaga.data_inicio}
                            onChange={(e) => {
                                let value = e.target.value.replace(/\D/g, '');
                                if (value.length > 2) value = value.slice(0, 2) + '/' + value.slice(2);
                                if (value.length > 5) value = value.slice(0, 5) + '/' + value.slice(5, 9);
                                setVaga({ ...vaga, data_inicio: value });
                            }}
                            placeholder="DD/MM/AAAA"
                            className="w-full pl-2 pr-2 py-2 border border-[#008DD0] rounded-md shadow-md text-black focus:outline-none focus:border-[#145F7F]"
                            required
                        />
                    </div>

                    <div className="md:col-span-2 mt-5">
                        <label htmlFor="data_fim" className="block mb-2">Data fim</label>
                        <input
                            type="text"
                            id="data_fim"
                            value={vaga.data_fim ?? ''}
                            onChange={(e) => {
                                let value = e.target.value.replace(/\D/g, '');
                                if (value.length > 2) value = value.slice(0, 2) + '/' + value.slice(2);
                                if (value.length > 5) value = value.slice(0, 5) + '/' + value.slice(5, 9);
                                setVaga({ ...vaga, data_fim: value });
                            }}
                            placeholder="DD/MM/AAAA"
                            className="w-full pl-2 pr-2 py-2 border border-[#008DD0] rounded-md shadow-md text-black focus:outline-none focus:border-[#145F7F]"
                        />
                    </div>

                    <div className="md:col-span-6 flex justify-between gap-2 mt-4">
                        <Link href="/" className="w-full md:w-auto">
                            <Button type="button" variant="secondary" className="flex items-center bg-[#808080] hover:bg-[#404040] gap-2 rounded-md px-4 py-2 text-sm shadow-md text-white">
                                <ChevronLeft />
                                Voltar
                            </Button>
                        </Link>
                        <Button type="submit" className="flex items-center bg-[#008DD0] hover:bg-[#145F7F] gap-2 rounded-md px-4 py-2 text-sm shadow-md text-white">
                            Cadastrar Vaga
                            <ChevronRight />
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    </AppLayout>
);

}
