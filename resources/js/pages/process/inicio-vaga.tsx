import React, { useEffect, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion'; 
import axios from 'axios';
import { candidacyEventBus, type CandidacyEventData } from '@/utils/candidacy-events';

interface ProdutoCatalogo {
  id: number;
  nome: string;
  curso: string;
  imagem: string;
}

interface InicioProps {
  processos?: any[];
}

export default function Inicio({ }: InicioProps) {
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  const segments = pathname.split('/').filter(Boolean);
  const { auth } = usePage<SharedData>().props;
  const idUser = auth?.user?.id;
  const [modalAberto, setModalAberto] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState<ProdutoCatalogo | null>(null);
  const [modalPerfil, setModalPerfil] = useState(false);
  const [modalLogin, setModalLogin] = useState(false);
  const [modalInfoPessoais, setModalInfoPessoais] = useState(false); // Modal apenas para informações pessoais
  const [modalDocumentos, setModalDocumentos] = useState(false); // Modal apenas para documentos
  const [modalJaCandidatado, setModalJaCandidatado] = useState(false); // Modal para vaga já candidatada
  const [modalCancelarCandidatura, setModalCancelarCandidatura] = useState(false); // Modal para confirmação de cancelamento
  const [modalVisualizarCandidatura, setModalVisualizarCandidatura] = useState(false); // Modal para visualizar candidatura
  const [erroCancelamento, setErroCancelamento] = useState<string | null>(null); // Erro no cancelamento
  const [vagaCandidatada, setVagaCandidatada] = useState<string>(''); // Nome da vaga que já foi candidatada
  const [candidacyId, setCandidacyId] = useState<number | null>(null); // ID da candidatura para cancelamento
  const [candidacyDetails, setCandidacyDetails] = useState<any>(null); // Detalhes da candidatura
  const [jaTemCandidatura, setJaTemCandidatura] = useState(false); // Verifica se já tem candidatura ativa
  const [interviewDetails, setInterviewDetails] = useState<any>(null); // Detalhes da entrevista

const [vaga, setVaga] = useState<Array<{
    edital: any;
    id: number;
    id_process: number;
    id_admin: number;
    titulo: string;
    responsabilidades?: string | null;
    requisitos?: string | null;
    carga_horaria?: string | null;
    remuneracao?: number | null;
    beneficios?: string | null;
    quantidade?: number | null;
    data_inicio: string;
    data_fim: string;
    tipo_vaga: 'Graduacao' | 'Pos-Graduacao';
    status: 'Aberto' | 'Fechado';
    created_at: string;
    updated_at: string;
  }>>([]);

  const [editalProcesso, setEditalProcesso] = useState<string | null>(null);
  const queryParams = new URLSearchParams(window.location.search);
  const processId = queryParams.get('id');
  const [processo, setProcesso] = useState<any>(null); // Novo estado para o processo

  useEffect(() => {
    const fetchProcess = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/process/${processId}/vacancy`);
        setVaga(response.data);
        const processResponse = await axios.get(`http://localhost:8000/api/process/${processId}`);
        setEditalProcesso(processResponse.data.edital);
        setProcesso(processResponse.data); // Salva o processo inteiro
      } catch {
        alert("Erro ao carregar dados")
        return;
      }
    }
    fetchProcess();
  }, [processId]);

  // Verificar se o usuário já tem candidatura ativa
  useEffect(() => {
    const checkExistingCandidacy = async () => {
      if (!idUser) return;
      
      try {
        const candidaciesResponse = await axios.get(`http://localhost:8000/api/person/${idUser}/candidacy`);
        if (candidaciesResponse.data && candidaciesResponse.data.length > 0) {
          setJaTemCandidatura(true);
          setCandidacyId(candidaciesResponse.data[0].id);
          setCandidacyDetails(candidaciesResponse.data[0]); // Salvar detalhes da candidatura
          
          // Buscar o nome da vaga
          const candidatura = candidaciesResponse.data[0];
          const vagaResponse = await axios.get(`http://localhost:8000/api/process/${candidatura.id_process}/vacancy/${candidatura.id_vacancy}`);
          setVagaCandidatada(vagaResponse.data.titulo);
        } else {
          setJaTemCandidatura(false);
          setCandidacyId(null);
          setCandidacyDetails(null);
          setVagaCandidatada('');
        }
      } catch {
        setJaTemCandidatura(false);
      }
    };

    checkExistingCandidacy();
  }, [idUser]);

  // Listener para sincronização de candidaturas entre páginas
  useEffect(() => {
    const unsubscribe = candidacyEventBus.on((eventData: CandidacyEventData) => {
      console.log('Evento de candidatura recebido em inicio-vaga:', eventData);
      
      // Se uma candidatura foi cancelada em outra página
      if (eventData.action === 'cancelled' && eventData.userId === idUser) {
        // Atualizar estados locais
        setJaTemCandidatura(false);
        setCandidacyId(null);
        setCandidacyDetails(null);
        setVagaCandidatada('');
        
        // Fechar modais relacionados se estiverem abertos
        setModalCancelarCandidatura(false);
        setModalVisualizarCandidatura(false);
        setModalJaCandidatado(false);
      }
      
      // Se uma candidatura foi criada em outra página
      if (eventData.action === 'created' && eventData.userId === idUser) {
        // Recarregar dados da candidatura
        const checkExistingCandidacy = async () => {
          try {
            const candidaciesResponse = await axios.get(`http://localhost:8000/api/person/${idUser}/candidacy`);
            if (candidaciesResponse.data && candidaciesResponse.data.length > 0) {
              setJaTemCandidatura(true);
              setCandidacyId(candidaciesResponse.data[0].id);
              setCandidacyDetails(candidaciesResponse.data[0]);
              
              // Buscar o nome da vaga
              const candidatura = candidaciesResponse.data[0];
              const vagaResponse = await axios.get(`http://localhost:8000/api/process/${candidatura.id_process}/vacancy/${candidatura.id_vacancy}`);
              setVagaCandidatada(vagaResponse.data.titulo);
            }
          } catch (error) {
            console.error('Erro ao recarregar candidatura:', error);
          }
        };
        
        checkExistingCandidacy();
      }
    });

    return unsubscribe; // Cleanup quando o componente for desmontado
  }, [idUser]);

  const candidatura = async (vacancyId: number) => {
    // Verifica se o usuário está logado
    if (!idUser) {
      setModalLogin(true);
      return;
    }
    
    console.log('=== INICIO DA CANDIDATURA ===');
    console.log('idUser:', idUser);
    console.log('vacancyId:', vacancyId);
    console.log('window.location.hostname:', window?.location?.hostname);
    console.log('processo está rodando no navegador:', typeof window !== 'undefined');
    
    try {
      // Verifica se a pessoa existe antes de tentar candidatar
      const pessoaUrl = `http://localhost:8000/api/person/${idUser}`;
      console.log('Fazendo requisição para:', pessoaUrl);
      
      const pessoaResponse = await axios.get(pessoaUrl);
      console.log('Resposta da API person:', pessoaResponse.status, pessoaResponse.data);
      
      if (!pessoaResponse.data || pessoaResponse.data.message === 'Usuário não encontrado.') {
        console.log('Usuário não encontrado, abrindo modal perfil');
        setModalPerfil(true);
        return;
      }

      // Verifica se há informações pessoais e documentos
      const pessoa = pessoaResponse.data;
      console.log('Dados da pessoa:', pessoa); // Debug
      console.log('Objeto completo da pessoa:', JSON.stringify(pessoa, null, 2)); // Debug mais detalhado
      
      // Verificar se tem informações pessoais essenciais (independente de person_exists)
      const hasPersonalInfo = !!(pessoa.cpf && pessoa.telefone && pessoa.data_nascimento);
      console.log('hasPersonalInfo:', hasPersonalInfo); // Debug
      console.log('CPF:', pessoa.cpf, 'Telefone:', pessoa.telefone, 'Data nascimento:', pessoa.data_nascimento); // Debug
      console.log('Validação individual:');
      console.log('  - CPF existe:', !!pessoa.cpf);
      console.log('  - Telefone existe:', !!pessoa.telefone);
      console.log('  - Data nascimento existe:', !!pessoa.data_nascimento);
      
      // Verificar se existem documentos
      let hasDocuments = false;
      try {
        const documentsUrl = `http://localhost:8000/api/person/${idUser}/document`;
        console.log('Fazendo requisição de documentos para:', documentsUrl);
        
        const documentsResponse = await axios.get(documentsUrl);
        console.log('Resposta da API documents:', documentsResponse.status, documentsResponse.data);
        
        hasDocuments = documentsResponse.data && documentsResponse.data.length > 0;
        console.log('hasDocuments:', hasDocuments); // Debug
        console.log('Resposta dos documentos:', documentsResponse.data); // Debug
        console.log('Validação de documentos:');
        console.log('  - Resposta é array:', Array.isArray(documentsResponse.data));
        console.log('  - Quantidade de documentos:', documentsResponse.data?.length || 0);
      } catch (docError) {
        hasDocuments = false;
        console.log('Erro ao buscar documentos:', docError); // Debug
        console.log('Considerando hasDocuments como false'); // Debug
      }

      // Determina qual modal mostrar baseado no que está faltando
      console.log('=== VERIFICAÇÃO FINAL ===');
      console.log('hasPersonalInfo:', hasPersonalInfo, 'hasDocuments:', hasDocuments); // Debug
      
      if (!hasPersonalInfo && !hasDocuments) {
        console.log('Abrindo modal geral - ambos faltando'); // Debug
        // Ambos estão faltando - modal geral
        setModalPerfil(true);
        return;
      } else if (!hasPersonalInfo && hasDocuments) {
        console.log('Abrindo modal info pessoais - só info pessoais faltando'); // Debug
        // Só informações pessoais estão faltando
        setModalInfoPessoais(true);
        return;
      } else if (hasPersonalInfo && !hasDocuments) {
        console.log('Abrindo modal documentos - só documentos faltando'); // Debug
        // Só documentos estão faltando
        setModalDocumentos(true);
        return;
      }

      console.log('=== VALIDAÇÃO PASSOU - FAZENDO CANDIDATURA ===');
      console.log('Usuário tem informações pessoais e documentos completos');

      const candidaturaUrl = `http://localhost:8000/api/person/${idUser}/vacancy/${vacancyId}/candidacy`;
      console.log('Fazendo candidatura para:', candidaturaUrl);

      const response = await axios.post(candidaturaUrl, {
        id_process: processId,
        status: 'Analise',
        data_candidatura: new Date().toISOString().split('T')[0],
      });

      console.log('Resposta da candidatura:', response.status, response.data);

      if (response.status === 200 || response.status === 201) {
        alert(response.data.message || 'Candidatura realizada com sucesso');
        setModalAberto(false);
        
        // Atualizar estados para refletir a nova candidatura
        setJaTemCandidatura(true);
        const novaVaga = vaga.find(v => v.id === vacancyId);
        if (novaVaga) {
          setVagaCandidatada(novaVaga.titulo);
        }
        setCandidacyId(response.data.id);
        setCandidacyDetails(response.data);

        // Emitir evento para sincronizar com outras páginas
        candidacyEventBus.emit({
          candidacyId: response.data.id,
          userId: idUser,
          action: 'created',
          timestamp: Date.now()
        });
      }

    } catch (error) {
      console.error('Erro na candidatura:', error);
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        setModalPerfil(true);
        return;
      }
      
      // Verifica se é o erro de já candidatado
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        const responseData = error.response.data;
        if (responseData.message === 'Você já se candidatou em uma vaga') {
          // Atualizar os estados para refletir que já tem candidatura
          setVagaCandidatada(responseData.vacancy_title || 'Vaga não identificada');
          setJaTemCandidatura(true);
          
          // Buscar o ID da candidatura existente se não tiver
          if (!candidacyId) {
            try {
              const candidaciesResponse = await axios.get(`http://localhost:8000/api/person/${idUser}/candidacy`);
              if (candidaciesResponse.data && candidaciesResponse.data.length > 0) {
                setCandidacyId(candidaciesResponse.data[0].id);
              }
            } catch (candidacyError) {
              console.log('Erro ao buscar candidatura:', candidacyError);
            }
          }
          
          // Abrir modal ao invés de alert
          setModalJaCandidatado(true);
          return;
        }
      }
      
      const errorMessage = (axios.isAxiosError(error) && error.response?.data?.message) || (error instanceof Error && error.message) || 'Erro ao realizar candidatura';
      alert('Erro ao realizar candidatura: ' + errorMessage);
    }
  };
  
  const abrirModalCancelamento = async () => {
    // Se não temos candidacyId ou idUser, tentar recarregar os dados da candidatura
    if (!candidacyId || !idUser) {
      if (idUser) {
        try {
          const candidaciesResponse = await axios.get(`http://localhost:8000/api/person/${idUser}/candidacy`);
          if (candidaciesResponse.data && candidaciesResponse.data.length > 0) {
            const candidatura = candidaciesResponse.data[0];
            setCandidacyId(candidatura.id);
          }
        } catch (error) {
          console.error('Erro ao recarregar candidatura:', error);
        }
      }
    }
    
    setErroCancelamento(null);
    setModalCancelarCandidatura(true);
  };

  const abrirModalVisualizacao = async () => {
    // Buscar dados da entrevista se houver candidatura
    if (candidacyId) {
      try {
        const interviewResponse = await axios.get(`http://localhost:8000/api/candidacy/${candidacyId}/interview`);
        setInterviewDetails(interviewResponse.data);
      } catch {
        // Se não houver entrevista, mantém como null
        setInterviewDetails(null);
      }
    }
    setModalVisualizarCandidatura(true);
  };

  const cancelarCandidatura = async () => {
    if (!candidacyId || !idUser) {
      setErroCancelamento('Não foi possível identificar a candidatura para cancelamento.');
      return;
    }

    try {
      // Primeiro verificar se a candidatura ainda existe
      const checkResponse = await axios.get(`http://localhost:8000/api/person/${idUser}/candidacy`);
      const currentCandidacies = checkResponse.data || [];
      const candidacyExists = currentCandidacies.find((c: { id: number }) => c.id === candidacyId);
      
      if (!candidacyExists) {
        setErroCancelamento('Esta candidatura já foi cancelada ou não existe mais.');
        // Atualizar estados locais
        setJaTemCandidatura(false);
        setCandidacyId(null);
        setCandidacyDetails(null);
        setVagaCandidatada('');
        return;
      }

      const response = await axios.delete(`http://localhost:8000/api/person/${idUser}/candidacy/${candidacyId}`);
      
      if (response.status === 200) {
        setModalAberto(false);
        setCandidacyId(null);
        setCandidacyDetails(null);
        setVagaCandidatada('');
        setJaTemCandidatura(false);
        setErroCancelamento(null);
        // Modal permanece aberto para mostrar sucesso

        // Emitir evento para sincronizar com outras páginas
        candidacyEventBus.emit({
          candidacyId,
          userId: idUser,
          action: 'cancelled',
          timestamp: Date.now()
        });
      }
    } catch (error) {
      let errorMessage = 'Erro ao cancelar candidatura';
      
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          errorMessage = 'Candidatura não encontrada ou já foi cancelada.';
          // Atualizar estados locais se candidatura não existe mais
          setJaTemCandidatura(false);
          setCandidacyId(null);
          setCandidacyDetails(null);
          setVagaCandidatada('');
        } else {
          errorMessage = error.response?.data?.message || errorMessage;
        }
      }
      
      setErroCancelamento(errorMessage);
    }
  };
  
  return (
    <>
      <AppLayout>
        <Head title="Início" />
        <div className="flex h-full max-h-full flex-1 flex-col gap-4 rounded-xl p-4">
          <nav className="text-sm text-muted-foreground mb-4">
            <ol className="flex items-center space-x-2">
              <li>
                <Link href="/inicio-processo" className="hover:underline">Início</Link>
              </li>
              {segments.filter((seg, i) => !(i === 0 && seg === 'inicio-processo')).map((segment, index) => {
                const href = '/' + segments.slice(0, index + 1).join('/');
                const isLast = index === segments.length - 1;
                const label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');

                return (
                  <li key={href} className="flex items-center space-x-2">
                    <span className="mx-1">/</span>
                    {isLast ? (
                      <span className="font-medium">{label}</span>
                    ) : (
                      <Link href={href} className="hover:underline">{label}</Link>
                    )}
                  </li>
                );
              })}
            </ol>
          </nav>

          <main className="flex flex-col items-center">
            <section id="container-produto" className="flex flex-wrap justify-center gap-4 max-w-6xl w-full mt-4">
              <div className="mb-6 w-full">
                <h1 className="text-xl font-semibold">
                  {processo
                    ? `${processo.descricao} - Nº ${processo.numero_processo}`
                    : 'Carregando...'}
                </h1>
                <hr className="mt-4 mb-4 w-full bg-[#008DD0] h-0.5" />
                <h2 className="text-md font-medium">Cadastro Reserva</h2>
                <h2 className="text-md">Cursos de Tecnólogo, Graduação e Pós-graduação Disponíveis para Estágio</h2>
              </div>

              {vaga.map((item) => (
                <div
                  key={item.id}
                  id={`card-produto-${item.id}`}
                  className={`group border-solid w-48 flex flex-col p-4 justify-between items-center shadow-xl shadow-slate-400 rounded-lg hover:scale-105 transition-transform`}>
                  <img
                    src={'/vaga-ti.png'}
                    alt={item.titulo}
                    className="my-3 rounded-lg w-24 h-12 object-contain"
                  />
                  <p className="text-sm font-semibold">{item.titulo}</p>
                  <p className="text-sm text-slate-400">{item.tipo_vaga}</p>
                  <button
                    onClick={async () => {
                      setProdutoSelecionado({
                        id: item.id,
                        nome: item.titulo,
                        curso: item.tipo_vaga,
                        imagem: '/vaga-ti.png',
                        // Adicione outros campos conforme necessário para o modal
                      } as ProdutoCatalogo);
                      
                      // Verificar se usuário tem candidatura para essa vaga específica
                      if (idUser) {
                        try {
                          const candidaciesResponse = await axios.get(`http://localhost:8000/api/person/${idUser}/candidacy`);
                          if (candidaciesResponse.data && candidaciesResponse.data.length > 0) {
                            const candidatura = candidaciesResponse.data[0];
                            // Buscar informações da vaga da candidatura existente
                            const vagaResponse = await axios.get(`http://localhost:8000/api/process/${candidatura.id_process}/vacancy/${candidatura.id_vacancy}`);
                            
                            if (candidatura.id_vacancy === item.id) {
                              // Usuário tem candidatura para esta vaga específica
                              setJaTemCandidatura(true);
                              setCandidacyId(candidatura.id);
                              setCandidacyDetails(candidatura);
                              setVagaCandidatada(item.titulo);
                            } else {
                              // Usuário tem candidatura para outra vaga
                              setJaTemCandidatura(true);
                              setCandidacyId(candidatura.id);
                              setCandidacyDetails(candidatura);
                              setVagaCandidatada(vagaResponse.data.titulo || 'Vaga não identificada');
                            }
                          } else {
                            // Usuário não tem candidatura
                            setJaTemCandidatura(false);
                            setCandidacyId(null);
                            setCandidacyDetails(null);
                            setVagaCandidatada('');
                          }
                        } catch {
                          setJaTemCandidatura(false);
                          setCandidacyId(null);
                          setCandidacyDetails(null);
                          setVagaCandidatada('');
                        }
                      }
                      
                      setModalAberto(true);
                    }}
                    className="mt-4 px-4 py-2 bg-[#207FCD] text-white rounded-full shadow hover:bg-[#1a6fb3] transition-colors">Saiba mais
                  </button>
                </div>
              ))}
            </section>
          </main>
        </div>

        <AnimatePresence>
          {modalAberto && produtoSelecionado && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalAberto(false)}>
              <motion.div
          className="bg-white w-full max-w-2xl rounded-xl shadow-lg p-6 relative"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => setModalAberto(false)}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl">
            &times;
          </button>
          {/* Exemplo de uso dos dados do banco de dados */}
            <h2 className="text-xl font-semibold mb-2">
            Programa de estágio e aprendizagem em {produtoSelecionado.nome}
            </h2>
            <p className="text-sm text-gray-500 mb-4">
            Publicado em {vaga.find(v => v.id === produtoSelecionado.id)?.created_at
              ? new Date(vaga.find(v => v.id === produtoSelecionado.id)!.created_at).toLocaleDateString()
              : '--'}
            <br />
            Inscrições abertas até {vaga.find(v => v.id === produtoSelecionado.id)?.data_fim
              ? new Date(vaga.find(v => v.id === produtoSelecionado.id)!.data_fim).toLocaleDateString()
              : '--'}
            </p>

            <h3 className="font-semibold mb-1">Atividades</h3>
            <ul className="list-disc list-inside text-sm mb-4">
            {vaga.find(v => v.id === produtoSelecionado.id)?.responsabilidades
              ? vaga.find(v => v.id === produtoSelecionado.id)!.responsabilidades!.split('\n').map((atv, idx) => (
                <li key={idx}>{atv}</li>
              ))
              : <li>Não informado</li>}
            </ul>

            <h3 className="font-semibold mb-1">Requisitos e qualificações</h3>
            <ul className="list-disc list-inside text-sm mb-4">
            {vaga.find(v => v.id === produtoSelecionado.id)?.requisitos
              ? vaga.find(v => v.id === produtoSelecionado.id)!.requisitos!.split('\n').map((req, idx) => (
                <li key={idx}>{req}</li>
              ))
              : <li>Não informado</li>}
            </ul>

            <h3 className="font-semibold mb-1">Valor da bolsa e carga horária</h3>
            <ul className="list-disc list-inside text-sm mb-4">
            {(vaga.find(v => v.id === produtoSelecionado.id)?.remuneracao || vaga.find(v => v.id === produtoSelecionado.id)?.carga_horaria)
              ? [
                vaga.find(v => v.id === produtoSelecionado.id)?.remuneracao
                ? `Bolsa: R$ ${vaga.find(v => v.id === produtoSelecionado.id)!.remuneracao!.toFixed(2)}`
                : null,
                vaga.find(v => v.id === produtoSelecionado.id)?.carga_horaria
                ? `Carga horária: ${vaga.find(v => v.id === produtoSelecionado.id)!.carga_horaria}`
                : null
              ].filter(Boolean).map((bolsa, idx) => <li key={idx}>{bolsa}</li>)
              : <li>Não informado</li>}
            </ul>

            <h3 className="font-semibold mb-1">Benefícios</h3>
            <p className="text-sm mb-4">
            {vaga.find(v => v.id === produtoSelecionado.id)?.beneficios || 'Não informado'}
            </p>

            {editalProcesso && (
            <div className="text-sm text-blue-600 underline mb-4">
              <a href={`/storage/${processo.edital}`} target="_blank" rel="noopener noreferrer">
              EDITAL
              </a>
            </div>
            )}

          <div className="flex gap-4">
            {jaTemCandidatura && produtoSelecionado && candidacyId ? (
              // Verificar se a candidatura é para esta vaga ou para outra
              (() => {
                // Buscar a candidatura atual para verificar se é para esta vaga
                const vagaAtual = vaga.find(v => v.id === produtoSelecionado.id);
                const temCandidaturaNestaVaga = vagaAtual && vagaAtual.titulo === vagaCandidatada;
                
                if (temCandidaturaNestaVaga) {
                  // Usuário tem candidatura para esta vaga específica
                  return (
                    <div className="flex gap-2">
                      <button
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        onClick={abrirModalVisualizacao}
                      >
                        Visualizar Candidatura
                      </button>
                      <button
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                        onClick={abrirModalCancelamento}
                      >
                        Cancelar Candidatura
                      </button>
                    </div>
                  );
                } else {
                  // Usuário tem candidatura para outra vaga
                  return (
                    <button
                      className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                      onClick={() => setModalJaCandidatado(true)}
                    >
                      Você já tem uma candidatura ativa
                    </button>
                  );
                }
              })()
            ) : (
              // Usuário não tem candidatura
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={() => {
                  const vacancyId = vaga.find(v => v.id === produtoSelecionado.id)?.id;
                  if (vacancyId !== undefined) {
                    candidatura(vacancyId);
                  } else {
                    return;
                  }
                }}
              >
                Candidatar-se
              </button>
            )}
          </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {/* Modal de perfil/documentos não cadastrados */}
          {modalPerfil && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalPerfil(false)}
            >
              <motion.div
                className="bg-white w-full max-w-md rounded-xl shadow-lg p-6 relative flex flex-col items-center"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                onClick={e => e.stopPropagation()}
              >
                <button
                  onClick={() => setModalPerfil(false)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl"
                >
                  &times;
                </button>
                <h2 className="text-lg font-semibold mb-4 text-center">
                  Suas informações pessoais e documentos ainda não foram cadastrados.
                </h2>
                <p className="mb-6 text-center">
                  É necessário completar os dados pessoais e enviar os documentos para se candidatar. Gostaria de ir para a página do perfil?
                </p>
                <div className="flex gap-4">
                  <button
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    onClick={() => {
                      setModalPerfil(false);
                      window.location.href = '/settings/profile';
                    }}
                  >
                    Sim
                  </button>
                  <button
                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                    onClick={() => setModalPerfil(false)}
                  >
                    Não
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
  {/* Modal de login não autenticado */}
  {modalLogin && (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => setModalLogin(false)}
    >
      <motion.div
        className="bg-white w-full max-w-md rounded-xl shadow-lg p-6 relative flex flex-col items-center"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={() => setModalLogin(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl"
        >
          &times;
        </button>
        <h2 className="text-lg font-semibold mb-4 text-center">
          Você não está logado. Faça login ou cadastre.
        </h2>
        <div className="flex gap-4">
          <button
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
            onClick={() => setModalLogin(false)}
          >
            Cancelar
          </button>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={() => {
              setModalLogin(false);
              window.location.href = '/login';
            }}
          >
            Entrar/Cadastrar
          </button>
        </div>
      </motion.div>
    </motion.div>
  )}        </AnimatePresence>

        <AnimatePresence>
          {/* Modal apenas para informações pessoais não cadastradas */}
          {modalInfoPessoais && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalInfoPessoais(false)}
            >
              <motion.div
                className="bg-white w-full max-w-md rounded-xl shadow-lg p-6 relative flex flex-col items-center"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                onClick={e => e.stopPropagation()}
              >
                <button
                  onClick={() => setModalInfoPessoais(false)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl"
                >
                  &times;
                </button>
                <h2 className="text-lg font-semibold mb-4 text-center">
                  Suas informações pessoais ainda não foram cadastradas.
                </h2>
                <p className="mb-6 text-center">
                  É necessário completar os dados pessoais para se candidatar. Gostaria de ir para a página do perfil?
                </p>
                <div className="flex gap-4">
                  <button
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    onClick={() => {
                      setModalInfoPessoais(false);
                      window.location.href = '/settings/profile';
                    }}
                  >
                    Sim
                  </button>
                  <button
                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                    onClick={() => setModalInfoPessoais(false)}
                  >
                    Não
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {/* Modal apenas para documentos não cadastrados */}
          {modalDocumentos && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalDocumentos(false)}
            >
              <motion.div
                className="bg-white w-full max-w-md rounded-xl shadow-lg p-6 relative flex flex-col items-center"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                onClick={e => e.stopPropagation()}
              >
                <button
                  onClick={() => setModalDocumentos(false)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl"
                >
                  &times;
                </button>
                <h2 className="text-lg font-semibold mb-4 text-center">
                  Seus documentos ainda não foram cadastrados.
                </h2>
                <p className="mb-6 text-center">
                  É necessário enviar os documentos para se candidatar. Gostaria de ir para a página de documentos?
                </p>
                <div className="flex gap-4">
                  <button
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    onClick={() => {
                      setModalDocumentos(false);
                      window.location.href = '/settings/documents';
                    }}
                  >
                    Sim
                  </button>
                  <button
                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                    onClick={() => setModalDocumentos(false)}
                  >
                    Não
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {/* Modal para vaga já candidatada */}
          {modalJaCandidatado && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalJaCandidatado(false)}
            >
              <motion.div
                className="bg-white w-full max-w-md rounded-xl shadow-lg p-6 relative flex flex-col items-center"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                onClick={e => e.stopPropagation()}
              >
                <button
                  onClick={() => setModalJaCandidatado(false)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl"
                >
                  &times;
                </button>
                <h2 className="text-lg font-semibold mb-4 text-center">
                  Você já se candidatou em uma vaga
                </h2>
                <p className="mb-6 text-center">
                  Você já possui uma candidatura ativa na vaga: <strong>{vagaCandidatada}</strong>
                </p>
                <p className="mb-6 text-center text-sm text-gray-600">
                  Para se candidatar em outra vaga, cancele sua candidatura atual.
                </p>
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  onClick={() => setModalJaCandidatado(false)}
                >
                  Entendido
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {/* Modal para confirmação de cancelamento de candidatura */}
          {modalCancelarCandidatura && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalCancelarCandidatura(false)}
            >
              <motion.div
                className="bg-white w-full max-w-md rounded-xl shadow-lg p-6 relative flex flex-col items-center"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                onClick={e => e.stopPropagation()}
              >
                <button
                  onClick={() => setModalCancelarCandidatura(false)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl"
                >
                  &times;
                </button>
                {erroCancelamento ? (
                  // Modal de erro no cancelamento
                  <>
                    <h2 className="text-lg font-semibold mb-4 text-center text-red-600">
                      Erro ao cancelar candidatura
                    </h2>
                    <p className="mb-6 text-center">
                      {erroCancelamento}
                    </p>
                    <div className="flex gap-4">
                      <button
                        className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                        onClick={() => setModalCancelarCandidatura(false)}
                      >
                        Fechar
                      </button>
                      <button
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                        onClick={() => {
                          setErroCancelamento(null);
                          cancelarCandidatura();
                        }}
                      >
                        Tentar novamente
                      </button>
                    </div>
                  </>
                ) : jaTemCandidatura ? (
                  // Modal de confirmação
                  <>
                    <h2 className="text-lg font-semibold mb-4 text-center">
                      Confirmar cancelamento de candidatura
                    </h2>
                    <p className="mb-6 text-center">
                      Tem certeza de que deseja cancelar sua candidatura na vaga: <strong>{vagaCandidatada}</strong>?
                    </p>
                    <p className="mb-6 text-center text-sm text-gray-600">
                      Esta ação não pode ser desfeita.
                    </p>
                    <div className="flex gap-4">
                      <button
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        onClick={() => setModalCancelarCandidatura(false)}
                      >
                        Não, manter candidatura
                      </button>
                      <button
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                        onClick={cancelarCandidatura}
                      >
                        Sim, cancelar
                      </button>
                    </div>
                  </>
                ) : (
                  // Modal de sucesso
                  <>
                    <h2 className="text-lg font-semibold mb-4 text-center text-green-600">
                      Candidatura cancelada com sucesso!
                    </h2>
                    <p className="mb-6 text-center">
                      Sua candidatura foi cancelada. Agora você pode se candidatar a outra vaga.
                    </p>
                    <button
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                      onClick={() => setModalCancelarCandidatura(false)}
                    >
                      Entendido
                    </button>
                  </>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {/* Modal para visualizar candidatura */}
          {modalVisualizarCandidatura && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalVisualizarCandidatura(false)}
            >
              <motion.div
                className="bg-white w-full max-w-md rounded-xl shadow-lg p-6 relative flex flex-col items-center"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                onClick={e => e.stopPropagation()}
              >
                <button
                  onClick={() => setModalVisualizarCandidatura(false)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl"
                >
                  &times;
                </button>
                <h2 className="text-lg font-semibold mb-4 text-center text-blue-600">
                  Detalhes da Candidatura
                </h2>
                
                <div className="w-full space-y-3">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Vaga:</p>
                    <p className="font-semibold text-blue-800">{vagaCandidatada}</p>
                  </div>
                  
                  {candidacyDetails && (
                    <>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Data da Candidatura:</p>
                        <p className="font-medium">
                          {candidacyDetails.data_candidatura 
                            ? new Date(candidacyDetails.data_candidatura).toLocaleDateString('pt-BR')
                            : 'Não informado'}
                        </p>
                      </div>
                      
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Status:</p>
                        <p className={`font-medium px-3 py-1 rounded-full text-sm inline-block ${
                          candidacyDetails.status === 'Analise' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : candidacyDetails.status === 'Completo'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {candidacyDetails.status === 'Analise' ? 'Em Análise' : candidacyDetails.status}
                        </p>
                      </div>
                      
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Status da Entrevista:</p>
                        {interviewDetails ? (
                          <div>
                            {interviewDetails.status === 'Agendada' ? (
                              <div>
                                <p className="font-medium px-3 py-1 rounded-full text-sm inline-block bg-blue-100 text-blue-800">
                                  Agendada
                                </p>
                                <p className="text-sm text-gray-600 mt-1">
                                  Data: {new Date(interviewDetails.data_hora).toLocaleDateString('pt-BR')} às {new Date(interviewDetails.data_hora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                </p>
                              </div>
                            ) : (
                              <p className="font-medium px-3 py-1 rounded-full text-sm inline-block bg-yellow-100 text-yellow-800">
                                Em análise
                              </p>
                            )}
                          </div>
                        ) : (
                          <p className="font-medium px-3 py-1 rounded-full text-sm inline-block bg-yellow-100 text-yellow-800">
                            Em análise
                          </p>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
    </AppLayout>
  </>
);}