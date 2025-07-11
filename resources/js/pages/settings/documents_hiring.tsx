import axios from 'axios';
import React, { useState } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import HeadingSmall from '@/components/heading-small';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

const documentosContratacao = [
  { label: 'Foto 3x4', name: 'Foto3x4' },
  { label: 'Cédula de Identidade ou CNH', name: 'CedulaIdentidadeOuCNH' },
  { label: 'Cadastro Pessoa Física (CPF)', name: 'CadastroPessoaFisica' },
  { label: 'CTPS (Carteira de Trabalho)', name: 'CTPS' },
  { label: 'Carteira de Reservista', name: 'CarteiraDeReservista' },
  { label: 'Comprovante de Residência', name: 'ComprovanteDeResidencia' },
  { label: 'Antecedentes Criminais e Cível', name: 'AntecedentesCriminaisECivel' },
  { label: 'Antecedentes Criminais Polícia Federal', name: 'AntecedentesCriminaisPoliciaFederal' },
  { label: 'Vacinação Febre Amarela', name: 'VacinacaFebreAmarela' },
  { label: 'Vacina Covid-19', name: 'VacinacaCovid19' },
  { label: 'Grupo Sanguíneo', name: 'GrupoSanguineo' },
  { label: 'Atestado de Frequência', name: 'AtestadadoFrequencia' },
];

