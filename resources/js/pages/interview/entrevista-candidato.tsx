import AppLayout from '@/layouts/app-layout';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash, ChevronLeft } from 'lucide-react';
import { SharedData } from '@/types';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export default function EntrevistaCandidato() {
    const { auth } = usePage<SharedData>().props;
    const queryParams = new URLSearchParams(window.location.search);

    const nome = queryParams.get('nome') || '';
    const email = queryParams.get('email') || '';
    const telefone = queryParams.get('telefone') || '';
    const candidacyId = queryParams.get('id-candidatura') || '';
    const processId = queryParams.get('id-processo') || '';
    const vacancyId = queryParams.get('id-vaga') || '';
    console.log('processId', processId, 'vacancyId', vacancyId);

    const [entrevista, setEntrevista] = useState<any>(null);
    const [carregando, setCarregando] = useState(true);

    // Estado para modal de confirmação e sucesso
    const [modalCancelar, setModalCancelar] = useState(false);
    const [modalSucesso, setModalSucesso] = useState(false);

    useEffect(() => {
        if (!candidacyId) return;
        fetch(`/api/candidacy/${candidacyId}/interview`)
            .then(res => res.json())
            .then(data => {
                setEntrevista(data);
                setCarregando(false);
            })
            .catch(() => setCarregando(false));
    }, [candidacyId]);

    // Funções para editar/cancelar
    const handleEditar = () => {
        router.visit(
            `/editar-entrevista?` +
            `id-entrevista=${entrevista.id}` +
            `&id-candidatura=${candidacyId}` +
            `&nome=${encodeURIComponent(nome)}` +
            `&email=${encodeURIComponent(email)}` +
            `&telefone=${encodeURIComponent(telefone)}` +
            `&id-processo=${processId}` +
            `&id-vaga=${vacancyId}`
        );
    };

    // Função para cancelar a entrevista
    const cancelarEntrevista = async () => {
        try {
            const adminId = auth.user.id;
            const formData = new FormData();
            formData.append('_method', 'PUT');
            formData.append('data_hora', entrevista.data_hora);
            formData.append('status', 'Cancelada');
            formData.append('localizacao', entrevista.localizacao);

            const res = await fetch(`/api/admin/${adminId}/candidacy/${candidacyId}/interview/${entrevista.id}`, {
                method: 'POST',
                body: formData,
                credentials: 'include',
            });

            if (res.ok) {
                setModalSucesso(true);
                setEntrevista({ ...entrevista, status: 'Cancelada' });
            } else {
                alert('Erro ao cancelar entrevista');
            }
        } catch {
            alert('Erro ao conectar com o servidor');
        }
    };

    return (
        <AppLayout>
            <Head title="Entrevista Candidato" />
            <div className="flex h-full max-h-full flex-1 flex-col  rounded-xl p-4">
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
                    </ol>
                </nav>
                <div className="relative border-sidebar-border/70 dark:border-sidebar-border max-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min flex items-center justify-center mt-6">
                    {/* Dados do candidato no canto superior esquerdo */}
                    <div className="absolute top-4 left-8 text-left">
                        <h2 className="text-2xl">{nome}</h2>
                        <p className="text-lg">E-mail: <span >{email}</span></p>
                        <p className="text-lg">Telefone: <span >{telefone}</span></p>
                    </div>
                    <div className="text-center flex items-center justify-center h-full px-8 w-full">
                        <div className="tracking-wide max-w-3x1 w-full break-words whitespace-normal">
                            {/* Mensagem acima da linha azul */}
                            {!carregando && !(entrevista && entrevista.id) && (
                                <>
                                    <h2 className="text-xl font-semibold block leading-tight break-words">
                                        O candidato <b>{nome}</b> não possui entrevista cadastrada
                                    </h2>
                                    <hr className="mb-4 w-[500px] mx-auto bg-[#008DD0] h-0.5 rounded" />

                                </>
                            )}
                            {carregando ? (
                                <p>Carregando...</p>
                            ) : entrevista && entrevista.id ? (
                                <><div className="w-full flex justify-center">
                                        <div className="mt-2 mb-4 w-fit text-center">
                                            <h1 className="text-2xl text-black">Entrevista</h1>
                                            <hr className="mt-1 bg-[#008DD0] h-0.5" />
                                        </div>
                                    </div><form className="grid grid-cols-1 gap-4 md:grid-cols-6">
                                            <div className="md:col-span-2 mt-2">
                                                <label className="block mb-2">Data</label>
                                                <input
                                                    type="date"
                                                    className="w-full pl-2 pr-2 py-2 border border-[#008DD0] rounded-md focus:outline-none focus:border-[#145F7F] text-black shadow-md"
                                                    value={entrevista.data_hora ? new Date(entrevista.data_hora).toISOString().slice(0, 10) : ''}
                                                    disabled />
                                            </div>
                                            <div className="md:col-span-2 mt-2">
                                                <label className="block mb-2">Horário</label>
                                                <input
                                                    type="time"
                                                    className="w-full pl-2 pr-2 py-2 border border-[#008DD0] rounded-md focus:outline-none focus:border-[#145F7F] text-black shadow-md"
                                                    value={entrevista.data_hora ? new Date(entrevista.data_hora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : ''}
                                                    disabled />
                                            </div>
                                            <div className="md:col-span-2 mt-2">
                                                <label className="block mb-2">Local</label>
                                                <input
                                                    type="text"
                                                    className="w-full pl-2 pr-2 py-2 border border-[#008DD0] rounded-md focus:outline-none focus:border-[#145F7F] text-black shadow-md"
                                                    value={entrevista.localizacao || ''}
                                                    disabled />
                                            </div>
                                            {/* <div className="md:col-span-2 mt-2">
                                                <label className="block mb-2">Status</label>
                                                <input
                                                    type="text"
                                                    className="w-full pl-2 pr-2 py-2 border border-[#008DD0] rounded-md focus:outline-none focus:border-[#145F7F] text-black shadow-md"
                                                    value={entrevista.status || ''}
                                                    disabled />
                                            </div> */}
                                            <div className="md:col-span-6 flex justify-center gap-2 mb-2 mt-4">
                                                <button
                                                    type="button"
                                                    className="flex items-center bg-[#20CD4E] hover:bg-green-600 gap-2 rounded-md px-4 py-2 text-sm shadow-md text-white"
                                                    onClick={handleEditar}
                                                >
                                                    <Pencil /> Editar
                                                </button>
                                                {entrevista.status === 'Agendada' && (
                                                    <button
                                                        type="button"
                                                        className="flex items-center bg-red-600 hover:bg-red-700 gap-2 rounded-md px-4 py-2 text-sm shadow-md text-white"
                                                        onClick={() => setModalCancelar(true)}
                                                    >
                                                        <Trash /> Cancelar
                                                    </button>
                                                )}
                                            </div>

                                        </form></>
                            ) : (
                                <div>
                                    <p className="text-sm text-[#008DD0] mt-1">
                                        Clique no botão para adicionar uma entrevista
                                    </p>
                                    {auth.user.tipo_perfil === 'Admin' && (
                                        <Link
                                            href={`/adicionar-entrevista?id-candidatura=${candidacyId}&nome=${encodeURIComponent(nome)}&email=${encodeURIComponent(email)}&telefone=${encodeURIComponent(telefone)}&id-processo=${processId}&id-vaga=${vacancyId}`}
                                        >
                                            <Button className="p-4 sm:p-6 bg-[#008DD0] hover:bg-[#0072d0] mt-4 text-sm sm:text-base">
                                                Adicionar entrevista <Plus />
                                            </Button>
                                        </Link>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="mt-6 mb-6">
                    <Link
                        href={`/processo/vagas/ver-candidatos?id-processo=${processId}&id-vaga=${vacancyId}`}
                        className="w-full md:w-auto"
                    >
                        <Button type="button" variant="secondary" className="flex items-center bg-[#808080] hover:bg-[#404040] gap-2 rounded-md px-4 py-2 text-sm shadow-md transition-colors duration-200 text-white">
                            <ChevronLeft />
                            Voltar
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Modal de confirmação de cancelamento */}
            <AnimatePresence>
                {modalCancelar && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setModalCancelar(false)}
                    >
                        <motion.div
                            className="bg-white w-full max-w-sm rounded-xl shadow-lg p-8 relative flex items-center"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                            onClick={e => e.stopPropagation()}>
                            <div>
                                <h2 className="text-xl font-semibold mb-4 text-red-600">Você tem certeza que deseja cancelar esta entrevista?</h2>
                                <div className="flex gap-4 mt-2">
                                    <button
                                        className="mt-2 px-6 py-2 bg-[#008DD0] hover:bg-[#0072d0] text-white rounded shadow"
                                        onClick={async () => {
                                            await cancelarEntrevista();
                                            setModalCancelar(false);
                                        }}
                                    >
                                        Confirmar
                                    </button>
                                    <button
                                        className="mt-2 px-6 py-2 bg-gray-400 hover:bg-gray-600 text-white rounded shadow"
                                        onClick={() => setModalCancelar(false)}
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Modal de sucesso */}
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
                            <h2 className="text-xl font-semibold mb-4 text-green-600">Entrevista cancelada com sucesso!</h2>
                            <button
                                className="mt-2 px-6 py-2 bg-[#008DD0] hover:bg-[#0072d0] text-white rounded shadow"
                                onClick={() => window.location.reload()}
                            >Concluir
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </AppLayout>
    );
}