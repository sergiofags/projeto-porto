import axios from 'axios';
import { SharedData, type BreadcrumbItem } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, usePage } from '@inertiajs/react';
import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FormEventHandler, useState, useEffect } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Experiências',
        href: '/settings/experience',
    },
];

export default function Experience() {
    const { auth } = usePage<SharedData>().props;
    const personId = auth.user.id;

    const [experiencia, setExperiencia] = useState({
        id_person: personId,
        tipo_experiencia: '',
        empresa_instituicao: '',
        nivel: '',
        status: '',
        curso_cargo: '',
        atividades: '',
        semestre_modulo: '',
        data_inicio: '',
        data_fim: '' as string | null,
        emprego_atual: 'Não',
    });

    const [experienceRecentlySuccessful, setExperienceRecentlySuccessful] = useState(false);

    const submitExperience: FormEventHandler = async (e) => {
        e.preventDefault();

        if (experiencia.data_fim === '') {
            setExperiencia({ ...experiencia, data_fim: null });
        }

        try {
            const experienciaFormatada = {
                ...experiencia,
                data_fim: experiencia.status !== 'Formado' ? null : experiencia.data_fim || null,
              };

            const response = await fetch(`http://localhost:8000/api/person/${personId}/experience`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(experienciaFormatada),
            });
        
            const data = await response.json(); // ✅ única leitura
        
            if (!response.ok) {
                console.error('Erro da API:', data);
                throw new Error(data.message || 'Erro desconhecido');
            }
        
            console.log('Resposta da API:', data);
        
            setExperienceRecentlySuccessful(true);
            setTimeout(() => {
                setExperienceRecentlySuccessful(false);
                setExperiences((prev) => [...prev, data]);
            }, 3000);
        
        } catch (error) {
            console.error('Erro ao enviar experiência:', error);
            if (error instanceof Error) {
                alert(error.message);
            } else {
                alert('Erro desconhecido');
            }
        }
    };
    

    const [experiences, setExperiences] = useState<Array<{
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
        }>>([]);

    useEffect(() => {
        const fetchExperiences = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/person/${personId}/experience`);
                setExperiences(response.data);
            } catch (error) {
                console.error('Error fetching experiences:', error);
            }
        };

        fetchExperiences();
    }, [auth.user.id, personId]);


    const deleteExperience = async (id: string) => {
            try {
                await axios.delete(`http://localhost:8000/api/person/${personId}/experience/${id}`);

                setExperiences((prev) => prev.filter((exp) => exp.id !== id));
                
            } catch (error) {
                console.error('Error deleting experience:', error);
            }
        } 

    // Estados para controlar o efeito sanfona
    const [abertoFormulario, setAbertoFormulario] = useState(false);

    // Complementary Experience State
    const [complementar, setComplementar] = useState({
        id_person: personId,
        tipo_experiencia: '',
        titulo: '',
        descricao: '',
        nivel_idioma: '',
        certificado: null,
        data_inicio: '',
        data_fim: '' as string | null,
        instituicao: '',
        status: '',
    });
    const [complementaryRecentlySuccessful, setComplementaryRecentlySuccessful] = useState(false);
    const [complementaryExperiences, setComplementaryExperiences] = useState<Array<{
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
    }>>([]);

    useEffect(() => {
        const fetchComplementary = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/person/${personId}/complementaryexperience`);
                setComplementaryExperiences(response.data);
            } catch (error) {
                console.error('Error fetching complementary experiences:', error);
            }
        };
        fetchComplementary();
    }, [auth.user.id, personId]);

    const submitComplementary: FormEventHandler = async (e) => {
        e.preventDefault();
        if (complementar.data_fim === '') {
            setComplementar({ ...complementar, data_fim: null });
        }
        try {
            const compFormatada = {
                ...complementar,
                data_fim: complementar.status !== 'Concluido' ? null : complementar.data_fim || null,
            };
            const response = await fetch(`http://localhost:8000/api/person/${personId}/complementaryexperience`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(compFormatada),
            });
            const data = await response.json();
            if (!response.ok) {
                console.error('Erro da API:', data);
                throw new Error(data.message || 'Erro desconhecido');
            }
            setComplementaryRecentlySuccessful(true);
            setTimeout(() => {
                setComplementaryRecentlySuccessful(false);
                setComplementaryExperiences((prev) => [...prev, data]);
            }, 3000);
        } catch (error) {
            console.error('Erro ao enviar experiência complementar:', error);
            if (error instanceof Error) alert(error.message);
            else alert('Erro desconhecido');
        }
    };

    const deleteComplementary = async (id: string) => {
        try {
            await axios.delete(`http://localhost:8000/api/person/${personId}/complementaryexperience/${id}`);
            setComplementaryExperiences((prev) => prev.filter((exp) => exp.id !== id));
        } catch (error) {
            console.error('Error deleting complementary experience:', error);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />
            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Suas Experiências" description="Adicione suas experiências acadêmicas, profissionais e complementares" />

                    {/* Sanfona Experiências */}
                    <div className="border border-blue-300 rounded-xl p-4">
                        <div className="flex justify-between items-center cursor-pointer" onClick={() => setAbertoFormulario(!abertoFormulario)}>
                            <div className="inline-block">
                                <h2 className="text-lg font-medium inline-block">Experiências</h2>
                                <hr className="mt-2 h-0.5 bg-[#008DD0]" />
                            </div>
                            {abertoFormulario ? <ChevronUp /> : <ChevronDown />}
                        </div>
                        {abertoFormulario && (
                            <>
                                <div className="space-y-6 mt-4">
                                    <div className="inline-block">
                                        <h3 className="text-lg font-medium inline-block">Experiências Acadêmicas e/ou Profissionais</h3>
                                        <hr className="mt-2 h-0.5 bg-[#008DD0]" />
                                        <br/>
                                        <HeadingSmall title="Suas experiências já cadastradas:" />
                                    </div>
                                    {experiences.map((experience) => (
                                        <div key={experience.id} className="grid gap-2 border p-4 rounded-md">
                                            {/* Renderize os campos relevantes da experiência */}
                                            <p><strong>Tipo:</strong> {experience.tipo_experiencia}</p>
                                            {experience.empresa_instituicao && <p><strong>Instituição/Empresa:</strong> {experience.empresa_instituicao}</p>}
                                            {experience.curso_cargo && <p><strong>Curso/Cargo:</strong> {experience.curso_cargo}</p>}
                                            {experience.nivel && <p><strong>Nível:</strong> {experience.nivel}</p>}
                                            {experience.status && <p><strong>Status:</strong> {experience.status}</p>}
                                            {experience.atividades && <p><strong>Atividades:</strong> {experience.atividades}</p>}
                                            {experience.semestre_modulo && <p><strong>Semestre/Módulo:</strong> {experience.semestre_modulo}</p>}
                                            {experience.data_inicio && <p><strong>Data Início:</strong> {experience.data_inicio}</p>}
                                            {experience.data_fim && <p><strong>Data Fim:</strong> {experience.data_fim}</p>}
                                            {experience.emprego_atual && <p><strong>Emprego Atual:</strong> {experience.emprego_atual}</p>}
                                            <div>
                                                <Button onClick={() => deleteExperience(experience.id)} className='bg-red-500 hover:bg-red-600 cursor-pointer transition-colors duration-200'>Excluir <Trash2 /></Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {/* Formulário de experiência acadêmica/profissional */}
                                <form onSubmit={submitExperience} className="space-y-6 mt-8">
                                    <div className="grid gap-2">
                                        <HeadingSmall title="Adicione suas experiências acadêmicas e/ou profissionais:" />
                                        <Label htmlFor="tipo_experiencia">Tipo experiência</Label>
                                        <Select
                                            value={experiencia.tipo_experiencia}
                                            onValueChange={(value) => setExperiencia({ ...experiencia, tipo_experiencia: value })}
                                            required
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Selecione o tipo de experiência" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Tipos</SelectLabel>
                                                    <SelectItem value="Acadêmica">Acadêmica</SelectItem>
                                                    <SelectItem value="Profissional">Profissional</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    
                                    {experiencia.tipo_experiencia === 'Acadêmica' && (
                                        <>
                                            <div className="grid gap-2">
                                                <Label htmlFor="status">Status</Label>
                                                <Select
                                                    value={experiencia.status}
                                                    onValueChange={(value) => setExperiencia({ ...experiencia, status: value })}
                                                    required
                                                >
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Selecione o status" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            <SelectLabel>Status</SelectLabel>
                                                            <SelectItem value="Trancado">Trancado</SelectItem>
                                                            <SelectItem value="Cursando">Cursando</SelectItem>
                                                            <SelectItem value="Formado">Formado</SelectItem>
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="grid gap-2">
                                                <Label htmlFor="empresa_instituicao">Instituição</Label>
                                                <Input
                                                    id="empresa_instituicao"
                                                    value={experiencia.empresa_instituicao}
                                                    onChange={(e) => setExperiencia({ ...experiencia, empresa_instituicao: e.target.value })}
                                                    placeholder="Instituição"
                                                />
                                            </div>

                                            <div className="grid gap-2">
                                                <Label htmlFor="nivel">Nivel</Label>
                                                <Select
                                                    value={experiencia.nivel}
                                                    onValueChange={(value) => setExperiencia({ ...experiencia, nivel: value })}
                                                    required
                                                >
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Selecione o nivel" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            <SelectLabel>Niveis</SelectLabel>
                                                            <SelectItem value="Graduacao">Graduação</SelectItem>
                                                            <SelectItem value="PosGarduacao">Pós-Graduação</SelectItem>
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="grid gap-2">
                                                <Label htmlFor="curso_cargo">Curso</Label>
                                                <Input
                                                    id="curso_cargo"
                                                    value={experiencia.curso_cargo}
                                                    onChange={(e) => setExperiencia({ ...experiencia, curso_cargo: e.target.value })}
                                                    placeholder="Curso"
                                                />
                                            </div>

                                            <div className="grid gap-2">
                                                <Label htmlFor="atividades">Atividades</Label>
                                                <Textarea
                                                    id="atividades"
                                                    value={experiencia.atividades}
                                                    onChange={(e) => setExperiencia({ ...experiencia, atividades: e.target.value })}
                                                    placeholder="Descreva as atividades realizadas"
                                                />
                                            </div>

                                            <div className="grid gap-2">
                                                <Label htmlFor="semestre_modulo">Semestre/Módulo</Label>
                                                <Input
                                                    id="semestre_modulo"
                                                    value={experiencia.semestre_modulo}
                                                    onChange={(e) => setExperiencia({ ...experiencia, semestre_modulo: e.target.value })}
                                                    placeholder="Semestre ou Módulo"
                                                />
                                            </div>

                                            <div className="grid gap-2">
                                                <Label htmlFor="data_inicio">Data início</Label>
                                                <Input
                                                    id="data_inicio"
                                                    value={experiencia.data_inicio}
                                                    onChange={(e) => {
                                                        let value = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters
                                                        if (value.length > 2) value = value.slice(0, 2) + '/' + value.slice(2);
                                                        if (value.length > 5) value = value.slice(0, 5) + '/' + value.slice(5, 9);
                                                        setExperiencia({ ...experiencia, data_inicio: value });
                                                    }}
                                                    placeholder="Data início"
                                                    required
                                                />
                                            </div>

                                            {experiencia.status === 'Formado' && (
                                                <div className="grid gap-2">
                                                    <Label htmlFor="data_fim">Data fim</Label>
                                                    <Input
                                                        id="data_fim"
                                                        value={experiencia.data_fim ?? ''}
                                                        onChange={(e) => {
                                                            let value = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters
                                                            if (value.length > 2) value = value.slice(0, 2) + '/' + value.slice(2);
                                                            if (value.length > 5) value = value.slice(0, 5) + '/' + value.slice(5, 9);
                                                            setExperiencia({ ...experiencia, data_fim: value });
                                                        }}
                                                        placeholder="Data fim"
                                                    />
                                                </div>
                                            )}
                                        </>
                                    )}

                                    {experiencia.tipo_experiencia === 'Profissional' && (
                                        <>
                                            <div className="grid gap-2">
                                                <Label htmlFor="empresa_instituicao">Empresa</Label>
                                                <Input
                                                    id="empresa_instituicao"
                                                    value={experiencia.empresa_instituicao}
                                                    onChange={(e) => setExperiencia({ ...experiencia, empresa_instituicao: e.target.value })}
                                                    placeholder="Empresa"
                                                />
                                            </div>

                                            <div className="grid gap-2">
                                                <Label htmlFor="curso_cargo">Cargo</Label>
                                                <Input
                                                    id="curso_cargo"
                                                    value={experiencia.curso_cargo}
                                                    onChange={(e) => setExperiencia({ ...experiencia, curso_cargo: e.target.value })}
                                                    placeholder="Cargo"
                                                />
                                            </div>

                                            <div className="grid gap-2">
                                                <Label htmlFor="atividades">Atividades</Label>
                                                <Textarea
                                                    id="atividades"
                                                    value={experiencia.atividades}
                                                    onChange={(e) => setExperiencia({ ...experiencia, atividades: e.target.value })}
                                                    placeholder="Descreva as atividades realizadas"
                                                />
                                            </div>

                                            <div className="grid gap-2">
                                                <Label htmlFor="emprego_atual">Emprego Atual</Label>
                                                <Select
                                                    value={experiencia.emprego_atual}
                                                    onValueChange={(value) => setExperiencia({ ...experiencia, emprego_atual: value })}
                                                    required
                                                >
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Selecione" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            <SelectLabel>Emprego Atual</SelectLabel>
                                                            <SelectItem value="Sim">Sim</SelectItem>
                                                            <SelectItem value="Não">Não</SelectItem>
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="grid gap-2">
                                                <Label htmlFor="data_inicio">Data início</Label>
                                                <Input
                                                    id="data_inicio"
                                                    value={experiencia.data_inicio}
                                                    onChange={(e) => {
                                                        let value = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters
                                                        if (value.length > 2) value = value.slice(0, 2) + '/' + value.slice(2);
                                                        if (value.length > 5) value = value.slice(0, 5) + '/' + value.slice(5, 9);
                                                        setExperiencia({ ...experiencia, data_inicio: value });
                                                    }}
                                                    placeholder="Data início"
                                                    required
                                                />
                                            </div>
                                            {experiencia.emprego_atual === 'Não' && (
                                                <div className="grid gap-2">
                                                    <Label htmlFor="data_fim">Data fim</Label>
                                                    <Input
                                                        id="data_fim"
                                                        value={experiencia.data_fim ?? ''}
                                                        onChange={(e) => {
                                                            let value = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters
                                                            if (value.length > 2) value = value.slice(0, 2) + '/' + value.slice(2);
                                                            if (value.length > 5) value = value.slice(0, 5) + '/' + value.slice(5, 9);
                                                            setExperiencia({ ...experiencia, data_fim: value });
                                                        }}
                                                        placeholder="Data fim"
                                                    />
                                                </div>
                                            )}
                                        </>
                                    )}
                                    

                                    <div className="flex items-center gap-4">
                                        <Button className="cursor-pointer">Adicionar Experiência Acadêmica e/ou Profissional<Plus /></Button>
                                        <Transition
                                            show={experienceRecentlySuccessful}
                                            enter="transition ease-in-out"
                                            enterFrom="opacity-0"
                                            leave="transition ease-in-out"
                                            leaveTo="opacity-0"
                                        >
                                            <p className="text-sm text-neutral-600">Saved</p>
                                        </Transition>
                                    </div>
                                </form>
                                {/* Bloco de experiências complementares dentro da sanfona principal */}
                                <div className="space-y-6 mt-4">
                                    <div className="inline-block">
                                        <h3 className="text-lg font-medium inline-block">Experiências Complementares</h3>
                                        <hr className="mt-2 h-0.5 bg-[#008DD0]" />
                                        <br/>
                                        <HeadingSmall title="Suas experiências complementares já cadastradas:" />
                                    </div>
                                    {complementaryExperiences.map((experience) => (
                                        <div key={experience.id} className="grid gap-2 border p-4 rounded-md">
                                            <p><strong>Tipo:</strong> {experience.tipo_experiencia}</p>
                                            <p><strong>Titulo:</strong> {experience.titulo}</p>
                                            <p><strong>Instituição:</strong> {experience.instituicao}</p>
                                            <p><strong>Descrição:</strong> {experience.descricao}</p>
                                            {experience.nivel_idioma && <p><strong>Nível:</strong> {experience.nivel_idioma}</p>}
                                            <p><strong>Status:</strong> {experience.status}</p>
                                            <p><strong>Data Início:</strong> {experience.data_inicio}</p>
                                            {experience.data_fim && <p><strong>Data Fim:</strong> {experience.data_fim}</p>}
                                            <div>
                                                <Button onClick={() => deleteComplementary(experience.id)} className='bg-red-500 hover:bg-red-600 cursor-pointer transition-colors duration-200'>Excluir <Trash2 /></Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {/* Formulário de experiência complementar funcional (adaptado do complementary-experience.tsx) */}
                                <form onSubmit={submitComplementary} className="space-y-6 mt-8">
                                    <div className="grid gap-2">
                                        <HeadingSmall title="Adicione seus cursos e/ou idiomas:" />
                                        <Label htmlFor="tipo_experiencia">Tipo experiência</Label>
                                        <Select
                                            value={complementar.tipo_experiencia}
                                            onValueChange={(value) => setComplementar({ ...complementar, tipo_experiencia: value })}
                                            required
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Selecione o tipo de experiência" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Tipos</SelectLabel>
                                                    <SelectItem value="Idioma">Idioma</SelectItem>
                                                    <SelectItem value="Curso">Curso</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    {complementar.tipo_experiencia === 'Idioma' && (
                                        <>
                                            <div className="grid gap-2">
                                                <Label htmlFor="titulo">Titulo</Label>
                                                <Input id="titulo" value={complementar.titulo} onChange={(e) => setComplementar({ ...complementar, titulo: e.target.value })} placeholder="Titulo" />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="instituicao">Instituição</Label>
                                                <Input id="instituicao" value={complementar.instituicao} onChange={(e) => setComplementar({ ...complementar, instituicao: e.target.value })} placeholder="Instituição" />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="descricao">Descrição</Label>
                                                <Input id="descricao" value={complementar.descricao} onChange={(e) => setComplementar({ ...complementar, descricao: e.target.value })} placeholder="Descrição" />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="nivel_idioma">Nível</Label>
                                                <Select value={complementar.nivel_idioma} onValueChange={(value) => setComplementar({ ...complementar, nivel_idioma: value })} required>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Selecione o nivel de idioma" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            <SelectLabel>Tipos</SelectLabel>
                                                            <SelectItem value="Básico">Básico</SelectItem>
                                                            <SelectItem value="Intermediário">Intermediário</SelectItem>
                                                            <SelectItem value="Avançado">Avançado</SelectItem>
                                                            <SelectItem value="Fluente/Nativo">Fluente/Nativo</SelectItem>
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="status">Status</Label>
                                                <Select value={complementar.status} onValueChange={(value) => setComplementar({ ...complementar, status: value })} required>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Selecione o status" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            <SelectLabel>Tipos</SelectLabel>
                                                            <SelectItem value="Cursando">Cursando</SelectItem>
                                                            <SelectItem value="Concluido">Concluido</SelectItem>
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="data_inicio">Data início</Label>
                                                <Input id="data_inicio" value={complementar.data_inicio} onChange={(e) => {
                                                    let value = e.target.value.replace(/\D/g, '');
                                                    if (value.length > 2) value = value.slice(0, 2) + '/' + value.slice(2);
                                                    if (value.length > 5) value = value.slice(0, 5) + '/' + value.slice(5, 9);
                                                    setComplementar({ ...complementar, data_inicio: value });
                                                }} placeholder="Data início" required />
                                            </div>
                                            {complementar.status === 'Concluido' && (
                                                <div className="grid gap-2">
                                                    <Label htmlFor="data_fim">Data fim</Label>
                                                    <Input id="data_fim" value={complementar.data_fim ?? ''} onChange={(e) => {
                                                        let value = e.target.value.replace(/\D/g, '');
                                                        if (value.length > 2) value = value.slice(0, 2) + '/' + value.slice(2);
                                                        if (value.length > 5) value = value.slice(0, 5) + '/' + value.slice(5, 9);
                                                        setComplementar({ ...complementar, data_fim: value });
                                                    }} placeholder="Data fim" />
                                                </div>
                                            )}
                                        </>
                                    )}
                                    {complementar.tipo_experiencia === 'Curso' && (
                                        <>
                                            <div className="grid gap-2">
                                                <Label htmlFor="titulo">Titulo</Label>
                                                <Input id="titulo" value={complementar.titulo} onChange={(e) => setComplementar({ ...complementar, titulo: e.target.value })} placeholder="Titulo" />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="instituicao">Instituição</Label>
                                                <Input id="instituicao" value={complementar.instituicao} onChange={(e) => setComplementar({ ...complementar, instituicao: e.target.value })} placeholder="Instituição" />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="descricao">Descrição</Label>
                                                <Input id="descricao" value={complementar.descricao} onChange={(e) => setComplementar({ ...complementar, descricao: e.target.value })} placeholder="Descrição" />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="status">Status</Label>
                                                <Select value={complementar.status} onValueChange={(value) => setComplementar({ ...complementar, status: value })} required>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Selecione o status" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            <SelectLabel>Tipos</SelectLabel>
                                                            <SelectItem value="Cursando">Cursando</SelectItem>
                                                            <SelectItem value="Concluido">Concluido</SelectItem>
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="data_inicio">Data início</Label>
                                                <Input id="data_inicio" value={complementar.data_inicio} onChange={(e) => {
                                                    let value = e.target.value.replace(/\D/g, '');
                                                    if (value.length > 2) value = value.slice(0, 2) + '/' + value.slice(2);
                                                    if (value.length > 5) value = value.slice(0, 5) + '/' + value.slice(5, 9);
                                                    setComplementar({ ...complementar, data_inicio: value });
                                                }} placeholder="Data início" required />
                                            </div>
                                            {complementar.status === 'Concluido' && (
                                                <div className="grid gap-2">
                                                    <Label htmlFor="data_fim">Data fim</Label>
                                                    <Input id="data_fim" value={complementar.data_fim ?? ''} onChange={(e) => {
                                                        let value = e.target.value.replace(/\D/g, '');
                                                        if (value.length > 2) value = value.slice(0, 2) + '/' + value.slice(2);
                                                        if (value.length > 5) value = value.slice(0, 5) + '/' + value.slice(5, 9);
                                                        setComplementar({ ...complementar, data_fim: value });
                                                    }} placeholder="Data fim" />
                                                </div>
                                            )}
                                        </>
                                    )}
                                    <div className="flex items-center gap-4">
                                        <Button className="cursor-pointer">Adicionar Experiência Complementar<Plus /></Button>
                                        <Transition show={complementaryRecentlySuccessful} enter="transition ease-in-out" enterFrom="opacity-0" leave="transition ease-in-out" leaveTo="opacity-0">
                                            <p className="text-sm text-neutral-600">Saved</p>
                                        </Transition>
                                    </div>
                                </form>
                            </>
                        )}
                    </div>
                    {/* Removido bloco duplicado de sanfona complementar */}
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
