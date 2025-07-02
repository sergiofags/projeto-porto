import axios from 'axios';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp, FileDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Person = {
    id_user: string;
    id_person: string ,
    name: string;
    foto_perfil?: string;
    sobre?: string;
    linkedin?: string;
    instagram?: string;
    facebook?: string;
    cpf?: string;
    data_nascimento?: string;
    genero?: 'Masculino' | 'Feminino' | 'Outro';
    deficiencia?: boolean;
    qual_deficiencia?: string | null;
    servico_militar?: boolean;
    telefone?: string;
    rua?: string;
    bairro?: string;
    cidade?: string;
    estado?: string;
    numero?: string;
    complemento?: string;
    cep?: string;
    referencia?: string;
    estou_ciente?: boolean;
    email?: string;
};

type Experiences = {
    id: string;
    tipo_experiencia: string;
    empresa_instituicao?: string;
    nivel?: string;
    status?: string;
    curso_cargo?: string;
    atividades?: string;
    semestre_modulo?: string;
    data_inicio?: string;
    data_fim?: string | null;
    emprego_atual?: string;
};

type ComplementaruExperiences = {
    id: string,
    tipo_experiencia: string,
    titulo: string,
    descricao: string,
    nivel_idioma?: string,
    certificado?: string| null,
    data_inicio?: string,
    data_fim?: string | null,
    instituicao: string,
    status: string,
};

type Documentos = {
    id: string;
    id_person: string;
    tipo_documento: 'Candidatura' | 'Contratacao';
    documento?: string | null;
    nome_documento: 'AtestadoMatricula' | 'HistoricoEscolar' | 'Curriculo' | 'CoeficienteRendimento' | 'Foto3x4' | 'CedulaIdentidadeOuCNH' | 'CadastroPessoaFisica' | 'CTPS' | 'CarteiraDeReservista' | 'ComprovanteDeResidencia' | 'AntecedentesCriminaisECivel' | 'AntecedentesCriminaisPoliciaFederal' | 'VacinacaFebreAmarela' | 'VacinacaCovid19' | 'GrupoSanguineo' | 'ComprovanteMatricula' | 'AtestadadoFrequencia';
};

