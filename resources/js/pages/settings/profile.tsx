import axios from 'axios';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
// import SettingsLayout from '@/layouts/settings/layout';
import { ChevronDown, ChevronUp, Save } from 'lucide-react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { useEffect } from 'react';
import { Trash2, Plus } from '@/components/ui/icons';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profile settings',
        href: '/settings/profile',
    },
];

type ProfileForm = {
    name: string;
    email: string;
    tipo_perfil: string;
}

export default function Profile({ mustVerifyEmail, status }: { mustVerifyEmail: boolean; status?: string }) {
    const { auth } = usePage<SharedData>().props;

    const [pessoaData, setPessoaData] = useState({
        id_user: auth.user.id,
        cpf: '',
        data_nascimento: '',
        telefone: '',
        cep: '',
        rua: '',
        numero: '',
        bairro: '',
        cidade: '',
        estado: '',
        complemento: '',
        referencia: '',
        genero: '',
        linkedin: '',
        instagram: '',
        facebook: '',
        twitter: '',
        sobre: '',
        servico_militar: '',
        deficiencia: '',
        qual_deficiencia: '',
        estou_ciente: 'false',
    });

    useEffect(() => {
        const fetchPessoaData = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/person/${auth.user.id}`);
                setPessoaData(response.data);
            } catch (error: unknown) {
                if (error instanceof Error && error.message === 'Erro ao acessar o banco de dados.') {
                    alert('Erro ao acessar o banco de dados.');
                } else if (error instanceof Error && error.message === 'Erro interno no servidor.') {
                    alert('Erro interno no servidor.');
                } if (axios.isAxiosError(error) && error.response && error.response.status === 404) {
                    alert('Pessoa não encontrada. Por favor, verifique o id.');
                }
            }
        };

        fetchPessoaData();
    }, [auth.user.id]);

    const [pessoaProcessing, setPessoaProcessing] = useState(false);
    const [pessoaRecentlySuccessful, setPessoaRecentlySuccessful] = useState(false);

    const setPessoaDataField = (field: string, value: string) => {
        setPessoaData((prevData) => ({
            ...prevData,
            [field]: value,
        }));
    };

    const submitPessoa: FormEventHandler = async (e) => {
        e.preventDefault();
        setPessoaProcessing(true);
        try {
            const checkResponse = await axios.get(`http://localhost:8000/api/person/${pessoaData.id_user}`);
            if (checkResponse.data) {
                const updateResponse = await axios.put(`http://localhost:8000/api/person/${pessoaData.id_user}`, pessoaData);
                console.log("Updated successfully:", updateResponse.data);
                setPessoaRecentlySuccessful(true);
                setTimeout(() => setPessoaRecentlySuccessful(false), 3000);
            }
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response && error.response.status === 404) {
                try {
                    const createResponse = await axios.post("http://localhost:8000/api/person", pessoaData);
                    console.log("Created successfully:", createResponse.data);
                    setPessoaRecentlySuccessful(true);
                    setTimeout(() => setPessoaRecentlySuccessful(false), 3000);
                } catch (createError: unknown) {
                    console.error("Error creating data:", createError);
                    if (axios.isAxiosError(createError) && createError.response && createError.response.data && createError.response.data.errors) {
                        alert(`Error creating data: ${JSON.stringify(createError.response.data.errors)}`);
                    }
                }
            } else {
                console.error("Error checking data:", error);
                if (axios.isAxiosError(error) && error.response && error.response.data && error.response.data.errors) {
                    alert(`Error checking data: ${JSON.stringify(error.response.data.errors)}`);
                }
            }
        } finally {
            setPessoaProcessing(false);
        }
    };

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm<Required<ProfileForm>>({
        name: auth.user.name,
        email: auth.user.email,
        tipo_perfil: auth.user.tipo_perfil as string,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        patch(route('profile.update'), {
            preserveScroll: true,
        });
    };

    const handleCepChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value.replace(/\D/g, ''); // Remove non-numeric characters
        if (value.length > 5) {
            setPessoaDataField('cep', value.slice(0, 5) + '-' + value.slice(5, 8)); // Format as 88780-000
        } else {
            setPessoaDataField('cep', value);
        }

        if (value.length === 8) { // Trigger search when the CEP is fully entered
            try {
                const response = await fetch(`https://viacep.com.br/ws/${value}/json/`);
                if (!response.ok) {
                    throw new Error('Failed to fetch address data');
                }
                const data = await response.json();
                if (data.erro) {
                    throw new Error('CEP not found');
                }
                setPessoaDataField('estado', data.uf);
                setPessoaDataField('cidade', data.localidade);
            } catch (err) {
                console.error('Error fetching address data:', err);
            }
        }
    };

    const [abertoInformacoes, setAbertoInformacoes] = useState(false);
    const [abertoSobre, setAbertoSobre] = useState(false);

    // --- ESTADOS E FUNÇÕES DE EXPERIÊNCIAS (direto de experience.tsx, sem conflito de nomes) ---
    const [expForm, setExpForm] = useState({
        id_person: auth.user.id,
        tipo_experiencia: '',
        empresa_instituicao: '',
        nivel: '',
        status: '',
        curso_cargo: '',
        atividades: '',
        semestre_modulo: '',
        data_inicio: '',
        data_fim: '',
        emprego_atual: 'Não',
    });
    const [experienceRecentlySuccessful, setExpRecentlySuccessful] = useState(false);
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
                const response = await axios.get(`http://localhost:8000/api/person/${auth.user.id}/experience`);
                setExperiences(response.data);
            } catch (error) {
                console.error('Error fetching experiences:', error);
            }
        };
        fetchExperiences();
    }, [auth.user.id]);
    const submitExperience: FormEventHandler = async (e) => {
        e.preventDefault();
        if (expForm.data_fim === '') {
            setExpForm({ ...expForm, data_fim: null });
        }
        try {
            const experienciaFormatada = {
                ...expForm,
                data_fim: expForm.status !== 'Formado' ? null : expForm.data_fim || null,
            };
            const response = await fetch(`http://localhost:8000/api/person/${auth.user.id}/experience`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(experienciaFormatada),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Erro desconhecido');
            setExpRecentlySuccessful(true);
            setTimeout(() => {
                setExpRecentlySuccessful(false);
                setExperiences((prev) => [...prev, data]);
            }, 3000);
        } catch (error) {
            alert(error instanceof Error ? error.message : 'Erro desconhecido');
        }
    };
    const deleteExperience = async (id: string) => {
        try {
            await axios.delete(`http://localhost:8000/api/person/${auth.user.id}/experience/${id}`);
            setExperiences((prev) => prev.filter((exp) => exp.id !== id));
        } catch (error) {
            console.error('Error deleting experience:', error);
        }
    };
    // Complementary Experience State
    const [complementar, setComplementar] = useState({
        id_person: auth.user.id,
        tipo_experiencia: '',
        titulo: '',
        descricao: '',
        nivel_idioma: '',
        certificado: '', // Inicializar como string vazia
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
        certificado?: string, // Ajustar para string
        data_inicio?: string,
        data_fim?: string | null,
        instituicao: string,
        status: string,
    }>>([]);
    useEffect(() => {
        const fetchComplementary = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/person/${auth.user.id}/complementaryexperience`);
                setComplementaryExperiences(response.data);
            } catch (error) {
                console.error('Error fetching complementary experiences:', error);
            }
        };
        fetchComplementary();
    }, [auth.user.id]);
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
            const response = await fetch(`http://localhost:8000/api/person/${auth.user.id}/complementaryexperience`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(compFormatada),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Erro desconhecido');
            setComplementaryRecentlySuccessful(true);
            setTimeout(() => {
                setComplementaryRecentlySuccessful(false);
                setComplementaryExperiences((prev) => [...prev, data]);
            }, 3000);
        } catch (error) {
            alert(error instanceof Error ? error.message : 'Erro desconhecido');
        }
    };
    const deleteComplementary = async (id: string) => {
        try {
            await axios.delete(`http://localhost:8000/api/person/${auth.user.id}/complementaryexperience/${id}`);
            setComplementaryExperiences((prev) => prev.filter((exp) => exp.id !== id));
        } catch (error) {
            console.error('Error deleting complementary experience:', error);
        }
    };

    const [abertoFormulario, setAbertoFormulario] = useState(false);
    

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />
            <div className="space-y-6">
                <br/>
                    <div className="border border-blue-300 rounded-xl p-3">
                        <div
                            className="flex justify-between items-center cursor-pointer"
                            onClick={() => setAbertoInformacoes(!abertoInformacoes)}>
                            <div className="inline-block">
                                <h2 className="text-lg font-medium inline-block">Informações Pessoais</h2>
                            </div>
                            {abertoInformacoes ? <ChevronUp /> : <ChevronDown />}
                        </div>

                        {abertoInformacoes && (
                            <div>
                                <form onSubmit={submit} className="space-y-6">
                                    <div className="grid gap-2">
                                        <br />
                                        <Label htmlFor="name">Nome *</Label>
                                        <Input
                                            id="name"
                                            className="mt-1 block w-full"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            required
                                            autoComplete="name"
                                            placeholder="Full name" />
                                        <InputError className="mt-2" message={errors.name} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Endereço de Email *</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            className="mt-1 block w-full"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            required
                                            autoComplete="username"
                                            placeholder="Email address" />
                                        <InputError className="mt-2" message={errors.email} />
                                    </div>
                                    {mustVerifyEmail && auth.user.email_verified_at === null && (
                                        <div>
                                            <p className="text-muted-foreground -mt-4 text-sm">
                                                Your email address is unverified.{' '}
                                                <Link
                                                    href={route('verification.send')}
                                                    method="post"
                                                    as="button"
                                                    className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                                                >
                                                    Click here to resend the verification email.
                                                </Link>
                                            </p>
                                            {status === 'verification-link-sent' && (
                                                <div className="mt-2 text-sm font-medium text-green-600">
                                                    A new verification link has been sent to your email address.
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    <div className="flex items-center gap-4">
                                        <Button disabled={processing} className='cursor-pointer'>Salvar perfil <Save /></Button>
                                        <Transition
                                            show={recentlySuccessful}
                                            enter="transition ease-in-out"
                                            enterFrom="opacity-0"
                                            leave="transition ease-in-out"
                                            leaveTo="opacity-0"
                                        >
                                            <p className="text-sm text-neutral-600">Saved</p>
                                        </Transition>
                                    </div>
                                </form>
                                <form onSubmit={submitPessoa} className="space-y-6 mt-8">
                                    <div className="grid gap-2">
                                        <HeadingSmall title="Formulário Pessoa" />
                                        <Label htmlFor="cpf">CPF *</Label>
                                        <Input
                                            id="cpf"
                                            className="mt-1 block w-full"
                                            value={pessoaData.cpf}
                                            onChange={(e) => {
                                                let value = e.target.value.replace(/\D/g, '');
                                                if (value.length > 3) value = value.slice(0, 3) + '.' + value.slice(3);
                                                if (value.length > 7) value = value.slice(0, 7) + '.' + value.slice(7);
                                                if (value.length > 11) value = value.slice(0, 11) + '-' + value.slice(11, 13);
                                                setPessoaDataField('cpf', value);
                                            } }
                                            required
                                            autoComplete="cpf"
                                            placeholder="CPF" />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="data_nascimento">Data de Nascimento *</Label>
                                        <Input
                                            id="data_nascimento"
                                            className="mt-1 block w-full"
                                            value={pessoaData.data_nascimento}
                                            onChange={(e) => {
                                                let value = e.target.value.replace(/\D/g, '');
                                                if (value.length > 2) value = value.slice(0, 2) + '/' + value.slice(2);
                                                if (value.length > 5) value = value.slice(0, 5) + '/' + value.slice(5, 9);
                                                setPessoaDataField('data_nascimento', value);
                                            } }
                                            required
                                            autoComplete="data_nascimento"
                                            placeholder="Data de Nascimento" />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="telefone">Telefone *</Label>
                                        <Input
                                            id="telefone"
                                            className="mt-1 block w-full"
                                            value={pessoaData.telefone}
                                            onChange={(e) => {
                                                let value = e.target.value.replace(/\D/g, '');
                                                if (value.length > 2) value = '(' + value.slice(0, 2) + ') ' + value.slice(2);
                                                if (value.length > 7) value = value.slice(0, 10) + '-' + value.slice(10, 14);
                                                setPessoaDataField('telefone', value);
                                            } }
                                            required
                                            autoComplete="telefone"
                                            placeholder="Telefone" />
                                    </div>
                                    <div className="grid gap-2">
                                        <HeadingSmall title="Endereço" />
                                        <Label htmlFor="cep">CEP *</Label>
                                        <Input
                                            id="cep"
                                            className="mt-1 block w-full"
                                            value={pessoaData.cep}
                                            onChange={handleCepChange}
                                            autoComplete="cep"
                                            placeholder="CEP" />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="estado">Estado *</Label>
                                        <Select
                                            value={pessoaData.estado}
                                            onValueChange={(value) => setPessoaDataField('estado', value)}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Selecione o estado" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Estados</SelectLabel>
                                                    <SelectItem value="AC">Acre</SelectItem>
                                                    <SelectItem value="AL">Alagoas</SelectItem>
                                                    <SelectItem value="AP">Amapá</SelectItem>
                                                    <SelectItem value="AM">Amazonas</SelectItem>
                                                    <SelectItem value="BA">Bahia</SelectItem>
                                                    <SelectItem value="CE">Ceará</SelectItem>
                                                    <SelectItem value="DF">Distrito Federal</SelectItem>
                                                    <SelectItem value="ES">Espírito Santo</SelectItem>
                                                    <SelectItem value="GO">Goiás</SelectItem>
                                                    <SelectItem value="MA">Maranhão</SelectItem>
                                                    <SelectItem value="MT">Mato Grosso</SelectItem>
                                                    <SelectItem value="MS">Mato Grosso do Sul</SelectItem>
                                                    <SelectItem value="MG">Minas Gerais</SelectItem>
                                                    <SelectItem value="PA">Pará</SelectItem>
                                                    <SelectItem value="PB">Paraíba</SelectItem>
                                                    <SelectItem value="PR">Paraná</SelectItem>
                                                    <SelectItem value="PE">Pernambuco</SelectItem>
                                                    <SelectItem value="PI">Piauí</SelectItem>
                                                    <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                                                    <SelectItem value="RN">Rio Grande do Norte</SelectItem>
                                                    <SelectItem value="RS">Rio Grande do Sul</SelectItem>
                                                    <SelectItem value="RO">Rondônia</SelectItem>
                                                    <SelectItem value="RR">Roraima</SelectItem>
                                                    <SelectItem value="SC">Santa Catarina</SelectItem>
                                                    <SelectItem value="SP">São Paulo</SelectItem>
                                                    <SelectItem value="SE">Sergipe</SelectItem>
                                                    <SelectItem value="TO">Tocantins</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="cidade">Cidade *</Label>
                                        <Input
                                            id="cidade"
                                            className="mt-1 block w-full"
                                            value={pessoaData.cidade}
                                            onChange={(e) => setPessoaDataField('cidade', e.target.value)}
                                            autoComplete="cidade"
                                            placeholder="Cidade" />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="bairro">Bairro *</Label>
                                        <Input
                                            id="bairro"
                                            className="mt-1 block w-full"
                                            value={pessoaData.bairro}
                                            onChange={(e) => setPessoaDataField('bairro', e.target.value)}
                                            autoComplete="bairro"
                                            placeholder="Bairro" />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="rua">Rua *</Label>
                                        <Input
                                            id="rua"
                                            className="mt-1 block w-full"
                                            value={pessoaData.rua}
                                            onChange={(e) => setPessoaDataField('rua', e.target.value)}
                                            autoComplete="rua"
                                            placeholder="Rua" />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="numero">Número *</Label>
                                        <Input
                                            id="numero"
                                            className="mt-1 block w-full"
                                            value={pessoaData.numero}
                                            onChange={(e) => setPessoaDataField('numero', e.target.value)}
                                            autoComplete="numero"
                                            placeholder="Número" />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="complemento">Complemento</Label>
                                        <Input
                                            id="complemento"
                                            className="mt-1 block w-full"
                                            value={pessoaData.complemento}
                                            onChange={(e) => setPessoaDataField('complemento', e.target.value)}
                                            autoComplete="complemento"
                                            placeholder="Complemento" />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="referencia">Referência</Label>
                                        <Input
                                            id="referencia"
                                            className="mt-1 block w-full"
                                            value={pessoaData.referencia}
                                            onChange={(e) => setPessoaDataField('referencia', e.target.value)}
                                            autoComplete="referencia"
                                            placeholder="Referência" />
                                    </div>
                                    <div className="flex items-center gap-4 mt-4">
                                        <Button disabled={pessoaProcessing} className='cursor-pointer'>Salvar Pessoa <Save /></Button>
                                        <Transition
                                            show={pessoaRecentlySuccessful}
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
                        )}
                    </div>

                    <div className="border border-blue-300 rounded-xl p-3">
                        <div
                            className="flex justify-between items-center cursor-pointer"
                            onClick={() => setAbertoSobre(!abertoSobre)}>
                            <div className="inline-block">
                                <h2 className="text-lg font-medium inline-block">Sobre Você</h2>
                            </div>
                            {abertoSobre ? <ChevronUp /> : <ChevronDown />}
                        </div>

                        {abertoSobre && (
                            <div>
                                <form onSubmit={submitPessoa} className="space-y-6 mt-8">
                                    <div className="grid gap-2">
                                        <HeadingSmall title="Gênero" />
                                        <Label htmlFor="name">Qual o seu gênero? *</Label>
                                        <RadioGroup
                                            value={pessoaData.genero}
                                            required
                                            onValueChange={(value) => setPessoaDataField('genero', value)}
                                        >
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="Masculino" id="genero-masculino" />
                                                <Label htmlFor="genero-masculino">Masculino</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="Feminino" id="genero-feminino" />
                                                <Label htmlFor="genero-feminino">Feminino</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="Outro" id="genero-outro" />
                                                <Label htmlFor="genero-outro">Outro</Label>
                                            </div>
                                        </RadioGroup>
                                    </div>

                                    {['Masculino', 'Outro'].includes(pessoaData.genero) && (
                                        <>
                                            <div className="grid gap-2">
                                                <Label htmlFor="servico-militar">Você tem obrigação legal com o Serviço Militar? *</Label>
                                                <RadioGroup
                                                    value={String(pessoaData.servico_militar)}
                                                    required
                                                    onValueChange={(value) => setPessoaDataField('servico_militar', value)}
                                                >
                                                    <div className="flex items-center space-x-2">
                                                        <RadioGroupItem value="true" id="servico-militar-sim" />
                                                        <Label htmlFor="servico-militar-sim">Sim</Label>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <RadioGroupItem value="false" id="servico-militar-nao" />
                                                        <Label htmlFor="servico-militar-nao">Não</Label>
                                                    </div>
                                                </RadioGroup>
                                            </div>
                                            <div className="grid gap-2">
                                                <div className="flex items-center space-x-2">
                                                    <Checkbox
                                                        required
                                                        id="terms"
                                                        value={pessoaData.estou_ciente === 'true' ? 'true' : 'false'}
                                                        onCheckedChange={(checked) => setPessoaDataField('estou_ciente', checked ? 'true' : 'false')}
                                                    />
                                                    <label
                                                        htmlFor="terms"
                                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                    >
                                                        Estou ciente de que sou o único(a) responsável pela veracidade e precisão das informações fornecidas por mim neste processo seletivo. *
                                                    </label>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                    <div className="grid gap-2">
                                        <HeadingSmall title="Pessoa com deficiência" />
                                        <Label htmlFor="deficiencia">Você possui algum tipo de deficiência? *</Label>
                                        <RadioGroup
                                            value={pessoaData.deficiencia}
                                            onValueChange={(value) => setPessoaDataField('deficiencia', value)}
                                        >
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="true" id="deficiencia-sim"/>
                                                <Label htmlFor="deficiencia-sim">Sim</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="false" id="deficiencia-nao"/>
                                                <Label htmlFor="deficiencia-nao">Não</Label>
                                            </div>
                                        </RadioGroup>
                                    </div>

                                    {pessoaData.deficiencia === 'true' && (
                                        <div className="grid gap-2">
                                            <Label htmlFor="qual_deficiencia">Qual o tipo de deficiência?</Label>
                                            <Input
                                                id="qual_deficiencia"
                                                className="mt-1 block w-full"
                                                value={pessoaData.qual_deficiencia}
                                                onChange={(e) => setPessoaDataField('qual_deficiencia', e.target.value)}
                                                autoComplete="qual_deficiencia"
                                                placeholder="Tipo de deficiência"
                                            />
                                        </div>
                                    )}
                                    <div className="grid gap-2">
                                        <HeadingSmall title="Fale um pouco sobre você" />
                                        <Textarea 
                                            id="sobre"
                                            className="mt-1 block w-full"
                                            value={pessoaData.sobre}
                                            onChange={(e) => setPessoaDataField('sobre', e.target.value)}
                                            autoComplete="sobre"
                                            placeholder="Escreva aqui"
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="linkedin">LinkedIn</Label>
                                        <Input
                                            id="linkedin"
                                            className="mt-1 block w-full"
                                            value={pessoaData.linkedin}
                                            onChange={(e) => setPessoaDataField('linkedin', e.target.value)}
                                            autoComplete="linkedin"
                                            placeholder="LinkedIn"
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="instagram">Instagram</Label>
                                        <Input
                                            id="instagram"
                                            className="mt-1 block w-full"
                                            value={pessoaData.instagram}
                                            onChange={(e) => setPessoaDataField('instagram', e.target.value)}
                                            autoComplete="instagram"
                                            placeholder="Instagram"
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="facebook">Facebook</Label>
                                        <Input
                                            id="facebook"
                                            className="mt-1 block w-full"
                                            value={pessoaData.facebook}
                                            onChange={(e) => setPessoaDataField('facebook', e.target.value)}
                                            autoComplete="facebook"
                                            placeholder="Facebook"
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="twitter">X (Twitter)</Label>
                                        <Input
                                            id="twitter"
                                            className="mt-1 block w-full"
                                            value={pessoaData.twitter}
                                            onChange={(e) => setPessoaDataField('twitter', e.target.value)}
                                            autoComplete="twitter"
                                            placeholder="X (Twitter)"
                                        />
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <Button disabled={pessoaProcessing} className='cursor-pointer'>Salvar Pessoa <Save /></Button>
                                        <Transition
                                            show={pessoaRecentlySuccessful}
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
                        )}
                    </div>

                    {/* --- ACORDEÃO DE EXPERIÊNCIAS (após acordeão Sobre Você) --- */}
                    <div className="border border-blue-300 rounded-xl p-3">
                        <div className="flex justify-between items-center cursor-pointer" onClick={() => setAbertoFormulario(!abertoFormulario)}>
                            <div className="inline-block">
                                <h2 className="text-lg font-medium inline-block">Experiências</h2>
                            </div>
                            {abertoFormulario ? <ChevronUp /> : <ChevronDown />}
                        </div>
                        {abertoFormulario && (
                            <div>
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
                                            value={expForm.tipo_experiencia}
                                            onValueChange={(value) => setExpForm({ ...expForm, tipo_experiencia: value })}
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
                                    
                                    {expForm.tipo_experiencia === 'Acadêmica' && (
                                        <>
                                            <div className="grid gap-2">
                                                <Label htmlFor="status">Status</Label>
                                                <Select
                                                    value={expForm.status}
                                                    onValueChange={(value) => setExpForm({ ...expForm, status: value })}
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
                                                    value={expForm.empresa_instituicao}
                                                    onChange={(e) => setExpForm({ ...expForm, empresa_instituicao: e.target.value })}
                                                    placeholder="Instituição"
                                                />
                                            </div>

                                            <div className="grid gap-2">
                                                <Label htmlFor="nivel">Nivel</Label>
                                                <Select
                                                    value={expForm.nivel}
                                                    onValueChange={(value) => setExpForm({ ...expForm, nivel: value })}
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
                                                    value={expForm.curso_cargo}
                                                    onChange={(e) => setExpForm({ ...expForm, curso_cargo: e.target.value })}
                                                    placeholder="Curso"
                                                />
                                            </div>

                                            <div className="grid gap-2">
                                                <Label htmlFor="atividades">Atividades</Label>
                                                <Textarea
                                                    id="atividades"
                                                    value={expForm.atividades}
                                                    onChange={(e) => setExpForm({ ...expForm, atividades: e.target.value })}
                                                    placeholder="Descreva as atividades realizadas"
                                                />
                                            </div>

                                            <div className="grid gap-2">
                                                <Label htmlFor="semestre_modulo">Semestre/Módulo</Label>
                                                <Input
                                                    id="semestre_modulo"
                                                    value={expForm.semestre_modulo}
                                                    onChange={(e) => setExpForm({ ...expForm, semestre_modulo: e.target.value })}
                                                    placeholder="Semestre ou Módulo"
                                                />
                                            </div>

                                            <div className="grid gap-2">
                                                <Label htmlFor="data_inicio">Data início</Label>
                                                <Input
                                                    id="data_inicio"
                                                    value={expForm.data_inicio}
                                                    onChange={(e) => {
                                                        let value = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters
                                                        if (value.length > 2) value = value.slice(0, 2) + '/' + value.slice(2);
                                                        if (value.length > 5) value = value.slice(0, 5) + '/' + value.slice(5, 9);
                                                        setExpForm({ ...expForm, data_inicio: value });
                                                    }}
                                                    placeholder="Data início"
                                                    required
                                                />
                                            </div>

                                            {expForm.status === 'Formado' && (
                                                <div className="grid gap-2">
                                                    <Label htmlFor="data_fim">Data fim</Label>
                                                    <Input
                                                        id="data_fim"
                                                        value={expForm.data_fim ?? ''}
                                                        onChange={(e) => {
                                                            let value = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters
                                                            if (value.length > 2) value = value.slice(0, 2) + '/' + value.slice(2);
                                                            if (value.length > 5) value = value.slice(0, 5) + '/' + value.slice(5, 9);
                                                            setExpForm({ ...expForm, data_fim: value });
                                                        }}
                                                        placeholder="Data fim"
                                                    />
                                                </div>
                                            )}
                                        </>
                                    )}

                                    {expForm.tipo_experiencia === 'Profissional' && (
                                        <>
                                            <div className="grid gap-2">
                                                <Label htmlFor="empresa_instituicao">Empresa</Label>
                                                <Input
                                                    id="empresa_instituicao"
                                                    value={expForm.empresa_instituicao}
                                                    onChange={(e) => setExpForm({ ...expForm, empresa_instituicao: e.target.value })}
                                                    placeholder="Empresa"
                                                />
                                            </div>

                                            <div className="grid gap-2">
                                                <Label htmlFor="curso_cargo">Cargo</Label>
                                                <Input
                                                    id="curso_cargo"
                                                    value={expForm.curso_cargo}
                                                    onChange={(e) => setExpForm({ ...expForm, curso_cargo: e.target.value })}
                                                    placeholder="Cargo"
                                                />
                                            </div>

                                            <div className="grid gap-2">
                                                <Label htmlFor="atividades">Atividades</Label>
                                                <Textarea
                                                    id="atividades"
                                                    value={expForm.atividades}
                                                    onChange={(e) => setExpForm({ ...expForm, atividades: e.target.value })}
                                                    placeholder="Descreva as atividades realizadas"
                                                />
                                            </div>

                                            <div className="grid gap-2">
                                                <Label htmlFor="emprego_atual">Emprego Atual</Label>
                                                <Select
                                                    value={expForm.emprego_atual}
                                                    onValueChange={(value) => setExpForm({ ...expForm, emprego_atual: value })}
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
                                                    value={expForm.data_inicio}
                                                    onChange={(e) => {
                                                        let value = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters
                                                        if (value.length > 2) value = value.slice(0, 2) + '/' + value.slice(2);
                                                        if (value.length > 5) value = value.slice(0, 5) + '/' + value.slice(5, 9);
                                                        setExpForm({ ...expForm, data_inicio: value });
                                                    }}
                                                    placeholder="Data início"
                                                    required
                                                />
                                            </div>
                                            {expForm.emprego_atual === 'Não' && (
                                                <div className="grid gap-2">
                                                    <Label htmlFor="data_fim">Data fim</Label>
                                                    <Input
                                                        id="data_fim"
                                                        value={expForm.data_fim ?? ''}
                                                        onChange={(e) => {
                                                            let value = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters
                                                            if (value.length > 2) value = value.slice(0, 2) + '/' + value.slice(2);
                                                            if (value.length > 5) value = value.slice(0, 5) + '/' + value.slice(5, 9);
                                                            setExpForm({ ...expForm, data_fim: value });
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
                            </div>
                        )}
                    </div>
                </div>
        </AppLayout>
    );
}
