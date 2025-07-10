import axios from 'axios';
//import { Button } from '@/components/ui/button';
//import { Input } from '@/components/ui/input';
//import { Label } from '@/components/ui/label';
//import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
//import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@headlessui/react';
import { AnimatePresence, motion } from 'framer-motion';
//import { ChevronLeft, ChevronRight } from 'lucide-react';

type Setor = {
    id: string;
    nome: string;
};

export default function CadastrarVaga() {
    const { auth } = usePage<SharedData>().props;
    const queryParams = new URLSearchParams(window.location.search);
    const processId = queryParams.get('id');
    const adminId = auth.user.id;
    const [carregando] = useState(false);

    const [cursos, setCursos] = useState<{ id: string; nome: string }[]>([]);

    const [setores, setSetores] = useState<Setor[]>([]);

    const [vaga, setVaga] = useState({
        id_process: '',
        titulo: '',
        responsabilidades: '',
        carga_horaria: '',
        remuneracao: '',
        requisitos: '',
        beneficios: '',
        quantidade: '',
        status: '',
        setor_id: '',
    });

    useEffect(() => {
        const fetchSetores = async () => {
            try {
              const response = await axios.get(`http://localhost:8000/api/setores`);
  
              setSetores(response.data);
  
            } catch (error) {
              alert(error);
            }
          };
      
          fetchSetores();

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
            const response = await axios.post(`http://localhost:8000/api/admin/${adminId}/process/${processId}/vacancy/setor/${vaga.setor_id}`, vaga);
            const data = await response.data;

            if (data.error) {
                alert(data.error);
                return;
            }

            setModalSucesso(true);
        }

        catch (error: any) {
            // Mostra mensagem de erro detalhada do backend
            if (error.response && error.response.data && error.response.data.message) {
                alert(error.response.data.message);
            } else {
                alert('Erro ao cadastrar cadastro reserva');
            }
            return;
        }
    };

    return (
        <AppLayout>
            <Head title="Cadastrar Cadastro Reserva" />

            <div className="flex h-full max-h-full flex-1 flex-col  rounded-xl p-4">
                <nav className="text-sm text-muted-foreground mb-4">
                    <ol className="flex items-center space-x-2">
                        <li>
                            <Link href="/" className="hover:underline text-[#008DD0]">Início</Link>
                        </li>
                        <li>
                            <span className="mx-1 text-[#008DD0]">/</span>
                            <span className=" text-[#008DD0]">Processo</span>
                        </li>
                        <li>
                            <span className="mx-1 text-[#008DD0]" >/</span>
                            <span className="font-medium text-[#008DD0]">Cadastrar Cadastro Reserva</span>
                        </li>
                    </ol>
                </nav>
                <div className="max-w mx-auto w-full bg-white pt-0 pb-10">
                    <div className="mt-2 mb-1 w-fit">
                        <h1 className="text-2xl text-black">Cadastrar Cadastro Reserva</h1>
                        <hr className="mt-1 bg-[#008DD0] h-0.5" />
                    </div>
                    <form onSubmit={submitVacancy} className="grid grid-cols-1 gap-4 md:grid-cols-6">

                        <div className="md:col-span-4 mt-2">
                            <label htmlFor="titulo" className="block mb-2">Título</label>
                            <input
                                id="titulo"
                                value={vaga.titulo}
                                onChange={(e) => setVaga({ ...vaga, titulo: e.target.value })}
                                placeholder="Título da vaga"
                                className="w-full pl-2 pr-2 py-2 border border-[#008DD0] rounded-md focus:outline-none focus:border-[#145F7F] text-black shadow-md"
                                required
                            />
                        </div>

                        <div className="md:col-span-6 mt-2">
                            <label htmlFor="responsabilidades" className="block mb-2">Responsabilidades</label>
                            <textarea
                                id="responsabilidades"
                                name="responsabilidades"
                                className="w-full pl-2 pr-2 py-2 border border-[#008DD0] rounded-md focus:outline-none focus:border-[#145F7F] text-black shadow-md"
                                placeholder="Descreva as responsabilidades"
                                required
                                value={vaga.responsabilidades}
                                onChange={(e) => setVaga({ ...vaga, responsabilidades: e.target.value })}
                            />
                        </div>

                        <div className="md:col-span-6 mt-2">
                            <label htmlFor="requisitos" className="block mb-2">Requisitos</label>
                            <textarea
                                id="requisitos"
                                name="requisitos"
                                className="w-full pl-2 pr-2 py-2 border border-[#008DD0] rounded-md focus:outline-none focus:border-[#145F7F] text-black shadow-md"
                                placeholder="Descreva os requisitos"
                                required
                                value={vaga.requisitos}
                                onChange={(e) => setVaga({ ...vaga, requisitos: e.target.value })}
                            />
                        </div>

                        <div className="md:col-span-6 mt-2">
                            <label htmlFor="beneficios" className="block mb-2">Benefícios</label>
                            <input
                                type="text"
                                id="beneficios"
                                name="beneficios"
                                placeholder="Benefícios oferecidos"
                                className="w-full pl-2 pr-2 py-2 border border-[#008DD0] rounded-md focus:outline-none focus:border-[#145F7F] text-black shadow-md"
                                required
                                value={vaga.beneficios}
                                onChange={(e) => setVaga({ ...vaga, beneficios: e.target.value })}
                            />
                        </div>

                        <div className="grid gap-2">
                            <label htmlFor="setor" className="block mb-2">Setor</label>
                            <select
                                id="setor"
                                value={vaga.setor_id}
                                onChange={async (e) => {
                                    const value = e.target.value;
                                    setVaga({ ...vaga, setor_id: value });
                                
                                    if (!value) {
                                        setCursos([]);
                                        return;
                                    }
                                
                                    try {
                                        const response = await axios.get(`http://localhost:8000/api/courses/setor/${value}`);
                                        setCursos(response.data);
                                    } catch (error) {
                                        return error;
                                    }
                                }}
                                required
                                className="w-full pl-2 pr-2 py-2 border border-[#008DD0] rounded-md focus:outline-none focus:border-[#145F7F] text-black shadow-md"
                            >
                                <option value="" disabled hidden>Selecione o setor</option>
                                {setores.map((setor) => (
                                    <option key={setor.id} value={String(setor.id)}>
                                        {setor.nome}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="grid gap-2">
                            {cursos.length > 0 ? (
                                <div className="grid gap-2">
                                    <label htmlFor="cursos" className="block mb-2">Cursos</label>
                                    <div className='flex gap-2'>
                                        {cursos.map((curso) => (
                                            <p key={curso.id}>{curso.nome}</p>
                                        ))}
                                    </div>
                                </div>
                                ) : (
                                vaga.setor_id && (
                                    <p className="text-sm text-muted-foreground mt-2">Nenhum curso relacionado encontrado.</p>
                                )
                            )}

                        </div>

                        <div className="md:col-span-3 mt-2">
                            <label htmlFor="status" className="block mb-2">Status</label>
                            <select
                                id="status"
                                value={vaga.status}
                                onChange={(e) => setVaga({ ...vaga, status: e.target.value })}
                                required
                                className="w-full pl-2 pr-2 py-2 border border-[#008DD0] rounded-md focus:outline-none focus:border-[#145F7F] text-black shadow-md"
                            >
                                <option value="" disabled hidden>Selecione o status</option>
                                <option value="Aberto">Aberto</option>
                                <option value="Fechado">Fechado</option>
                            </select>
                        </div>
                        <div className="md:col-span-6 flex justify-between gap-2 mt-4">
                            <Link href={route('inicio-processo')} className="w-full md:w-auto">
                                <Button type="button" className="flex items-center bg-[#808080] hover:bg-[#404040] gap-2 rounded-md px-4 py-2 text-sm shadow-md transition-colors duration-200 text-white">
                                    <ChevronLeft />
                                    Voltar
                                </Button>
                            </Link>
                            <Button type="submit" className="flex items-center bg-[#008DD0] hover:bg-[#145F7F] gap-2 rounded-md px-4 py-2 text-sm shadow-md transition-colors duration-200 text-white" disabled={carregando}>
                                {carregando ? 'Salvando...' : 'Concluir'}
                                <ChevronRight />
                            </Button>
                        </div>
                    </form>
                </div>
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
                            <h2 className="text-xl font-semibold mb-4 text-green-600">Cadastro Reserva cadastrado com sucesso!</h2>
                            <button
                                className="mt-2 px-6 py-2 bg-[#008DD0] hover:bg-[#0072d0] text-white rounded shadow"
                                onClick={() => router.visit(`/processo/vagas?id=${processId}`)}
                            >
                                Voltar para Cadastros Reserva
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </AppLayout>
    );
}