import axios from 'axios';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileDown } from 'lucide-react';

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

export default function CandidatoContratacao() {
    const queryParams = new URLSearchParams(window.location.search);
    const candidatoId = queryParams.get('id-candidato');

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
    }, [candidatoId, documentos]);

    return (
        <AppLayout>
            <Head title="Visualizar Vaga" />
            <h1 className='text-3xl'>Documentos da contratação de {person[0]?.name}</h1>
            <div className='flex gap-4'>
                {documentos
                    .filter((documento) => documento.tipo_documento === 'Contratacao').length > 0 ? (
                    documentos
                        .filter((documento) => documento.tipo_documento === 'Contratacao')
                        .map((documento) => (
                            <div key={documento.id} className="mb-4 text-center">
                                <p className='mb-2'>{documento.nome_documento}</p>
                                <a
                                    href={`/storage/app/public/${documento.documento}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Button className="bg-blue-600 hover:bg-blue-700 text-xs">
                                        <FileDown /> {documento.documento}
                                    </Button>
                                </a>
                            </div>
                        ))
                ) : (
                    <p>Candidato não possui documentos de contratação</p>
                )}
            </div>

            <h1 className='text-3xl'>Currículo de {person[0]?.name}</h1>

            <div>
                <h1 className='text-2xl font-semibold'>Informações pessoais</h1>
                <p>Nome Completo: {person[0]?.name}</p>
                <p>CPF: {person[0]?.cpf}</p>
                <p>Data de nascimento: {person[0]?.data_nascimento}</p>
                <p>E-mail: {person[0]?.email}</p>
                <p>Telefone: {person[0]?.telefone}</p>
            </div>
            <div>
                <h1 className='text-2xl font-semibold'>Endereço</h1>
                <p>CEP: {person[0]?.cep || 'Não informado'}</p>
                <p>Rua: {person[0]?.rua || 'Não informado'}</p>
                <p>Bairro: {person[0]?.bairro || 'Não informado'}</p>
                <p>Cidade: {person[0]?.cidade || 'Não informado'}</p>
                <p>Estado: {person[0]?.estado || 'Não informado'}</p>
                <p>Número: {person[0]?.numero || 'Não informado'}</p>
                <p>Complemento: {person[0]?.complemento || 'Não informado'}</p>
                <p>Referência: {person[0]?.referencia || 'Não informado'}</p>
            </div>
            <div>
                <h1 className='text-2xl font-semibold'>Sobre você</h1>
                <p>Gênero: {person[0]?.genero || 'Não informado'}</p>
                <p>Você tem obrigação legal com o Serviço Militar?: {person[0]?.servico_militar ? 'Sim' : 'Não'}</p>
                <p>Você possui algum tipo de deficiência?: {person[0]?.deficiencia ? 'Sim' : 'Não'}</p>
                <p>Qual o tipo de deficiência?: {person[0]?.qual_deficiencia || 'Não informado'}</p>
                <p>Fale um pouco sobre você: {person[0]?.sobre || 'Não informado'}</p>
                <p>LinkedIn: {person[0]?.linkedin || 'Não informado'}</p>
                <p>Instagram: {person[0]?.instagram || 'Não informado'}</p>
                <p>Facebook: {person[0]?.facebook || 'Não informado'}</p>
            </div>
            <div>
                <h1 className='text-2xl font-semibold'>Experiencias Acadêmica e Profissional</h1>
                {experiences.map((experience) => (
                    <div key={experience.id} className="mb-4">
                        <p className='font-semibold'>Tipo de Experiência: {experience.tipo_experiencia}</p>
                        <p>Empresa/Instituição: {experience.empresa_instituicao || 'Não informado'}</p>
                        <p>Nível: {experience.nivel || 'Não informado'}</p>
                        <p>Status: {experience.status || 'Não informado'}</p>
                        <p>Curso/Cargo: {experience.curso_cargo || 'Não informado'}</p>
                        <p>Atividades: {experience.atividades || 'Não informado'}</p>
                        <p>Semestre/Módulo: {experience.semestre_modulo || 'Não informado'}</p>
                        <p>Data de Início: {experience.data_inicio || 'Não informado'}</p>
                        <p>Data de Fim: {experience.data_fim || 'Não informado'}</p>
                        <p>Emprego Atual: {experience.emprego_atual ? 'Sim' : 'Não'}</p>
                    </div>
                ))}
            </div>
            <div>
                <h1 className='text-2xl font-semibold'>Experiencias Complementares</h1>
                {complementaruExperiences.map((experience) => (
                    <div key={experience.id} className="mb-4">
                        <p className='font-semibold'>Tipo de Experiência: {experience.tipo_experiencia}</p>
                        <p>Título: {experience.titulo}</p>
                        <p>Descrição: {experience.descricao}</p>
                        <p>Nível de Idioma: {experience.nivel_idioma || 'Não informado'}</p>
                        <p>Certificado: {experience.certificado || 'Não informado'}</p>
                        <p>Data de Início: {experience.data_inicio || 'Não informado'}</p>
                        <p>Data de Fim: {experience.data_fim || 'Não informado'}</p>
                        <p>Instituição: {experience.instituicao}</p>
                        <p>Status: {experience.status}</p>
                    </div>
                ))}
            </div>

            
        
        </AppLayout> 
    );
}