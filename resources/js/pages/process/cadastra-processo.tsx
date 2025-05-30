import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

export default function CadastraProcesso() {
    const { auth } = usePage<SharedData>().props;
    const adminId = auth.user.id; // Certifique-se que esse campo está correto

    // Estados do formulário
    const [descricao, setDescricao] = useState('');
    const [numeroProcesso, setNumeroProcesso] = useState('');
    const [edital, setEdital] = useState<File | null>(null);
    const [dataInicio, setDataInicio] = useState('');
    const [dataFim, setDataFim] = useState('');
    const [status, setStatus] = useState('Pendente');
    const [mensagem, setMensagem] = useState('');
    const [carregando, setCarregando] = useState(false);

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
                setMensagem('Processo cadastrado com sucesso!');
                setDescricao('');
                setNumeroProcesso('');
                setEdital(null);
                setDataInicio('');
                setDataFim('');
                setStatus('Pendente');
            } else {
                const err = await res.json();
                setMensagem(err.message || 'Erro ao cadastrar processo');
            }
        } catch (error) {
            setMensagem('Erro ao conectar com o servidor');
        } finally {
            setCarregando(false);
        }
    };

    return (
        <AppLayout>
            <Head title="Cadastrar Processo" />
            <div className="flex h-full max-h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <nav className="text-sm text-muted-foreground mb-4">
                    <ol className="flex items-center space-x-2">
                        <li>
                            <Link href="/" className="hover:underline">Início</Link>
                        </li>
                        <li>
                            <span className="mx-1">/</span>
                            <span className="font-medium">Cadastrar Processo</span>
                        </li>
                    </ol>
                    <h1 className="text-2xl font-semibold mt-4 text-black">Olá, {auth.user.name.split(' ')[0]}.</h1>
                </nav>
                <div className="max-w-xl mx-auto w-full bg-white p-8 shadow rounded">
                    <h2 className="text-xl font-semibold mb-4">Cadastre o Processo</h2>
                    <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">
                        <div>
                            <label htmlFor="descricao" className="block text-sm font-medium text-gray-700">
                                Descrição:
                            </label>
                            <input
                                type="text"
                                id="descricao"
                                name="descricao"
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                value={descricao}
                                onChange={e => setDescricao(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="numero_processo" className="block text-sm font-medium text-gray-700">
                                Número do Processo:
                            </label>
                            <input
                                type="text"
                                id="numero_processo"
                                name="numero_processo"
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                value={numeroProcesso}
                                onChange={e => setNumeroProcesso(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="edital" className="block text-sm font-medium text-gray-700">
                                Edital:
                            </label>
                            <input
                                type="file"
                                id="edital"
                                name="edital"
                                accept="application/pdf" // <-- Aceita apenas arquivos PDF
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                onChange={e => setEdital(e.target.files?.[0] || null)}
                            />
                        </div>
                        <div>
                            <label htmlFor="data_inicio" className="block text-sm font-medium text-gray-700">
                                Data início inscrições:
                            </label>
                            <input
                                type="date"
                                id="data_inicio"
                                name="data_inicio"
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                value={dataInicio}
                                onChange={e => setDataInicio(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="data_fim" className="block text-sm font-medium text-gray-700">
                                Data fim inscrições:
                            </label>
                            <input
                                type="date"
                                id="data_fim"
                                name="data_fim"
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                value={dataFim}
                                onChange={e => setDataFim(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                                Status:
                            </label>
                            <select
                                id="status"
                                name="status"
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                value={status}
                                onChange={e => setStatus(e.target.value)}
                                required
                            >
                                <option value="Pendente">Pendente</option>
                                <option value="Aberto">Aberto</option>
                                <option value="Fechado">Fechado</option>
                            </select>
                        </div>
                        <div className="flex flex-row gap-2">
                            <Link href="/inicio-processo" className="w-full">
                                <Button type="button" variant="secondary" className="w-full">
                                    Voltar
                                </Button>
                            </Link>
                            <Button type="submit" className="w-full" disabled={carregando}>
                                {carregando ? 'Salvando...' : 'Cadastrar Processo'}
                            </Button>
                        </div>
                        {mensagem && (
                            <div className={`mt-2 text-center ${mensagem.includes('sucesso') ? 'text-green-600' : 'text-red-600'}`}>
                                {mensagem}
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}