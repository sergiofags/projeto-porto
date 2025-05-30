import axios from 'axios';
import { SharedData, type BreadcrumbItem } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, usePage } from '@inertiajs/react';
import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { Plus, Trash2 } from 'lucide-react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { FormEventHandler, useState, useEffect } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Experiências Complementares',
        href: '/settings/complementary-experience',
    },
];

export default function ComplementaryExperience() {
    const { auth } = usePage<SharedData>().props;
    const personId = auth.user.id;

    const [experiencia, setExperiencia] = useState({
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

    const [experienceRecentlySuccessful, setExperienceRecentlySuccessful] = useState(false);

    const submitExperience: FormEventHandler = async (e) => {
        e.preventDefault();

        if (experiencia.data_fim === '') {
            setExperiencia({ ...experiencia, data_fim: null });
        }

        try {
            const experienciaFormatada = {
                ...experiencia,
                data_fim: experiencia.status !== 'Concluido' ? null : experiencia.data_fim || null,
              };

            const response = await fetch(`http://localhost:8000/api/person/${personId}/complementaryexperience`, {
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
        const fetchExperiences = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/person/${personId}/complementaryexperience`);
                setExperiences(response.data);
            } catch (error) {
                console.error('Error fetching experiences:', error);
            }
        };

        fetchExperiences();
    }, [auth.user.id]);


    const deleteExperience = async (id: string) => {
            try {
                await axios.delete(`http://localhost:8000/api/person/${personId}/complementaryexperience/${id}`);

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
                    <HeadingSmall title="Experiências Complementares" description="Adicione seus idiomas e cursos" />

                    <div className="space-y-6">
                        {experiences.map((experience) => (
                            <>
                                <div key={experience.id} className="grid gap-2 border p-4 rounded-md">
                                    

                                    {experience.tipo_experiencia === 'Idioma' && (
                                        <div>
                                            <p><strong>Tipo:</strong> {experience.tipo_experiencia}</p>
                                            
                                            <p><strong>Titulo:</strong> {experience.titulo}</p>
                                            <p><strong>Instituição:</strong> {experience.instituicao}</p>
                                            <p><strong>Descrição:</strong> {experience.descricao}</p>
                                            <p><strong>Nivel:</strong> {experience.nivel_idioma}</p>
                                            <p><strong>Status:</strong> {experience.status}</p>
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

                                    {experience.tipo_experiencia === 'Curso' && (
                                        <div>
                                            <p><strong>Tipo:</strong> {experience.tipo_experiencia}</p>
                                            <p><strong>Titulo:</strong> {experience.titulo}</p>
                                            <p><strong>Instituição:</strong> {experience.instituicao}</p>
                                            <p><strong>Descrição:</strong> {experience.descricao}</p>
                                            <p><strong>Status:</strong> {experience.status}</p>
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
                                        <SelectItem value="Idioma">Idioma</SelectItem>
                                        <SelectItem value="Curso">Curso</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        
                        {experiencia.tipo_experiencia === 'Idioma' && (
                            <>
                                <div className="grid gap-2">
                                    <Label htmlFor="titulo">Titulo</Label>
                                    <Input
                                        id="titulo"
                                        value={experiencia.titulo}
                                        onChange={(e) => setExperiencia({ ...experiencia, titulo: e.target.value })}
                                        placeholder="Titulo"
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="instituicao">Instituição</Label>
                                    <Input
                                        id="instituicao"
                                        value={experiencia.instituicao}
                                        onChange={(e) => setExperiencia({ ...experiencia, instituicao: e.target.value })}
                                        placeholder="Instituição"
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="descricao">Descrição</Label>
                                    <Input
                                        id="descricao"
                                        value={experiencia.descricao}
                                        onChange={(e) => setExperiencia({ ...experiencia, descricao: e.target.value })}
                                        placeholder="Descrição"
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="nivel_idioma">Nível</Label>
                                    <Select
                                        value={experiencia.nivel_idioma}
                                        onValueChange={(value) => setExperiencia({ ...experiencia, nivel_idioma: value })}
                                        required
                                    >
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
                                                <SelectLabel>Tipos</SelectLabel>
                                                <SelectItem value="Cursando">Cursando</SelectItem>
                                                <SelectItem value="Concluido">Concluido</SelectItem>
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

                                {experiencia.status === 'Concluido' && (
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

                        {experiencia.tipo_experiencia === 'Curso' && (
                            <>
                                <div className="grid gap-2">
                                    <Label htmlFor="titulo">Titulo</Label>
                                    <Input
                                        id="titulo"
                                        value={experiencia.titulo}
                                        onChange={(e) => setExperiencia({ ...experiencia, titulo: e.target.value })}
                                        placeholder="Titulo"
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="instituicao">Instituição</Label>
                                    <Input
                                        id="instituicao"
                                        value={experiencia.instituicao}
                                        onChange={(e) => setExperiencia({ ...experiencia, instituicao: e.target.value })}
                                        placeholder="Instituição"
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="descricao">Descrição</Label>
                                    <Input
                                        id="descricao"
                                        value={experiencia.descricao}
                                        onChange={(e) => setExperiencia({ ...experiencia, descricao: e.target.value })}
                                        placeholder="Descrição"
                                    />
                                </div>

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
                                                <SelectLabel>Tipos</SelectLabel>
                                                <SelectItem value="Cursando">Cursando</SelectItem>
                                                <SelectItem value="Concluido">Concluido</SelectItem>
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

                                {experiencia.status === 'Concluido' && (
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