export default function DocumentsHiring() {
  const { auth } = usePage().props as unknown as { auth: { user: { id: number } } };
  const urlParams = new URLSearchParams(window.location.search);
  const candidacyId = urlParams.get('candidacy_id');
  
  const [personId, setPersonId] = useState<number | null>(null);
  const [files, setFiles] = useState<{ [key: string]: File | null }>({});
  const [existingDocuments, setExistingDocuments] = useState<{ [key: string]: { id: number; documento: string; nome_documento: string } }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initializingPerson, setInitializingPerson] = useState(true);
  const [modalSucesso, setModalSucesso] = useState(false);

  // Buscar ou criar o registro Person do usuário logado
  const initializePerson = React.useCallback(async () => {
    if (!auth?.user?.id) {
      console.error('Usuário não autenticado');
      setError('Usuário não autenticado.');
      setInitializingPerson(false);
      return;
    }
    
    setInitializingPerson(true);
    try {
      console.log('Inicializando Person para usuário:', auth.user.id);
      
      // Primeiro tenta buscar um Person existente
      const response = await axios.get(`http://localhost:8000/api/person`);
      console.log('Resposta da API person:', response.data);
      
      const userPerson = response.data.find((person: { id_user: number }) => person.id_user === auth.user.id);
      
      if (userPerson) {
        console.log('Person encontrado:', userPerson);
        // Se o usuário tem um registro Person, usar o ID do Person
        if (userPerson.id) {
          setPersonId(userPerson.id);
        } else {
          // Se existe userPerson mas não tem id, significa que não foi criado um Person ainda
          console.log('Usuário existe mas Person não foi criado, criando novo...');
          const createResponse = await axios.post(`http://localhost:8000/api/person`, {
            id_user: auth.user.id,
          });
          console.log('Person criado:', createResponse.data);
          setPersonId(createResponse.data.id);
        }
      } else {
        console.log('Person não encontrado, criando novo...');
        // Se não existe, cria um novo registro Person
        console.log('Tentando criar Person com id_user:', auth.user.id);
        const createResponse = await axios.post(`http://localhost:8000/api/person`, {
          id_user: auth.user.id,
        });
        console.log('Person criado:', createResponse.data);
        setPersonId(createResponse.data.id);
      }
    } catch (err) {
      console.error('Erro ao inicializar Person:', err);
      if (axios.isAxiosError(err)) {
        console.error('Detalhes do erro:', {
          status: err.response?.status,
          data: err.response?.data,
          message: err.message
        });
        
        if (err.response?.status === 500 && err.response?.data?.error?.includes('FOREIGN KEY constraint failed')) {
          setError('Erro: Usuário não encontrado no sistema. Faça logout e login novamente.');
        } else if (err.response?.status === 422) {
          setError(`Erro de validação: ${err.response.data.message || 'Dados inválidos'}`);
        } else {
          setError(`Erro ao inicializar perfil: ${err.response?.data?.message || err.message}`);
        }
      } else {
        setError('Erro ao inicializar perfil do usuário.');
      }
    } finally {
      setInitializingPerson(false);
    }
  }, [auth?.user?.id]);

  // Função para buscar documentos existentes
  const loadExistingDocuments = React.useCallback(async (personId: number) => {
    try {
      console.log('Carregando documentos de contratação existentes para pessoa:', personId);
      const response = await axios.get(`http://localhost:8000/api/person/${personId}/document`);
      console.log('Documentos encontrados:', response.data);
      
      // Filtrar apenas documentos de contratação e organizar por nome_documento
      const documentsMap: { [key: string]: { id: number; documento: string; nome_documento: string } } = {};
      if (Array.isArray(response.data)) {
        response.data.forEach((doc: { id: number; documento: string; nome_documento: string; tipo_documento: string }) => {
          // Filtrar apenas documentos de contratação
          if (doc.tipo_documento === 'Contratacao') {
            documentsMap[doc.nome_documento] = doc;
          }
        });
      }
      
      setExistingDocuments(documentsMap);
      console.log('Documentos de contratação organizados:', documentsMap);
    } catch (err) {
      console.log('Nenhum documento de contratação encontrado ou erro ao carregar:', err);
      // Se não encontrar documentos, não é um erro crítico
      setExistingDocuments({});
    }
  }, []);

  // Inicializar Person quando o componente montar
  React.useEffect(() => {
    console.log('Componente montado, iniciando initializePerson...');
    initializePerson();
  }, [initializePerson]);

  // Carregar documentos existentes quando personId for definido
  React.useEffect(() => {
    if (personId) {
      loadExistingDocuments(personId);
    }
  }, [personId, loadExistingDocuments]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
    setFiles({ ...files, [name]: e.target.files?.[0] || null });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!personId) {
      setError('Perfil de usuário não inicializado. Tente recarregar a página.');
      return;
    }

    // Verificar se pelo menos um arquivo foi selecionado
    const hasFiles = Object.values(files).some(file => file !== null);
    
    if (!hasFiles) {
      setError('Selecione pelo menos um documento para enviar.');
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      for (const doc of documentosContratacao) {
        const file = files[doc.name];
        const existingDoc = existingDocuments[doc.name];
        
        if (file) {
          const formData = new FormData();
          formData.append('tipo_documento', 'Contratacao');
          formData.append('nome_documento', doc.name);
          formData.append('documento', file);

          // Debug: verificar os dados do FormData
          console.log(`Processando documento de contratação ${doc.name}:`, {
            hasExistingDoc: !!existingDoc,
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type
          });

          if (existingDoc) {
            // Se já existe um documento, usar POST com _method para simular PUT
            console.log(`Atualizando documento de contratação existente: ${existingDoc.id}`);
            formData.append('_method', 'PUT');
            await axios.post(
              `http://localhost:8000/api/person/${personId}/document/${existingDoc.id}`,
              formData
            );
          } else {
            // Se é um novo documento, usar POST para criar
            console.log('Criando novo documento de contratação');
            await axios.post(
              `http://localhost:8000/api/person/${personId}/document`,
              formData
            );
          }
        }
      }
      setModalSucesso(true);
      // Limpar os arquivos após o envio
      setFiles({});
      // Recarregar documentos existentes
      if (personId) {
        loadExistingDocuments(personId);
      }
    } catch (err: unknown) {
      console.error('Erro detalhado:', err);
      if (axios.isAxiosError(err)) {
        console.error('Resposta do servidor:', err.response?.data);
        const errorMessage = err.response?.data?.error || err.response?.data?.message || err.message;
        setError(`Erro ao enviar documentos: ${errorMessage}`);
      } else {
        setError('Erro ao enviar documentos.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVoltar = () => {
    router.visit(route('profile'));
  };

  return (
    <AppLayout>
      <Head title="Documentos de Contratação" />
      <div className="max-w-4xl mx-auto py-6 px-4">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={handleVoltar}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
            <div>
              <HeadingSmall 
                title="Documentos de Contratação" 
                description="Anexe os documentos necessários para sua contratação em PDF"
              />
              {candidacyId && (
                <p className="text-sm text-muted-foreground mt-1">
                  Candidatura ID: {candidacyId}
                </p>
              )}
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-2">Documentos Obrigatórios</h3>
            <p className="text-blue-700 text-sm">
              Para completar o processo de contratação, é necessário enviar todos os documentos listados abaixo. 
              Certifique-se de que os arquivos estejam em formato PDF e sejam legíveis.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {documentosContratacao.map((doc) => {
              const existingDoc = existingDocuments[doc.name];
              const hasExistingDoc = !!existingDoc;
              const hasNewFile = !!files[doc.name];
              
              return (
                <div key={doc.name} className="flex flex-col gap-2">
                  <label className="font-semibold">{doc.label}</label>
                  
                  {hasExistingDoc && !hasNewFile && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-green-700 text-sm font-medium">
                            Documento já enviado
                          </span>
                        </div>
                        <a 
                          href={`http://localhost:8000/storage/${existingDoc.documento}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm underline"
                        >
                          Visualizar
                        </a>
                      </div>
                      <p className="text-green-600 text-xs mt-1">
                        Selecione um novo arquivo se desejar substituir
                      </p>
                    </div>
                  )}
                  
                  {hasNewFile && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="text-blue-700 text-sm font-medium">
                          Novo arquivo selecionado: {files[doc.name]?.name}
                        </span>
                      </div>
                      {hasExistingDoc && (
                        <p className="text-blue-600 text-xs mt-1">
                          Este arquivo substituirá o documento existente
                        </p>
                      )}
                    </div>
                  )}
                  
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={e => handleFileChange(e, doc.name)}
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
              );
            })}
            
            <Button 
              type="submit" 
              disabled={loading || initializingPerson || !personId || !Object.values(files).some(file => file !== null)}
              className="w-full"
            >
              {loading ? 'Enviando...' : 'Enviar Documentos de Contratação'}
            </Button>
            {error && <p className="text-red-600 text-center mt-2">{error}</p>}
          </form>
        </div>

        <AnimatePresence>
          {/* Modal de sucesso */}
          {modalSucesso && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalSucesso(false)}
            >
              <motion.div
                className="bg-white w-full max-w-md rounded-xl shadow-lg p-6 relative flex flex-col items-center"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                onClick={e => e.stopPropagation()}
              >
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <svg 
                    className="w-8 h-8 text-green-600" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M5 13l4 4L19 7" 
                    />
                  </svg>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">
                  Documentos de contratação enviados!
                </h3>
                
                <p className="text-gray-600 text-center mb-6">
                  Seus documentos de contratação foram enviados com sucesso. Em breve entraremos em contato.
                </p>
                
                <div className="flex gap-2 w-full">
                  <Button 
                    onClick={() => setModalSucesso(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    Continuar
                  </Button>
                  <Button 
                    onClick={handleVoltar}
                    className="flex-1"
                  >
                    Voltar ao Perfil
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppLayout>
  );
}
