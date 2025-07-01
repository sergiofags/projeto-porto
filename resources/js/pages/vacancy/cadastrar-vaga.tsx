import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

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
    });

    useEffect(() => {
        if (processId) {
            setVaga((prevState) => ({ ...prevState, id_process: processId }));
        }
    }, []);
const [modalSucesso, setModalSucesso] = useState(false);

    const submitVacancy = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!processId) {
            console.error('Process ID não encontrado.');
            return;
        }

        try {
            const response = await axios.post(`http://localhost:8000/api/admin/${adminId}/process/${processId}/vacancy`, vaga);
            const data = await response.data;

            if (data.error) {
                alert(data.error);
                return;
            }

            setModalSucesso(true);

        } catch (error) {
            alert(error)
            return;
        }
    };

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
                                    <SelectItem value="Pos-Graduacao">Pós-Graduação</SelectItem>
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
                    <div className="flex flex-row gap-2">
                        <Link href={`/processo/vagas?id=${processId}`} className="w-full">
                            <Button type="button" variant="secondary">
                                Voltar
                            </Button>
                        </Link>
                        <Button type="submit">
                            Cadastrar Vaga
                        </Button>
                    </div>
                </form>
            </div>
            <AnimatePresence>
                {modalSucesso && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setModalSucesso(false)}
                    >
                        <motion.div
                            className="bg-white w-full max-w-sm rounded-xl shadow-lg p-8 relative flex flex-col items-center"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                            onClick={e => e.stopPropagation()}>
                            <h2 className="text-xl font-semibold mb-4 text-green-600">Vaga cadastrada com sucesso!</h2>
                            <button
                                className="mt-2 px-6 py-2 bg-[#008DD0] hover:bg-[#0072d0] text-white rounded shadow"
                                onClick={() => router.visit(`/processo/vagas?id=${processId}`)}
                            >
                                Voltar para Vagas
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </AppLayout> 
    );
}