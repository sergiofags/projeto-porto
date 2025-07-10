import axios from 'axios';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

type Curso = {
    nome: string;
};

export default function EditarCursos() {
    const queryParams = new URLSearchParams(window.location.search);
    const cursoId = queryParams.get('id-curso');
    const setorId = queryParams.get('id-setor');

    const [curso, setCurso] = useState<Curso>({ nome: '' });

    useEffect(() => {
        const fetchProcess = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/courses/${cursoId}`);
                setCurso(response.data)

            } catch (error) {
                alert(error)
                return;
            }
        }

        fetchProcess();

    }, [cursoId]);

    const submitCursoUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await axios.put(`http://localhost:8000/api/courses/${cursoId}/update`, curso);
            const data = await response.data;

            if (data.error) {
                return data.error;
            }

            alert("Curso atualizado com sucesso!");

            window.location.href = `/setores/cursos?id-setor=${setorId}`;

        } catch (error) {
            return error;
        }
    };


    return (
    <AppLayout>
        <Head title="Editar Curso" />

        <div className="flex h-full max-h-full flex-1 flex-col gap-4 rounded-xl p-4">
            <form onSubmit={submitCursoUpdate} className='space-y-6'>
                <h2 className="text-xl font-">Editar Curso</h2>
                <div className="grid gap-2">
                    <Label htmlFor="nome">Nome</Label>
                    <Input
                        id="nome"
                        value={curso.nome}
                        onChange={(e) => setCurso({ ...curso, nome: e.target.value })}
                        placeholder="Nome"
                    />
                </div>
                <div className="flex flex-row gap-2">
                    <Link href={`/setores/cursos?id-setor=${setorId}`} className="w-full">
                        <Button type="button" variant="secondary">
                            Voltar
                        </Button>
                    </Link>
                    <Button type="submit">
                        Editar Curso
                    </Button>
                </div>
            </form>
        </div>

    </AppLayout>
)};