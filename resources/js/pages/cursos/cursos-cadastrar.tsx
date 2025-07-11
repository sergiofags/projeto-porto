import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function CadastrarCurso() {
    const queryParams = new URLSearchParams(window.location.search);
    const setorId = queryParams.get('id-setor');

    const [curso, setCurso] = useState({ nome: '' });
    const [mensagem, setMensagem] = useState('');
    const [carregando, setCarregando] = useState(false);
    const [modalAberto, setModalAberto] = useState(false);

    const submitCurso = async (e: React.FormEvent) => {
        e.preventDefault();
        setMensagem('');
        setCarregando(true);

        try {
            const response = await fetch(`http://localhost:8000/api/courses/setor/${setorId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(curso),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Erro ao cadastrar o curso');
            }

            setMensagem('Curso cadastrado com sucesso!');
            setCurso({ nome: '' });
            setModalAberto(true);
        } catch (error: any) {
            setMensagem(error.message || 'Erro ao conectar com o servidor');
        } finally {
            setCarregando(false);
        }
    };

    return (
        <AppLayout>
            <Head title="Cadastrar Curso" />
            <div className="flex h-full max-h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {/* Breadcrumb */}
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
                            <span className="font-medium text-[#008DD0]">Cadastrar Curso</span>
                        </li>
                    </ol>
                </nav>

                {/* Título */}
                <div className="mt-2 mb-1 w-fit">
                    <h1 className="text-2xl text-black">Cadastrar Curso</h1>
                    <hr className="mt-1 bg-[#008DD0] h-0.5" />
                </div>

                {/* Formulário */}
                <div className="w-full bg-white">
                    <form onSubmit={submitCurso} className="grid gap-4 md:grid-cols-6">
                        <div className="md:col-span-6">
                            <label htmlFor="nome" className="block mb-2">Nome do Curso</label>
                            <input
                                id="nome"
                                type="text"
                                value={curso.nome}
                                onChange={(e) => setCurso({ ...curso, nome: e.target.value })}
                                placeholder="Nome do curso"
                                className="w-full pl-2 pr-2 py-2 border border-[#008DD0] rounded-md focus:outline-none focus:border-[#145F7F] text-black shadow-md"
                                required
                            />
                        </div>

                        <div className="md:col-span-6 flex justify-between gap-2 mt-2">
                            <Link href={`/setores/cursos?id-setor=${setorId}`} className="w-full md:w-auto">
                                <Button type="button" variant="secondary" className="bg-[#808080] hover:bg-[#404040] text-white">
                                    <ChevronLeft /> Voltar
                                </Button>
                            </Link>
                            <Button
                                type="submit"
                                className="bg-[#008DD0] hover:bg-[#145F7F] text-white"
                                disabled={carregando}
                            >
                                {carregando ? 'Salvando...' : 'Concluir'} <ChevronRight />
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

                    {/* Modal de sucesso */}
                    {modalAberto && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                            <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full flex flex-col items-center">
                                <h2 className="text-xl font-semibold mb-4 text-green-600">Curso cadastrado com sucesso!</h2>
                                <button
                                    className="mt-2 px-6 py-2 bg-[#008DD0] hover:bg-[#0072d0] text-white rounded shadow"
                                    onClick={() => router.visit(`/setores/cursos?id-setor=${setorId}`)}
                                >
                                    Voltar para Cursos
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
