import axios from 'axios';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

type Setor = {
    nome: string;
};

export default function EditarCursos() {
    const queryParams = new URLSearchParams(window.location.search);
    const setorId = queryParams.get('id-setor');

    const [setor, setSetor] = useState<Setor>({ nome: '' });

    useEffect(() => {
        const fetchProcess = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/setores/${setorId}`);
                setSetor(response.data)

            } catch (error) {
                alert(error)
                return;
            }
        }
        fetchProcess();
    }, [setorId]);

    const submitSetorUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await axios.put(`http://localhost:8000/api/setores/${setorId}`, setor);
            const data = await response.data;

            if (data.error) {
                alert(`Erro ao cadastrar o curso: ${data.error}`);
                return;
            }

            alert("Setor atualizado com sucesso!");

            window.location.href = `/setores`;
            
        } catch (error) {
            alert(error)
        }
    };


    return (
    <AppLayout>
        <Head title="Editar Curso" />

        <div className="flex h-full max-h-full flex-1 flex-col gap-4 rounded-xl p-4">
            <form onSubmit={submitSetorUpdate} className='space-y-6'>
                <h2 className="text-xl font-">Editar Setor</h2>
                <div className="grid gap-2">
                    <Label htmlFor="nome">Nome</Label>
                    <Input
                        id="nome"
                        value={setor.nome}
                        onChange={(e) => setSetor({ ...setor, nome: e.target.value })}
                        placeholder="Nome"
                    />
                </div>
                <div className="flex flex-row gap-2">
                    <Link href={`/setores`} className="w-full">
                        <Button type="button" variant="secondary">
                            Voltar
                        </Button>
                    </Link>
                    <Button type="submit">
                        Editar Setor
                    </Button>
                </div>
            </form>
        </div>

    </AppLayout>
)};