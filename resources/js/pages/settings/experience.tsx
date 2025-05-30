import axios from 'axios';
import { SharedData, type BreadcrumbItem } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, usePage } from '@inertiajs/react';
import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { Plus, Save, Trash2 } from 'lucide-react';
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
        nivel: null, /* <- n sei pra que serve */
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
                body: JSON.stringify(experiencia),
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
    }, [auth.user.id]);


    const deleteExperience = async (id: string) => {
            try {
                await axios.delete(`http://localhost:8000/api/person/${personId}/experience/${id}`);

                setExperiences((prev) => prev.filter((exp) => exp.id !== id));
                
            } catch (error) {
                console.error('Error deleting experience:', error);
            }
        } 

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Experiências" description="Adicione suas experiências profissionais e acadêmicas" />

                    <div className="space-y-6">
                        {experiences.map((experience, index) => (
                            <>
                                <div key={experience.id} className="grid gap-2 border p-4 rounded-md">
                                    

                                    {experience.tipo_experiencia === 'Acadêmica' && (
                                        <div>
                                            <p><strong>Tipo:</strong> {experience.tipo_experiencia}</p>
                                            <p><strong>Status:</strong> {experience.status}</p>
                                            <p><strong>Instituição:</strong> {experience.empresa_instituicao}</p>
                                            <p><strong>Curso:</strong> {experience.curso_cargo}</p>
                                            <p><strong>Atividades:</strong> {experience.atividades}</p>
                                            <p><strong>Semestre/Módulo:</strong> {experience.semestre_modulo}</p>
                                            <p><strong>Data Início:</strong> {experience.data_inicio}</p>
                                            {experience.data_fim && <p><strong>Data Fim:</strong> {experience.data_fim}</p>}
                                            <div>
                                                <Button 
                                                    onClick={() => deleteExperience(experience.id)}
                                                    className='bg-red-500 cursor-pointer'
                                                >
                                                    Excluir <Trash2 />
                                                </Button>
                                            </div>
                                        </div>
                                    )}

                                    {experience.tipo_experiencia === 'Profissional' && (
                                        <div>
                                            <p><strong>Tipo:</strong> {experience.tipo_experiencia}</p>
                                            <p><strong>Empresa</strong> {experience.empresa_instituicao}</p>
                                            <p><strong>Cargo</strong> {experience.curso_cargo}</p>
                                            <p><strong>Atividades:</strong> {experience.atividades}</p>
                                            <p><strong>Data Início:</strong> {experience.data_inicio}</p>
                                            {experience.data_fim && <p><strong>Data Fim:</strong> {experience.data_fim}</p>}
                                            <p><strong>Emprego Atual:</strong> {experience.emprego_atual}</p>
                                            <div>
                                                <Button 
                                                    onClick={() => deleteExperience(experience.id)}
                                                    className='bg-red-500 cursor-pointer'
                                                >
                                                    Excluir <Trash2 />
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                
                            </>
                        ))}
                    </div>

                    <form onSubmit={submitExperience} className="space-y-6">
                        <div className="grid gap-2">
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
                                    <>
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
                                    </>
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
                            <Button className="cursor-pointer">Adicionar Experiência <Plus /></Button>
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
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
