import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { SharedData, type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion'; 

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
  const nomeCompleto = auth.user.name;
  const partes = nomeCompleto.trim().split(' ');
  const [modalAberto, setModalAberto] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState<ProdutoCatalogo | null>(null);

  const produtos: ProdutoCatalogo[] = [
    {
      id: 1,
      nome: 'Vaga T.I',
      curso: 'SCPAR',
      imagem: '/vaga-ti.png',
    },
    {
      id: 2,
      nome: 'Vaga Comunicação',
      curso: 'SCPAR',
      imagem: '/vaga-ti.png',
    },
    {
      id: 3,
      nome: 'Vaga Operações',
      curso: 'SCPAR',
      imagem: '/vaga-ti.png',
    }
  ];

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
                <h1 className="text-xl font-semibold">Processo Seletivo de Estágio Nº 001/2025</h1>
                <hr className="mt-4 mb-4 w-full bg-[#008DD0] h-0.5" />
                <h2 className="text-md font-medium">Cadastro Reserva</h2>
                <h2 className="text-md">Cursos de Tecnólogo, Graduação e Pós-graduação Disponíveis para Estágio</h2>
              </div>

              {produtos.map((item) => (
                <div
                  key={item.id}
                  id={`card-produto-${item.id}`}
                  className={`group border-solid w-48 flex flex-col p-4 justify-between items-center shadow-xl shadow-slate-400 rounded-lg hover:scale-105 transition-transform`}>
                  <img
                    src={item.imagem}
                    alt={item.nome}
                    className="my-3 rounded-lg w-24 h-12 object-contain"
                  />
                  <p className="text-sm font-semibold">{item.nome}</p>
                  <p className="text-sm text-slate-400">{item.curso}</p>
                  <button
                    onClick={() => {
                      setProdutoSelecionado(item);
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
              <h2 className="text-xl font-semibold mb-2">
                Programa de estágio e aprendizagem em {produtoSelecionado.nome}
              </h2>
              <p className="text-sm text-gray-500 mb-4">
                Publicado em 21 de março de 2025<br />
                Inscrições abertas até 21 de abril de 2025
              </p>

              <h3 className="font-semibold mb-1">Atividades</h3>
              <ul className="list-disc list-inside text-sm mb-4">
                <li>Suporte técnico de TI</li>
                <li>Atendimento telefônico</li>
                <li>Monitoramento de chamados</li>
                <li>Suporte técnico TI/Informatica</li>
                <li>Garantir a resolução eficiente de problemas</li>
                <li>Monitorar e garantir a baixa de chamados</li>
              </ul>

              <h3 className="font-semibold mb-1">Requisitos e qualificações</h3>
              <ul className="list-disc list-inside text-sm mb-4">
                <li>Cursando ensino superior</li>
                <li>Cursos relacionados com TI</li>
                <li>Conhecimentos técnicos em TI</li>
              </ul>

              <h3 className="font-semibold mb-1">Valor da bolsa e carga horária</h3>
              <ul className="list-disc list-inside text-sm mb-4">
                <li>Bolsa: 20h semanais R$986,65 (graduação)</li>
                <li>Bolsa: 30h semanais R$1.479,94 (graduação)</li>
                <li>Bolsa: 20h semanais R$1.153,75 (pós)</li>
                <li>Bolsa: 30h semanais R$1.780,63 (pós)</li>
              </ul>

              <h3 className="font-semibold mb-1">Benefícios</h3>
              <p className="text-sm mb-4">Auxílio transporte R$10,78</p>

              <div className="text-sm text-blue-600 underline mb-4">
                <a href="/EDITAL_PSE_001.2025.pdf" target="_blank" rel="noopener noreferrer">EDITAL PSE 001.2025.pdf</a>
              </div>

              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Candidatar-se
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AppLayout>
  </>
);}