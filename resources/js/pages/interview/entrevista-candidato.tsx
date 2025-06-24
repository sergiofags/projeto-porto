import AppLayout from '@/layouts/app-layout';
import { Head, Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { SharedData } from '@/types';
import { useEffect, useState } from 'react';

export default function EntrevistaCandidato() {
    const { auth } = usePage<SharedData>().props;
    const queryParams = new URLSearchParams(window.location.search);

    const nome = queryParams.get('nome') || '';
    const email = queryParams.get('email') || '';
    const telefone = queryParams.get('telefone') || '';
    const candidacyId = queryParams.get('id-candidatura') || '';

    const [entrevista, setEntrevista] = useState<any>(null);
    const [carregando, setCarregando] = useState(true);

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

    return (
        <AppLayout>
            <Head title="Entrevista Candidato" />
            <div className="flex h-full max-h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <nav className="text-sm text-muted-foreground mb-4 items-center">
                    <ol className="flex items-center space-x-2">
                        <li>
                            <Link href={route('inicio-processo')} className="hover:underline">Início</Link>
                        </li>
                        <li className="flex items-center space-x-2">
                            <span>/</span>
                            <span className="font-medium">Entrevista Candidato</span>
                        </li>
                    </ol>
                </nav>

                <div className="relative border-sidebar-border/70 dark:border-sidebar-border max-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min flex items-center justify-center">
                    {/* Dados do candidato no canto superior esquerdo */}
                    <div className="absolute top-4 left-8 text-left">
                        <h2 className="text-2xl font-bold">{nome}</h2>
                        <p className="text-lg">E-mail: <span className="font-semibold">{email}</span></p>
                        <p className="text-lg">Telefone: <span className="font-semibold">{telefone}</span></p>
                    </div>
                    <div className="text-center flex items-center justify-center h-full px-4 w-full">
                        <div className="tracking-wide max-w-md w-full break-words whitespace-normal">
                            {/* Mensagem acima da linha azul */}
                            {!carregando && !(entrevista && entrevista.id) && (
                                <h2 className="text-2xl text-black">
                                    O candidato <b>{nome}</b> não possui entrevista cadastrada.
                                </h2>
                            )}
                            <hr className="mb-4 w-full bg-[#008DD0] h-0.5" />
                            {carregando ? (
                                <p>Carregando...</p>
                            ) : entrevista && entrevista.id ? (
                                <form className="grid grid-cols-1 gap-4 md:grid-cols-6">
                                    <div className="md:col-span-2 mt-5">
                                        <label className="block mb-2">Data</label>
                                        <input
                                            type="date"
                                            className="w-full pl-2 pr-2 py-2 border border-[#008DD0] rounded-md focus:outline-none focus:border-[#145F7F] text-black shadow-md"
                                            value={entrevista.data_hora ? new Date(entrevista.data_hora).toISOString().slice(0, 10) : ''}
                                            disabled
                                        />
                                    </div>
                                    <div className="md:col-span-2 mt-5">
                                        <label className="block mb-2">Horário</label>
                                        <input
                                            type="time"
                                            className="w-full pl-2 pr-2 py-2 border border-[#008DD0] rounded-md focus:outline-none focus:border-[#145F7F] text-black shadow-md"
                                            value={entrevista.data_hora ? new Date(entrevista.data_hora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : ''}
                                            disabled
                                        />
                                    </div>
                                    <div className="md:col-span-2 mt-5">
                                        <label className="block mb-2">Local</label>
                                        <input
                                            type="text"
                                            className="w-full pl-2 pr-2 py-2 border border-[#008DD0] rounded-md focus:outline-none focus:border-[#145F7F] text-black shadow-md"
                                            value={entrevista.localizacao || ''}
                                            disabled
                                        />
                                    </div>
                                    {/* <div className="md:col-span-6 mt-5">
                                        <label className="block mb-2">Status</label>
                                        <input
                                            type="text"
                                            className="w-full pl-2 pr-2 py-2 border border-[#008DD0] rounded-md focus:outline-none focus:border-[#145F7F] text-black shadow-md"
                                            value={entrevista.status || ''}
                                            disabled
                                        />
                                    </div> */}
                                </form>
                            ) : (
                                <div>
                                    <p className="text-[#008DD0] mt-1 mb-4 text-lg">
                                        Clique no botão <b>Adicionar Entrevista</b> para adicionar uma entrevista.
                                    </p>
                                    {auth.user.tipo_perfil === 'Admin' && (
                                        <Link href={`/adicionar-entrevista?id-candidatura=${candidacyId}&nome=${encodeURIComponent(nome)}&email=${encodeURIComponent(email)}&telefone=${encodeURIComponent(telefone)}`}>
                                            <Button className="p-4 sm:p-6 bg-[#008DD0] hover:bg-[#0072d0] mt-4 text-base sm:text-lg">
                                                Adicionar entrevista <Plus />
                                            </Button>
                                        </Link>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}