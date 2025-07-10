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

export default function CadastrarSetor() {
    const [setor, setSetor] = useState<Setor>({ nome: '' });

    useEffect(() => {
        
    });

    const submitSetor = async (e: React.FormEvent) => {
            e.preventDefault();

            try {
                const response = await axios.post(`http://localhost:8000/api/setores`, setor);
                const data = await response.data;
    
                if (data.error) {
                    alert(`Erro ao cadastrar o curso: ${data.error}`);
                    return;
                }
    
                alert("Setor cadastrado com sucesso!");

                window.location.href = `/setores`;

            } catch (error) {
                alert(error)
            }
        };

    return (
    <AppLayout>
        <Head title="Cadastrar Curso" />
        <div className="flex h-full max-h-full flex-1 flex-col gap-4 rounded-xl p-4">
            <form onSubmit={submitSetor} className='space-y-6'>
                <h2 className="text-xl font-">Cadastre o Setor</h2>
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
                        Cadastrar Setor
                    </Button>
                </div>
            </form>
        </div>
            
    </AppLayout>
)};