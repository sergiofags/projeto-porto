import { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { SharedData } from '@/types';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronLeft, ChevronRight, Paperclip } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export default function CadastraProcesso() {
    const { auth } = usePage<SharedData>().props;
    const adminId = auth.user.id; // Certifique-se que esse campo está correto

    // Estados do formulário
    const [descricao, setDescricao] = useState('');
    const [numeroProcesso, setNumeroProcesso] = useState('');
    const [edital, setEdital] = useState<File | null>(null);
    const [dataInicio, setDataInicio] = useState('');
    const [dataFim, setDataFim] = useState('');
    const [status, setStatus] = useState('');
    const [mensagem, setMensagem] = useState('');
    const [carregando, setCarregando] = useState(false);
    const [aberto, setAberto] = useState(false);
    const [modalAberto, setModalAberto] = useState(false); // Estado para controlar a exibição do modal

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMensagem('');
        setCarregando(true);

        const formData = new FormData();
        formData.append('descricao', descricao);
        formData.append('numero_processo', numeroProcesso);
        if (edital) formData.append('edital', edital);
        formData.append('data_inicio', dataInicio);
        formData.append('data_fim', dataFim);
        formData.append('status', status);

        try {
            const res = await fetch(`/api/admin/${adminId}/process`, {
                method: 'POST',
                body: formData,
                credentials: 'include', // Garante envio de cookies (auth)
            });

            if (res.ok) {
                setMensagem('');
                setDescricao('');
                setNumeroProcesso('');
                setEdital(null);
                setDataInicio('');
                setDataFim('');
                setStatus('Pendente');
                setModalAberto(true); // Abre o modal
            } else {
                const err = await res.json();
                setMensagem(err.message || 'Erro ao cadastrar processo');
            }
        } catch {
            setMensagem('Erro ao conectar com o servidor');
        } finally {
            setCarregando(false);
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
                            <span className="font-medium">Cadastro do Processo</span>
                        </li>
                    </ol>
                </nav>
                <div className="max-w mx-auto w-full bg-white p-10">
                   <div className="mt-2 mb-1 w-fit">
                        <h1 className="text-2xl text-black">Cadastro do Processo</h1>
                        <hr className="mt-1 bg-[#008DD0] h-0.5" />
                    </div>
                <form onSubmit={handleSubmit} encType="multipart/form-data" className="grid grid-cols-1 gap-4 md:grid-cols-6">
                    <div className="md:col-span-4 mt-5">
                        <label htmlFor="descricao"  className="block mb-2">Descrição</label>
                        <input
                            type="text"
                            id="descricao"
                            name="descricao"
                            className="w-full pl-2 pr-2 py-2 border border-[#008DD0] rounded-md focus:outline-none focus:border-[#145F7F] text-black shadow-md"
                            value={descricao}
                            onChange={e => setDescricao(e.target.value)}
                            placeholder="Ex: Edital de Processo Seletivo de Estágio"
                            required
                        />
                    </div>
                    <div className="md:col-span-2 mt-5">
                        <label htmlFor="numero_processo" className="block mb-2">Número do Processo</label>
                        <input
                            type="text"
                            id="numero_processo"
                            name="numero_processo"
                            className="w-full pl-2 pr-2 py-2 border border-[#008DD0] rounded-md focus:outline-none focus:border-[#145F7F] text-black shadow-md"
                            value={numeroProcesso}
                            onChange={e => setNumeroProcesso(e.target.value)}
                            placeholder="Ex: Nº 001/2025"
                            required
                        />
                    </div>
                    <div className="md:col-span-2 mt-5">
                            <label htmlFor="edital" className="block mb-2">
                                Edital (PDF)
                            </label>
                            <div className="relative w-full">
                                <input
                                    id="edital"
                                    name="edital"
                                    type="file"
                                    accept="application/pdf"
                                    className={`w-full pr-10 pl-3 py-2 border border-[#008DD0] focus:outline-none focus:border-[#145F7F] rounded-md shadow-md file:hidden ${
                                        edital ? 'text-black' : 'text-[#9c9c9c]'
                                    }`}
                                    onChange={e => setEdital(e.target.files?.[0] || null)}
                                />

                                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[#9c9c9c]">
                                <Paperclip className="w-5 h-5" />
                                </div>
                            </div>
                    </div>
                    <div className="md:col-span-2 mt-5">
                        <label htmlFor="data_inicio" className="block mb-2">Data início inscrições</label>
                       <input
                            type="date"
                            id="data_inicio"
                            name="data_inicio"
                            className={`w-full pl-2 pr-2 py-2 border border-[#008DD0] rounded-md focus:outline-none focus:border-[#145F7F] shadow-md ${
                                dataInicio ? 'text-black' : 'text-[#9c9c9c]'
                            }`}
                            value={dataInicio}
                            onChange={e => setDataInicio(e.target.value)}
                            required
                        />
                    </div>
                    <div className="md:col-span-2 mt-5">
                        <label htmlFor="data_fim" className="block mb-2">Data fim inscrições</label>
                       <input
                            type="date"
                            id="data_fim"
                            name="data_fim"
                            className={`w-full pl-2 pr-2 py-2 border border-[#008DD0] rounded-md focus:outline-none focus:border-[#145F7F] shadow-md ${
                                dataFim ? 'text-black' : 'text-[#9c9c9c]'
                            }`}
                            value={dataFim}
                            onChange={e => setDataFim(e.target.value)}
                            required
                        />
                    </div>
                    <div className="md:col-span-2 mt-5">
                        <label htmlFor="status" className="block mb-2">Status</label>
                        <div className="relative w-full">
                            <div
                            className={`w-full cursor-pointer pl-2 pr-10 py-2 border border-[#008DD0] rounded-md shadow-md ${
                                status === '' ? 'text-[#9c9c9c]' : 'text-black'
                            }`}
                            onClick={() => setAberto(!aberto)}
                            >
                            {status === '' ? 'Selecione o status' : status}
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#008DD0]">
                                <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${aberto ? 'rotate-180' : ''}`} />
                            </div>
                            </div>

                            {aberto && (
                            <ul className="absolute z-20 mt-1 w-full bg-white border border-[#008DD0] rounded-md shadow-md text-black overflow-hidden">
                                {['Pendente', 'Aberto', 'Fechado'].map((option, index, arr) => (
                                <li
                                    key={option}
                                    className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${
                                    index === arr.length - 1 ? 'mt-2' : ''
                                    }`}
                                    onClick={() => {
                                    setStatus(option);
                                    setAberto(false);
                                    }}
                                >
                                    {option}
                                </li>
                                ))}
                            </ul>
                            )}
                        </div>
                    </div>
                    <div className="md:col-span-6 flex justify-between gap-2 mt-4">
                        <Link href={route('inicio-processo')} className="w-full md:w-auto">
                            <Button type="button" variant="secondary" className="flex items-center bg-[#808080] hover:bg-[#404040] gap-2 rounded-md px-4 py-2 text-sm shadow-md transition-colors duration-200 text-white">
                                <ChevronLeft />
                                Voltar
                            </Button>
                        </Link>
                        <Button type="submit" className="flex items-center bg-[#008DD0] hover:bg-[#145F7F] gap-2 rounded-md px-4 py-2 text-sm shadow-md transition-colors duration-200 text-white" disabled={carregando}>
                            {carregando ? 'Salvando...' : 'Concluir'}
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
                {/* Modal de sucesso */}
                    {/* {modalAberto && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                            <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full flex flex-col items-center">
                                <h2 className="text-xl font-semibold mb-4 text-green-600">Processo cadastrado com sucesso!</h2>
                                <button
                                    className="mt-2 px-6 py-2 bg-[#008DD0] hover:bg-[#0072d0] text-white rounded shadow"
                                    onClick={() => router.visit(route('inicio-processo'))}
                                >
                                    Voltar para Processos
                                </button>
                            </div>
                        </div>
                    )} */}

                    {/* Modal de sucesso com fundo blur */}
                        <AnimatePresence>
                            {modalAberto && (
                                <motion.div
                                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onClick={() => setModalAberto(false)}
                                >
                                    <motion.div
                                        className="bg-white w-full max-w-sm rounded-xl shadow-lg p-8 relative flex flex-col items-center"
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0.9, opacity: 0 }}
                                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                                        onClick={e => e.stopPropagation()}>
                                        <h2 className="text-xl font-semibold mb-4 text-green-600">Processo cadastrado com sucesso!</h2>
                                        <button
                                            className="mt-2 px-6 py-2 bg-[#008DD0] hover:bg-[#0072d0] text-white rounded shadow"
                                            onClick={() => router.visit(route('inicio-processo'))}>Voltar para Processos
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