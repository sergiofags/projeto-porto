import axios from 'axios';
import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type Setor = {
  nome: string;
};

export default function CadastrarSetor() {
  const [setor, setSetor] = useState<Setor>({ nome: '' });
  const [mensagem, setMensagem] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);

  const submitSetor = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensagem('');
    setCarregando(true);

    try {
      const response = await axios.post('http://localhost:8000/api/setores', setor);
      const data = await response.data;

      if (data.error) {
        throw new Error(data.error);
      }

      setMensagem('Setor cadastrado com sucesso!');
      setSetor({ nome: '' });
      setModalAberto(true);
    } catch (error: any) {
      setMensagem(error.message || 'Erro ao cadastrar o setor');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <AppLayout>
      <Head title="Cadastrar Setor" />
      <div className="flex h-full max-h-full flex-1 flex-col gap-4 rounded-xl p-4">
        {/* Breadcrumb */}
        <nav className="text-sm text-muted-foreground mb-2">
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/" className="hover:underline text-[#008DD0]">Início</Link>
            </li>
            <li>
              <span className="text-[#008DD0] mx-1">/</span>
              <Link href="/setores" className="hover:underline text-[#008DD0]">Setores</Link>
            </li>
            <li>
              <span className="text-[#008DD0] mx-1">/</span>
              <span className="font-medium text-[#008DD0]">Cadastrar Setor</span>
            </li>
          </ol>
        </nav>

        {/* Título */}
        <div className="mt-2 mb-1 w-fit">
          <h1 className="text-2xl text-black">Cadastrar Setor</h1>
          <hr className="mt-1 bg-[#008DD0] h-0.5" />
        </div>

        {/* Formulário */}
        <div className="w-full bg-white">
          <form onSubmit={submitSetor} className="grid gap-4 md:grid-cols-6">
            <div className="md:col-span-6">
              <label htmlFor="nome" className="block mb-2">Nome do Setor</label>
              <input
                id="nome"
                type="text"
                value={setor.nome}
                onChange={(e) => setSetor({ ...setor, nome: e.target.value })}
                placeholder="Nome do setor"
                className="w-full pl-2 pr-2 py-2 border border-[#008DD0] rounded-md focus:outline-none focus:border-[#145F7F] text-black shadow-md"
                required
              />
            </div>

            <div className="md:col-span-6 flex justify-between gap-2 mt-2">
              <Link href="/setores" className="w-full md:w-auto">
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
                <h2 className="text-xl font-semibold mb-4 text-green-600">Setor cadastrado com sucesso!</h2>
                <button
                  className="mt-2 px-6 py-2 bg-[#008DD0] hover:bg-[#0072d0] text-white rounded shadow"
                  onClick={() => router.visit('/setores')}
                >
                  Voltar para Setores
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
