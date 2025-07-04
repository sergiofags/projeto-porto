import axios from 'axios';
import React, { useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { Button } from '@/components/ui/button';
import HeadingSmall from '@/components/heading-small';

const documentos = [
  { label: 'Atestado de matrícula ou frequência', name: 'AtestadoMatricula' },
  { label: 'Histórico escolar', name: 'HistoricoEscolar' },
  { label: 'Currículo', name: 'Curriculo' },
  { label: 'Coeficiente de Rendimento (CR)', name: 'CoeficienteRendimento' },
];

export default function Documents() {
  const { auth } = usePage().props as unknown as { auth: { user: { id: number } } };
  const [personId, setPersonId] = useState<number | null>(null);
  const [files, setFiles] = useState<{ [key: string]: File | null }>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [initializingPerson, setInitializingPerson] = useState(true);

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
        const createResponse = await axios.post(`http://localhost:8000/api/person`, {
          id_user: auth.user.id,
          // Outros campos podem ser adicionados aqui se necessário
        });
        console.log('Person criado:', createResponse.data);
        setPersonId(createResponse.data.id);
      }
    } catch (err) {
      console.error('Erro ao inicializar Person:', err);
      setError('Erro ao inicializar perfil do usuário.');
    } finally {
      setInitializingPerson(false);
    }
  }, [auth?.user?.id]);

  // Inicializar Person quando o componente montar
  React.useEffect(() => {
    console.log('Componente montado, iniciando initializePerson...');
    initializePerson();
  }, [initializePerson]);

  // Debug do estado
  React.useEffect(() => {
    console.log('Estado atualizado:', {
      personId,
      initializingPerson,
      loading,
      auth: auth?.user?.id
    });
  }, [personId, initializingPerson, loading, auth]);

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
    setSuccess(null);
    setError(null);

    try {
      for (const doc of documentos) {
        const file = files[doc.name];
        if (file) {
          const formData = new FormData();
          formData.append('tipo_documento', 'Candidatura');
          formData.append('nome_documento', doc.name);
          formData.append('documento', file);

          await axios.post(
            `http://localhost:8000/api/person/${personId}/document`,
            formData,
            { headers: { 'Content-Type': 'multipart/form-data' } }
          );
        }
      }
      setSuccess('Documentos enviados com sucesso!');
      // Limpar os arquivos após o envio
      setFiles({});
    } catch (err: unknown) {
      console.error('Erro detalhado:', err);
      if (err instanceof Error) {
        console.error('Mensagem de erro:', err.message);
      }
      if (axios.isAxiosError(err)) {
        console.error('Resposta do servidor:', err.response?.data);
        setError(`Erro ao enviar documentos: ${err.response?.data?.message || err.message}`);
      } else {
        setError('Erro ao enviar documentos.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <Head title="Documentos" />
      <SettingsLayout>
        <div className="space-y-6">
          <HeadingSmall title="Documentos" description="Anexe seus documentos em PDF" />
          <form onSubmit={handleSubmit} className="space-y-4">
            {documentos.map((doc) => (
              <div key={doc.name} className="flex flex-col gap-2">
                <label className="font-semibold">{doc.label}</label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={e => handleFileChange(e, doc.name)}
                />
              </div>
            ))}
            
            <Button 
              type="submit" 
              disabled={loading || initializingPerson || !personId}
              className="w-full"
            >
              {loading ? 'Enviando...' : 'Salvar Documentos'}
            </Button>
            {success && <p className="text-green-600 text-center mt-2">{success}</p>}
            {error && <p className="text-red-600 text-center mt-2">{error}</p>}
          </form>
        </div>
      </SettingsLayout>
    </AppLayout>
  );
}