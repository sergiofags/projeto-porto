import { useState, useEffect } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { SharedData } from '@/types';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function AdicionarEntrevista() {
    const { auth } = usePage<SharedData>().props;
    const adminId = auth.user.id; // Certifique-se que esse campo está correto

    // Estados do formulário
    const [data, setData] = useState('');
    const [hora, setHora] = useState('');
    const [local, setLocal] = useState('');
    const [status, setStatus] = useState('Agendada');
    const [mensagem, setMensagem] = useState('');
    const [carregando, setCarregando] = useState(false);
    const [modalAberto, setModalAberto] = useState(false);

    // Você pode precisar passar o candidacyId via props, query ou contexto
    const queryParams = new URLSearchParams(window.location.search);
    const candidacyId = queryParams.get('id-candidatura');
    const nome = queryParams.get('nome');
    const email = queryParams.get('email');
    const telefone = queryParams.get('telefone');
    const interviewId = queryParams.get('id-entrevista');
    const processId = queryParams.get('id-processo') || '';
    const vacancyId = queryParams.get('id-vaga') || '';

    // Buscar dados da entrevista ao carregar a página
    useEffect(() => {
        if (!candidacyId || !interviewId) return;
        fetch(`/api/candidacy/${candidacyId}/interview`)
            .then(res => res.json())
            .then(data => {
                if (data && data.id === Number(interviewId)) {
                    if (data.data_hora) {
                        const dt = new Date(data.data_hora);
                        setData(dt.toISOString().slice(0, 10));
                        setHora(dt.toTimeString().slice(0, 5));
                    }
                    setLocal(data.localizacao || '');
                    setStatus(data.status || 'Agendada');
                }
            });
    }, [candidacyId, interviewId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMensagem('');
        setCarregando(true);

        // Monta data_hora no formato ISO
        let dataHora = '';
        if (data && hora) {
            dataHora = `${data}T${hora}:00`;
        }

        const payload = {
            data_hora: dataHora,
            status,
            localizacao: local,
        };

        try {
            const res = await fetch(`/api/admin/${adminId}/candidacy/${candidacyId}/interview/${interviewId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
                credentials: 'include',
            });

            if (res.ok) {
                setMensagem('Entrevista editada com sucesso!');
                setData('');
                setHora('');
                setLocal('');
                setStatus('Agendada');
                setModalAberto(true);
            } else {
                const err = await res.json();
                setMensagem(err.message || 'Erro ao editar entrevista');
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
                <nav className="text-sm text-muted-foreground ">
                    <ol className="flex items-center space-x-2">
                        <li>
                            <Link href="/" className="hover:underline text-[#008DD0]">Início</Link>
                        </li>
                        <li>
                            <span className=" text-[#008DD0]">/</span>
                            <span className="text-[#008DD0]">Visualizar Cadastros Reserva</span>
                        </li>
                        <li>
                            <span className=" text-[#008DD0] mx-1 ">/</span>
                            <span className=" text-[#008DD0]">Visualizar Detalhes do Cadastro Reserva</span>
                        </li>
                        <li>
                            <span className=" text-[#008DD0] mx-1 ">/</span>
                            <span className="text-[#008DD0]">Ver Candidatos</span>
                        </li>
                        <li>
                            <span className=" text-[#008DD0] mx-1 ">/</span>
                            <span className="font-medium text-[#008DD0]">Entrevista Candidato</span>
                        </li>
                         <li>
                            <span className=" text-[#008DD0] mx-1 ">/</span>
                            <span className="font-medium text-[#008DD0]">Editar Entrevista</span>
                        </li>
                    </ol>
                </nav>
                 <div className="mt-2 mb-1 w-fit">
                    <h1 className="text-2xl text-black">Editar Entrevista</h1>
                    <hr className="mt-1 bg-[#008DD0] h-0.5 " />
                </div>
                <div className="max-w mx-auto w-full bg-white">
                    {/* Dados do candidato no canto superior esquerdo */}
                    <div className="mb-6 mt-6 text-left">
                        <h2 className="text-2xl">{nome}</h2>
                        <p className="text-lg">E-mail: <span>{email}</span></p>
                        <p className="text-lg">Telefone: <span>{telefone}</span></p>
                    </div>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-6">
                        <div className="md:col-span-2 mt-5">
                            <label htmlFor="data" className="block mb-2">Data</label>
                            <input
                                type="date"
                                id="data"
                                name="data"
                                className="w-full pl-2 pr-2 py-2 border border-[#008DD0] rounded-md focus:outline-none focus:border-[#145F7F] text-black shadow-md"
                                value={data}
                                onChange={e => setData(e.target.value)}
                                required
                            />
                        </div>
                        <div className="md:col-span-2 mt-5">
                            <label htmlFor="hora" className="block mb-2">Horário</label>
                            <input
                                type="time"
                                id="hora"
                                name="hora"
                                className="w-full pl-2 pr-2 py-2 border border-[#008DD0] rounded-md focus:outline-none focus:border-[#145F7F] text-black shadow-md"
                                value={hora}
                                onChange={e => setHora(e.target.value)}
                                required
                            />
                        </div>
                        <div className="md:col-span-2 mt-5">
                            <label htmlFor="local" className="block mb-2">Local</label>
                            <input
                                type="text"
                                id="local"
                                name="local"
                                className="w-full pl-2 pr-2 py-2 border border-[#008DD0] rounded-md focus:outline-none focus:border-[#145F7F] text-black shadow-md"
                                value={local}
                                onChange={e => setLocal(e.target.value)}
                                placeholder="Ex: Prédio Administração SCPAR Porto de Imbituba"
                                required
                            />
                        </div>
                        <div className="md:col-span-2 mt-5">
                            <label htmlFor="status" className="block mb-2">Status</label>
                            <select
                                id="status"
                                name="status"
                                className="w-full pl-2 pr-2 py-2 border border-[#008DD0] rounded-md focus:outline-none focus:border-[#145F7F] text-black shadow-md"
                                value={status}
                                onChange={e => setStatus(e.target.value)}
                                required
                            >
                                <option value="Agendada">Agendada</option>
                                <option value="Finalizada">Finalizada</option>
                                <option value="Cancelada">Cancelada</option>
                            </select>
                        </div>
                        <div className="md:col-span-6 flex justify-between gap-2 mt-4">
                            <Link
                                href={`/entrevista-candidato?nome=${encodeURIComponent(nome || '')}&email=${encodeURIComponent(email || '')}&telefone=${encodeURIComponent(telefone || '')}&id-candidatura=${candidacyId}&id-processo=${processId}&id-vaga=${vacancyId}`}
                                className="w-full md:w-auto"
                            >
                                <Button type="button" variant="secondary" className="flex items-center bg-[#808080] hover:bg-[#404040] gap-2 rounded-md px-4 py-2 text-sm shadow-md transition-colors duration-200 text-white">
                                    <ChevronLeft />
                                    Cancelar
                                </Button>
                            </Link>
                            <Button type="submit" className="flex items-center bg-[#008DD0] hover:bg-[#145F7F] gap-2 rounded-md px-4 py-2 text-sm shadow-md transition-colors duration-200 text-white" disabled={carregando}>
                                {carregando ? 'Salvando...' : 'Salvar'}
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
                    {modalAberto && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                            <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full flex flex-col items-center">
                                <h2 className="text-xl font-semibold mb-4 text-green-600">Entrevista editada com sucesso!</h2>
                                <button
                                    className="mt-2 px-6 py-2 bg-[#008DD0] hover:bg-[#0072d0] text-white rounded shadow"
                                    onClick={() =>
                                        router.visit(
                                            `/entrevista-candidato?` +
                                            `id-candidatura=${candidacyId}` +
                                            `&nome=${encodeURIComponent(nome || '')}` +
                                            `&email=${encodeURIComponent(email || '')}` +
                                            `&telefone=${encodeURIComponent(telefone || '')}` +
                                            `&id-processo=${processId}` +
                                            `&id-vaga=${vacancyId}`
                                        )
                                    }
                                >
                                    Voltar para Entrevista Candidato
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}