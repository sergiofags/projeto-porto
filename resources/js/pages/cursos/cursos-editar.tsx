import axios from 'axios';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Curso = {
    nome: string;
};

export default function EditarCurso() {
    const queryParams = new URLSearchParams(window.location.search);
    const cursoId = queryParams.get('id-curso');
    const setorId = queryParams.get('id-setor');

    const [curso, setCurso] = useState<Curso>({ nome: '' });
    const [mensagem, setMensagem] = useState('');
    const [carregando, setCarregando] = useState(false);
    const [modalSucesso, setModalSucesso] = useState(false); // Para modal de sucesso

    // Carregar os dados do curso
    useEffect(() => {
        const fetchCurso = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/courses/${cursoId}`);
                setCurso(response.data);
            } catch (error) {
                setMensagem('Erro ao carregar dados do curso');
            }
        };
        fetchCurso();
    }, [cursoId]);

    const submitCursoUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setMensagem('');
        setCarregando(true);

        try {
            const response = await axios.put(`http://localhost:8000/api/courses/${cursoId}/update`, curso);
            const data = await response.data;

            if (data.error) {
                setMensagem(`Erro ao atualizar curso: ${data.error}`);
                return;
            }

            setModalSucesso(true); // Exibe o modal de sucesso
        } catch (error) {
            setMensagem('Erro ao conectar com o servidor');
        } finally {
            setCarregando(false);
        }
    };

    return (
        <AppLayout>
            <Head title="Editar Curso" />
            <div className="flex h-full max-h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <nav className="text-sm text-muted-foreground mb-2">
                    <ol className="flex items-center space-x-2">
                        <li>
                            <Link href="/" className="hover:underline text-[#008DD0]">Início</Link>
                        </li>
                        <li>
                            <span className="text-[#008DD0] mx-1">/</span>
                            <Link href={`/setores/cursos?id-setor=${setorId}`} className="hover:underline text-[#008DD0]">Setores</Link>
                        </li>
                        <li>
                            <span className="text-[#008DD0] mx-1">/</span>
                            <Link href={`/setores/cursos?id-setor=${setorId}`} className="hover:underline text-[#008DD0]">Visualizar Setor</Link>
                        </li>
                        <li>
                            <span className="text-[#008DD0] mx-1">/</span>
                            <span className="font-medium text-[#008DD0]">Editar Curso</span>
                        </li>
                    </ol>
                </nav>

                <div className="max-w mx-auto w-full bg-white pb-10 pt-0">
                    <div className="mt-2 mb-1 w-fit">
                        <h1 className="text-2xl text-black">Editar Curso</h1>
                        <hr className="mt-1 bg-[#008DD0] h-0.5" />
                    </div>
                    <form onSubmit={submitCursoUpdate} className="grid grid-cols-1 gap-4 md:grid-cols-6">
                        <div className="md:col-span-6 mt-5">
                            <label htmlFor="nome" className="block mb-2">Nome do Curso</label>
                            <input
                                type="text"
                                id="nome"
                                className="w-full pl-2 pr-2 py-2 border border-[#008DD0] rounded-md focus:outline-none focus:border-[#145F7F] text-black shadow-md"
                                value={curso.nome}
                                onChange={e => setCurso({ ...curso, nome: e.target.value })}
                                placeholder="Nome do Curso"
                                required
                            />
                        </div>

                        <div className="md:col-span-6 flex justify-between gap-2 mt-4">
                            <Link href={`/setores/cursos?id-setor=${setorId}`} className="w-full md:w-auto">
                                <Button type="button" variant="secondary" className="flex items-center bg-[#808080] hover:bg-[#404040] gap-2 rounded-md px-4 py-2 text-sm shadow-md transition-colors duration-200 text-white">
                                    <ChevronLeft />
                                    Voltar
                                </Button>
                            </Link>
                            <Button type="submit" className="flex items-center bg-[#008DD0] hover:bg-[#145F7F] gap-2 rounded-md px-4 py-2 text-sm shadow-md transition-colors duration-200 text-white" disabled={carregando}>
                                {carregando ? 'Salvando...' : 'Editar Curso'}
                                <ChevronRight />
                            </Button>
                        </div>

                        {mensagem && (
                            <div className="md:col-span-6 mt-2 text-center">
                                <span className={mensagem.includes('sucesso') ? 'text-green-600' : 'text-red-600'}>
                                    {mensagem}
                                </span>
                            </div>
                        )}
                    </form>

                    {/* Modal de Sucesso */}
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
                                    onClick={e => e.stopPropagation()}
                                >
                                    <h2 className="text-xl font-semibold mb-4 text-green-600">Curso atualizado com sucesso!</h2>
                                    <button
                                        className="mt-2 px-6 py-2 bg-[#008DD0] hover:bg-[#0072d0] text-white rounded shadow"
                                        onClick={() => window.location.href = `/setores/cursos?id-setor=${setorId}`}
                                    >
                                        Voltar para Cursos
                                    </button>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </AppLayout>
    );
}