export default function CadastrarVaga() {
    const queryParams = new URLSearchParams(window.location.search);
    const candidatoId = queryParams.get('id-candidato');

    const [abertoInformacoes, setAbertoInformacoes] = useState(true);
    const [abertoSobre, setAbertoSobre] = useState(false);
    const [abertoExperiencias, setAbertoExperiencias] = useState(false);

    const [person, setPerson] = useState<Person[]>([]);
    const [experiences, setExperiences] = useState<Experiences[]>([]);
    const [complementaruExperiences, setComplementaryExperiences] = useState<ComplementaruExperiences[]>([]);
    const [documentos, setDocumentos] = useState<Documentos[]>([]);

    useEffect(() => {
        const fetchVacancy = async () => {
            try {
                const responsePerson = await axios.get(`http://localhost:8000/api/person/${candidatoId}`);
                setPerson(Array.isArray(responsePerson.data) ? responsePerson.data : [responsePerson.data]);
                setPerson([{
                    ...responsePerson.data,
                    data_nascimento: responsePerson.data.data_nascimento.split("-").reverse().join("/"),
                }])

                const responseExperience = await axios.get(`http://localhost:8000/api/person/${candidatoId}/experience`);
                setExperiences(responseExperience.data);
                setExperiences(responseExperience.data.map((experience: Experiences) => ({
                    ...experience,
                    data_inicio: experience.data_inicio ? experience.data_inicio.split(" ")[0].split("-").reverse().join("/") : 'Não informado',
                    data_fim: experience.data_fim ? experience.data_fim.split(" ")[0].split("-").reverse().join("/") : 'Não informado',
                })));
                
                const responseComplementaryExperience = await axios.get(`http://localhost:8000/api/person/${candidatoId}/complementaryexperience`);
                setComplementaryExperiences(responseComplementaryExperience.data);
                setComplementaryExperiences(responseComplementaryExperience.data.map((complementaruExperiences: ComplementaruExperiences) => ({
                    ...complementaruExperiences,
                    data_inicio: complementaruExperiences.data_inicio ? complementaruExperiences.data_inicio.split(" ")[0].split("-").reverse().join("/") : 'Não informado',
                    data_fim: complementaruExperiences.data_fim ? complementaruExperiences.data_fim.split(" ")[0].split("-").reverse().join("/") : 'Não informado',
                })));

                const responseDocuments = await axios.get(`http://localhost:8000/api/person/${candidatoId}/document`);
                setDocumentos(responseDocuments.data);
                
            } catch (error) {
                alert(error)
                return;
            }
        };

        fetchVacancy();
    }, []);

    return (
        <AppLayout>
            <Head title="Visualizar Vaga" />
            <div className="tracking-wide w-full break-words">
                <h1 className='text-3xl mt-10 pl-4 pr-4'>Documentos da candidatura de {person[0]?.name}</h1>
                <hr className="max-w-md mb-4 ml-4 mr-4 bg-[#008DD0] h-0.5" />
                <div className='flex gap-4'>
                    {['AtestadoMatricula', 'HistoricoEscolar', 'Curriculo'].map((docName) => {
                        const documento = documentos.find(
                            (doc) => doc.tipo_documento === 'Candidatura' && doc.nome_documento === docName
                        );
                        return (
                            <div key={docName} className="mb-4 text-center">
                                <p className="mb-2">{docName}</p>
                                {documento ? (
                                    <a
                                        href={`/storage/app/public/${documento.documento}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <Button className="bg-blue-600 hover:bg-blue-700 text-xs">
                                            <FileDown /> {documento.documento}
                                        </Button>
                                    </a>
                                ) : (
                                    <p>Documento não informado</p>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
            
            <h1 className='text-3xl mt-10 pl-4 pr-4'>Confira o currículo de {person[0]?.name}</h1>

            {/* COPIADO DE LANDING-PAGE */}
            <div className="border border-blue-300 rounded-xl p-4">
                <div
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => setAbertoInformacoes(!abertoInformacoes)}>
                    <h1 className="text-lg font-medium">Informações pessoais</h1>
                    {abertoInformacoes ? <ChevronUp /> : <ChevronDown />}
                </div>

                {abertoInformacoes && (
                    <>
                        <div className="pt-6">
                            <p className="pb-2">Nome Completo</p>
                            <input
                                type="text"
                                id="nome"
                                name="nome"
                                value={person[0]?.name}
                                readOnly // impede edição, se for apenas para visualização
                                className="w-full rounded-md border border-blue-400 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />

                        </div>
                        
                        <div className="pt-6">
                            <p className="pb-2">CPF</p>
                            <input
                                type="text"
                                id="cpf"
                                name="cpf"
                                value={person[0]?.cpf}
                                readOnly // impede edição, se for apenas para visualização
                                className="w-full rounded-md border border-blue-400 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />

                        </div>
                        
                        <div className="pt-6">
                            <p className="pb-2">Data de Nascimento</p>
                            <input
                                type="text"
                                id="data_nascimento"
                                name="data_nascimento"
                                value={person[0]?.data_nascimento}
                                readOnly // impede edição, se for apenas para visualização
                                className="w-full rounded-md border border-blue-400 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="pt-6">
                            <p className="pb-2">E-mail</p>
                            <input
                                type="text"
                                id="email"
                                name="email"
                                value={person[0]?.email}
                                readOnly // impede edição, se for apenas para visualização
                                className="w-full rounded-md border border-blue-400 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="pt-6">
                            <p className="pb-2">Telefone</p>
                            <input
                                type="text"
                                id="telefone"
                                name="telefone"
                                value={person[0]?.telefone}
                                readOnly // impede edição, se for apenas para visualização
                                className="w-full rounded-md border border-blue-400 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <h1 className="pt-6 font-semibold">Endereço</h1>

                        <div className="pt-6">
                            <p className="pb-2">CEP</p>
                            <input
                                type="text"
                                id="cep"
                                name="cep"
                                value={person[0]?.cep || 'Não informado'}
                                readOnly // impede edição, se for apenas para visualização
                                className="w-full rounded-md border border-blue-400 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="pt-6">
                            <p className="pb-2">Rua</p>
                            <input
                                type="text"
                                id="rua"
                                name="rua"
                                value={person[0]?.rua || 'Não informado'}
                                readOnly // impede edição, se for apenas para visualização
                                className="w-full rounded-md border border-blue-400 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="pt-6">
                            <p className="pb-2">Bairro</p>
                            <input
                                type="text"
                                id="bairro"
                                name="bairro"
                                value={person[0]?.bairro || 'Não informado'}
                                readOnly // impede edição, se for apenas para visualização
                                className="w-full rounded-md border border-blue-400 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="pt-6">
                            <p className="pb-2">Cidade</p>
                            <input
                                type="text"
                                id="cidade"
                                name="cidade"
                                value={person[0]?.cidade || 'Não informado'}
                                readOnly // impede edição, se for apenas para visualização
                                className="w-full rounded-md border border-blue-400 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="pt-6">
                            <p className="pb-2">Estado</p>
                            <input
                                type="text"
                                id="estado"
                                name="estado"
                                value={person[0]?.estado || 'Não informado'}
                                readOnly // impede edição, se for apenas para visualização
                                className="w-full rounded-md border border-blue-400 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="pt-6">
                            <p className="pb-2">Número</p>
                            <input
                                type="text"
                                id="numero"
                                name="numero"
                                value={person[0]?.numero || 'Não informado'}
                                readOnly // impede edição, se for apenas para visualização
                                className="w-full rounded-md border border-blue-400 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="pt-6">
                            <p className="pb-2">Complemento</p>
                            <input
                                type="text"
                                id="complemento"
                                name="complemento"
                                value={person[0]?.complemento || 'Não informado'}
                                readOnly // impede edição, se for apenas para visualização
                                className="w-full rounded-md border border-blue-400 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="pt-6">
                            <p className="pb-2">Referência</p>
                            <input
                                type="text"
                                id="referencia"
                                name="referencia"
                                value={person[0]?.referencia || 'Não informado'}
                                readOnly // impede edição, se for apenas para visualização
                                className="w-full rounded-md border border-blue-400 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </>
                )}
            </div>

            <div className="border border-blue-300 rounded-xl p-4">
                <div
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => setAbertoSobre(!abertoSobre)}>
                    <h1 className="text-lg font-medium">Sobre você</h1>
                    {abertoSobre ? <ChevronUp /> : <ChevronDown />}
                </div>
                
                {abertoSobre && (
                    <>
                        <div className="pt-6">
                            <p className="pb-2">Gênero</p>
                            <input
                                type="text"
                                id="genero"
                                name="genero"
                                value={person[0]?.genero || 'Não informado'}
                                readOnly // impede edição, se for apenas para visualização
                                className="w-full rounded-md border border-blue-400 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="pt-6">
                            <p className="pb-2">Você tem obrigação legal com o Serviço Militar?</p>
                            <input
                                type="text"
                                id="servico_militar"
                                name="servico_militar"
                                value={person[0]?.servico_militar ? 'Sim' : 'Não'}
                                readOnly // impede edição, se for apenas para visualização
                                className="w-full rounded-md border border-blue-400 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="pt-6">
                            <p className="pb-2">Você possui algum tipo de deficiência?</p>
                            <input
                                type="text"
                                id="deficiencia"
                                name="deficiencia"
                                value={person[0]?.deficiencia ? 'Sim' : 'Não'}
                                readOnly // impede edição, se for apenas para visualização
                                className="w-full rounded-md border border-blue-400 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="pt-6">
                            <p className="pb-2">Qual o tipo de deficiência?</p>
                            <input
                                type="text"
                                id="qual_deficiencia"
                                name="qual_deficiencia"
                                value={person[0]?.qual_deficiencia || 'Não informado'}
                                readOnly // impede edição, se for apenas para visualização
                                className="w-full rounded-md border border-blue-400 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="pt-6">
                            <p className="pb-2">Fale um pouco sobre você</p>
                            <input
                                type="text"
                                id="sobre"
                                name="sobre"
                                value={person[0]?.sobre || 'Não informado'}
                                readOnly // impede edição, se for apenas para visualização
                                className="w-full rounded-md border border-blue-400 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="pt-6">
                            <p className="pb-2">LinkedIn</p>
                            <input
                                type="text"
                                id="linkedin"
                                name="linkedin"
                                value={person[0]?.linkedin || 'Não informado'}
                                readOnly // impede edição, se for apenas para visualização
                                className="w-full rounded-md border border-blue-400 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="pt-6">
                            <p className="pb-2">Instagram</p>
                            <input
                                type="text"
                                id="instagram"
                                name="instagram"
                                value={person[0]?.instagram || 'Não informado'}
                                readOnly // impede edição, se for apenas para visualização
                                className="w-full rounded-md border border-blue-400 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="pt-6">
                            <p className="pb-2">Facebook</p>
                            <input
                                type="text"
                                id="facebook"
                                name="facebook"
                                value={person[0]?.facebook || 'Não informado'}
                                readOnly // impede edição, se for apenas para visualização
                                className="w-full rounded-md border border-blue-400 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                    </>
                )}
            </div>

            <div className="border border-blue-300 rounded-xl p-4">
                <div
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => setAbertoExperiencias(!abertoExperiencias)}>
                    <h1 className="text-lg font-medium">Experiencias Acadêmica e Profissional</h1>
                    {abertoExperiencias ? <ChevronUp /> : <ChevronDown />}
                </div>
                
                {abertoExperiencias && (
                    <>
                        <h2 className="text-xl font-semibold mt-4 mb-2">Experiências Acadêmicas</h2>
                        {experiences.filter(e => e.tipo_experiencia === 'Acadêmica').length === 0 && (
                            <p className="text-gray-500 mb-4">Nenhuma experiência acadêmica cadastrada.</p>
                        )}
                        {experiences
                            .filter(e => e.tipo_experiencia === 'Acadêmica')
                            .map((experience) => (
                                <div key={experience.id} className="mb-4">
                                    <div className="pt-6">
                                        <p className="pb-2">Empresa/Instituição:</p>
                                        <input
                                            type="text"
                                            id="empresa_instituicao"
                                            name="empresa_instituicao"
                                            value={experience.empresa_instituicao || 'Não informado'}
                                            readOnly
                                            className="w-full rounded-md border border-blue-400 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div className="pt-6">
                                        <p className="pb-2">Nível:</p>
                                        <input
                                            type="text"
                                            id="nivel"
                                            name="nivel"
                                            value={experience.nivel || 'Não informado'}
                                            readOnly
                                            className="w-full rounded-md border border-blue-400 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div className="pt-6">
                                        <p className="pb-2">Status:</p>
                                        <input
                                            type="text"
                                            id="status"
                                            name="status"
                                            value={experience.status || 'Não informado'}
                                            readOnly
                                            className="w-full rounded-md border border-blue-400 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div className="pt-6">
                                        <p className="pb-2">Curso/Cargo:</p>
                                        <input
                                            type="text"
                                            id="curso_cargo"
                                            name="curso_cargo"
                                            value={experience.curso_cargo || 'Não informado'}
                                            readOnly
                                            className="w-full rounded-md border border-blue-400 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div className="pt-6">
                                        <p className="pb-2">Atividades:</p>
                                        <input
                                            type="text"
                                            id="atividades"
                                            name="atividades"
                                            value={experience.atividades || 'Não informado'}
                                            readOnly
                                            className="w-full rounded-md border border-blue-400 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div className="pt-6">
                                        <p className="pb-2">Semestre/Módulo:</p>
                                        <input
                                            type="text"
                                            id="semestre_modulo"
                                            name="semestre_modulo"
                                            value={experience.semestre_modulo || 'Não informado'}
                                            readOnly
                                            className="w-full rounded-md border border-blue-400 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div className="pt-6">
                                        <p className="pb-2">Data de Início:</p>
                                        <input
                                            type="text"
                                            id="data_inicio"
                                            name="data_inicio"
                                            value={experience.data_inicio || 'Não informado'}
                                            readOnly
                                            className="w-full rounded-md border border-blue-400 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div className="pt-6">
                                        <p className="pb-2">Data de Fim:</p>
                                        <input
                                            type="text"
                                            id="data_fim"
                                            name="data_fim"
                                            value={experience.data_fim || 'Não informado'}
                                            readOnly
                                            className="w-full rounded-md border border-blue-400 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                            ))}

                        <h2 className="text-xl font-semibold mt-8 mb-2">Experiências Profissionais</h2>
                        {experiences.filter(e => e.tipo_experiencia === 'Profissional').length === 0 && (
                            <p className="text-gray-500 mb-4">Nenhuma experiência profissional cadastrada.</p>
                        )}
                        {experiences
                            .filter(e => e.tipo_experiencia === 'Profissional')
                            .map((experience) => (
                                <div key={experience.id} className="mb-4">
                                    <div className="pt-6">
                                        <p className="pb-2">Empresa/Instituição:</p>
                                        <input
                                            type="text"
                                            id="empresa_instituicao"
                                            name="empresa_instituicao"
                                            value={experience.empresa_instituicao || 'Não informado'}
                                            readOnly
                                            className="w-full rounded-md border border-blue-400 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div className="pt-6">
                                        <p className="pb-2">Nível:</p>
                                        <input
                                            type="text"
                                            id="nivel"
                                            name="nivel"
                                            value={experience.nivel || 'Não informado'}
                                            readOnly
                                            className="w-full rounded-md border border-blue-400 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div className="pt-6">
                                        <p className="pb-2">Status:</p>
                                        <input
                                            type="text"
                                            id="status"
                                            name="status"
                                            value={experience.status || 'Não informado'}
                                            readOnly
                                            className="w-full rounded-md border border-blue-400 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div className="pt-6">
                                        <p className="pb-2">Curso/Cargo:</p>
                                        <input
                                            type="text"
                                            id="curso_cargo"
                                            name="curso_cargo"
                                            value={experience.curso_cargo || 'Não informado'}
                                            readOnly
                                            className="w-full rounded-md border border-blue-400 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div className="pt-6">
                                        <p className="pb-2">Atividades:</p>
                                        <input
                                            type="text"
                                            id="atividades"
                                            name="atividades"
                                            value={experience.atividades || 'Não informado'}
                                            readOnly
                                            className="w-full rounded-md border border-blue-400 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div className="pt-6">
                                        <p className="pb-2">Semestre/Módulo:</p>
                                        <input
                                            type="text"
                                            id="semestre_modulo"
                                            name="semestre_modulo"
                                            value={experience.semestre_modulo || 'Não informado'}
                                            readOnly
                                            className="w-full rounded-md border border-blue-400 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div className="pt-6">
                                        <p className="pb-2">Data de Início:</p>
                                        <input
                                            type="text"
                                            id="data_inicio"
                                            name="data_inicio"
                                            value={experience.data_inicio || 'Não informado'}
                                            readOnly
                                            className="w-full rounded-md border border-blue-400 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div className="pt-6">
                                        <p className="pb-2">Data de Fim:</p>
                                        <input
                                            type="text"
                                            id="data_fim"
                                            name="data_fim"
                                            value={experience.data_fim || 'Não informado'}
                                            readOnly
                                            className="w-full rounded-md border border-blue-400 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div className="pt-6">
                                        <p className="pb-2">Emprego Atual:</p>
                                        <input
                                            type="text"
                                            id="emprego_atual"
                                            name="emprego_atual"
                                            value={experience.emprego_atual ? 'Sim' : 'Não'}
                                            readOnly
                                            className="w-full rounded-md border border-blue-400 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                            ))}

                        <h2 className="text-xl font-semibold mt-8 mb-2">Experiências Complementares</h2>
                        {complementaruExperiences.length === 0 && (
                            <p className="text-gray-500 mb-4">Nenhuma experiência complementar cadastrada.</p>
                        )}
                        {complementaruExperiences.map((experience) => (
                            <div key={experience.id} className="mb-4">
                                <div className="pt-6">
                                    <p className='font-semibold'>Tipo de Experiência: {experience.tipo_experiencia}</p>
                                    <p className="pb-2">Título:</p>
                                    <input
                                        type="text"
                                        id="titulo"
                                        name="titulo"
                                        value={experience.titulo}
                                        readOnly
                                        className="w-full rounded-md border border-blue-400 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="pt-6">
                                    <p className="pb-2">Descrição:</p>
                                    <input
                                        type="text"
                                        id="descricao"
                                        name="descricao"
                                        value={experience.descricao}
                                        readOnly
                                        className="w-full rounded-md border border-blue-400 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="pt-6">
                                    <p className="pb-2">Nível de Idioma:</p>
                                    <input
                                        type="text"
                                        id="nivel_idioma"
                                        name="nivel_idioma"
                                        value={experience.nivel_idioma || 'Não informado'}
                                        readOnly
                                        className="w-full rounded-md border border-blue-400 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="pt-6">
                                    <p className="pb-2">Certificado:</p>
                                    <input
                                        type="text"
                                        id="certificado"
                                        name="certificado"
                                        value={experience.certificado || 'Não informado'}
                                        readOnly
                                        className="w-full rounded-md border border-blue-400 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="pt-6">
                                    <p className="pb-2">Data de Início:</p>
                                    <input
                                        type="text"
                                        id="data_inicio"
                                        name="data_inicio"
                                        value={experience.data_inicio || 'Não informado'}
                                        readOnly
                                        className="w-full rounded-md border border-blue-400 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="pt-6">
                                    <p className="pb-2">Data de Fim:</p>
                                    <input
                                        type="text"
                                        id="data_fim"
                                        name="data_fim"
                                        value={experience.data_fim || 'Não informado'}
                                        readOnly
                                        className="w-full rounded-md border border-blue-400 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="pt-6">
                                    <p className="pb-2">Instituição:</p>
                                    <input
                                        type="text"
                                        id="instituicao"
                                        name="instituicao"
                                        value={experience.instituicao}
                                        readOnly
                                        className="w-full rounded-md border border-blue-400 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="pt-6">
                                    <p className="pb-2">Status:</p>
                                    <input
                                        type="text"
                                        id="status"
                                        name="status"
                                        value={experience.status}
                                        readOnly
                                        className="w-full rounded-md border border-blue-400 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        ))}
                    </>
                )}
            </div> 
        
        </AppLayout> 
    );
}