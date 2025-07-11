import axios from 'axios';
import AppLayout from '@/layouts/app-layout';
import { SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

type Setor = {
    id: string;
    nome: string;
};

export default function DetalhesVaga() {

    const { auth } = usePage<SharedData>().props;
    const queryParams = new URLSearchParams(window.location.search);
    const processId = queryParams.get('id-processo');
    const vacancyId = queryParams.get('id-vaga');
    const adminId = auth.user.id;
    
    const [setor, setSetor] = useState<Setor>();

    const [vaga, setVaga] = useState<Array<{
        id_process: string;
        id: string;
        titulo: string;
        responsabilidades: string | null;
        requisitos: string | null;
        carga_horaria: string;
        remuneracao: number;
        beneficios: string | null;
        quantidade: number;
        status: 'Aberto' | 'Fechado';
        setor_id: string;
    }>>([]);

    useEffect(() => {
        const fetchVacancy = async () => {
            try {
                const responseVacancy = await axios.get(`http://localhost:8000/api/process/${processId}/vacancy/${vacancyId}`);
                
                if (!responseVacancy.data) {
                    return;
                }

                setVaga(Array.isArray(responseVacancy.data) ? responseVacancy.data : [responseVacancy.data]);

                const responseSetor = await axios.get(`http://localhost:8000/api/setores/${responseVacancy.data.setor_id}`);

                setSetor(responseSetor.data);

            } catch {
                alert("An error occurred while fetching the vacancy data.");
                return;
            }
        };

        fetchVacancy();
    }, []);

    const [modalConfirmar, setModalConfirmar] = useState<{ aberto: boolean; vagaId?: string }>({ aberto: false, vagaId: undefined });
    const [modalSucesso, setModalSucesso] = useState(false);

    async function handleDelete(vagaId: string) {
        if (!processId || !vagaId) {
            alert("Id do processo ou vaga inválido");
            return;
        }

        try {
            await axios.delete(`http://localhost:8000/api/admin/${adminId}/process/${processId}/vacancy/${vagaId}/delete`);
            setModalConfirmar({ aberto: false, vagaId: undefined });
            setModalSucesso(true);
        } catch {
            return
        }
    }

    return (
        <AppLayout>
            <Head title="Detalhes da Vaga" />
            <nav className="text-sm text-muted-foreground ml-4 mt-4 mb-4">
                <ol className="flex items-center space-x-2">
                    <li>
                        <Link href="/" className="hover:underline text-[#008DD0]">Início</Link>
                    </li>
                    <li>
                        <span className="mx-1 text-[#008DD0]">/</span>
                        <span className="text-[#008DD0]">Visualizar Cadastros Reserva</span>
                    </li>
                    <li>
                        <span className="mx-1 text-[#008DD0]">/</span>
                        <span className="font-medium text-[#008DD0]">Visualizar Detalhes do Cadastro Reserva</span>
                    </li>
                </ol>
            </nav>
            <div className="grid gap-4 pl-4 pr-4">
                <div className="border rounded p-4 pl-10 pr-10 ">

                    {vaga.map((item) => (
                        <div key={item.id}>
                            <h1 className="text-2xl text-black">{item.titulo}</h1>

                            <div className="flex flex-col sm:flex-row gap-2 mt-6 mb-6">
                                <Button type="button" className="flex-1 p-4 sm:p-6 bg-[#008DD0] hover:bg-[#0072d0] text-xs mt-4 text-sm">
                                    <Link href={`/processo/vagas/ver-candidatos?id-processo=${item.id_process}&id-vaga=${item.id}`} className="w-full">
                                        Ver candidatos
                                    </Link>
                                </Button>
                                <Button type="button" className="flex-1 p-4 sm:p-6  bg-[#CD5C20] hover:bg-[#943400] mt-4 text-sm ">
                                    <Link href={`/processo/vagas/classificacao?id-processo=${item.id_process}&id-vaga=${item.id}`} className="w-full">
                                        Classificação
                                    </Link>
                                </Button>
                                <Button type="button" className="flex-1 p-4 sm:p-6 bg-green-500 hover:bg-green-600 mt-4 text-sm ">
                                    <Link href={`/processo/vagas/editar?id-processo=${item.id_process}&id-vaga=${item.id}`} className="w-full">
                                        Editar
                                    </Link>
                                </Button>
                                <Button type="button" className="flex-1 p-4 sm:p-6  bg-red-600 hover:bg-red-800 mt-4 text-sm ">
                                    <span
                                        className="w-full cursor-pointer"
                                        onClick={() => setModalConfirmar({ aberto: true, vagaId: item.id })}
                                    >
                                        Fechar
                                    </span>
                                </Button>
                            </div>
                            <h1 className="text-xl text-black">Descrição:</h1>
                            <p>A SCPAR Porto de Imbituba torna pública a realização de processo seletivo simplificado para estágio curricular não obrigatório para estudantes dos cursos acima referidos, durante o período de 01 (um) ano, podendo ser prorrogado por igual período.</p>

                            <br></br>
                            <h1 className="text-xl text-black">Responsabilidades:</h1>
                            <p>{item.responsabilidades || 'Não informado'}</p>

                            <br></br>
                            <h1 className="text-xl text-black">Requisitos:</h1>
                            <p>{item.requisitos || 'Não informado'}</p>

                            {/* <p>Carga Horária: <br></br>{item.carga_horaria}</p>
                            <p>Remuneração: <br></br>R$ {item.remuneracao.toFixed(2)}</p> */}
                            <br></br>
                            <h1 className="text-xl text-black">Benefícios:</h1>
                            <p>{item.beneficios || 'Não informado'}</p>

                            <br></br>
                            <h1 className="text-xl text-black">Status:</h1>
                            <p>{item.status}</p>

                            <br></br>
                            <h1 className="text-xl text-black">Setor:</h1>
                            <p>{setor ? setor.nome : 'Setor não informado'}</p>
                        </div>
                    ))}


                   
                </div>
                <div className="mt-6 mb-6">
                        <Link className="w-fit flex" href={`/processo/vagas?id=${processId}`}>
                            <Button
                                className="flex items-center gap-2 rounded-md px-4 py-2 text-sm duration-200 bg-gray-500 text-white shadow-xs hover:bg-gray-600">
                                <ChevronLeft /> Voltar
                            </Button>
                        </Link>
                </div>
            </div>
            <AnimatePresence>
                {modalConfirmar.aberto && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setModalConfirmar({ aberto: false, vagaId: undefined })}
                    >
                        <motion.div
                            className="bg-white w-full max-w-sm rounded-xl shadow-lg p-8 relative flex items-center"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                            onClick={e => e.stopPropagation()}>
                            <div>
                                <h2 className="text-xl font-semibold mb-4 text-red-600">Você tem certeza que deseja excluir este cadastro reserva?</h2>
                                <div className="flex gap-4 mt-2">
                                    <button
                                        className="mt-2 px-6 py-2 bg-[#008DD0] hover:bg-[#0072d0] text-white rounded shadow"
                                        onClick={() => handleDelete(modalConfirmar.vagaId!)}
                                    >
                                        Confirmar
                                    </button>
                                    <button
                                        className="mt-2 px-6 py-2 bg-gray-400 hover:bg-gray-600 text-white rounded shadow"
                                        onClick={() => setModalConfirmar({ aberto: false, vagaId: undefined })}
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
                            <h2 className="text-xl font-semibold mb-4 text-green-600"> Cadastro reserva encerrado com sucesso!</h2>
                            <button
                                className="mt-2 px-6 py-2 bg-[#008DD0] hover:bg-[#0072d0] text-white rounded shadow"
                                onClick={() => router.visit(`/processo/vagas?id=${processId}`)}
                            >
                                Voltar para Cadastros reserva
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </AppLayout>
    );
}