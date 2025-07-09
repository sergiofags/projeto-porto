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
import SettingsLayout from '@/layouts/settings/layout';
import { Save, FileText, MapPin, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { candidacyEventBus, type CandidacyEventData } from '@/utils/candidacy-events';

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

interface Candidacy {
    id: number;
    status: 'Cancelado' | 'Analise' | 'Completo';
    data_candidatura: string;
    id_person: number;
    id_vacancy: number;
    id_process: number;
    interview?: {
        id: number;
        status: string;
        data_hora: string;
        localizacao?: string;
    };
    vacancy?: {
        id: number;
        titulo: string;
        descricao: string;
        local: string;
        data_inicio: string;
        data_fim: string;
        salario: number;
        tipo_contrato: string;
        carga_horaria: string;
        nivel: string;
        processo?: {
            id: number;
            titulo: string;
            status: string;
        };
    };
}

export default function Profile({ mustVerifyEmail, status }: { mustVerifyEmail: boolean; status?: string }) {
    const { auth } = usePage<SharedData>().props;
    const [candidaciesModalOpen, setCandidaciesModalOpen] = useState(false);
    
    // Estados para candidaturas
    const [candidacies, setCandidacies] = useState<Candidacy[]>([]);
    const [candidaciesLoading, setCandidaciesLoading] = useState(false);
    const [cancelModal, setCancelModal] = useState<{ open: boolean; candidacy: Candidacy | null; loading: boolean; error: string | null }>({
        open: false,
        candidacy: null,
        loading: false,
        error: null
    });

    // Carregar candidaturas quando o modal for aberto
    useEffect(() => {
        if (candidaciesModalOpen && auth.user.tipo_perfil === 'Candidato') {
            const loadCandidacies = async () => {
                try {
                    setCandidaciesLoading(true);
                    console.log('Carregando candidaturas para usuário ID:', auth.user.id);
                    const response = await axios.get(`http://localhost:8000/api/person/${auth.user.id}/candidacy`);
                    console.log('Resposta da API de candidaturas:', response.data);
                    
                    const candidaciesWithDetails = await Promise.all(
                        (response.data || []).map(async (candidacy: Candidacy) => {
                            try {
                                console.log('Processando candidatura:', candidacy);
                                const [vacancyRes, processRes, interviewRes] = await Promise.all([
                                    axios.get(`http://localhost:8000/api/process/${candidacy.id_process}/vacancy/${candidacy.id_vacancy}`),
                                    axios.get(`http://localhost:8000/api/process/${candidacy.id_process}`),
                                    axios.get(`http://localhost:8000/api/candidacy/${candidacy.id}/interview`).catch(() => null)
                                ]);
                                
                                return {
                                    ...candidacy,
                                    vacancy: { ...vacancyRes.data, processo: processRes.data },
                                    interview: interviewRes?.data || null
                                };
                            } catch {
                                return candidacy;
                            }
                        })
                    );
                    
                    console.log('Candidaturas processadas:', candidaciesWithDetails);
                    setCandidacies(candidaciesWithDetails);
                    
                } catch (error) {
                    console.error('Erro ao carregar candidaturas:', error);
                    setCandidacies([]);
                } finally {
                    setCandidaciesLoading(false);
                }
            };

            loadCandidacies();
        }
    }, [candidaciesModalOpen, auth.user.tipo_perfil, auth.user.id]);

    // Verificar se a candidatura do modal ainda existe
    useEffect(() => {
        if (cancelModal.open && cancelModal.candidacy) {
            const candidacyStillExists = candidacies.find(c => c.id === cancelModal.candidacy?.id);
            if (!candidacyStillExists && candidacies.length > 0) {
                setCancelModal({ open: false, candidacy: null, loading: false, error: null });
            }
        }
    }, [candidacies, cancelModal.open, cancelModal.candidacy]);

    // Listener para sincronização de candidaturas entre páginas
    useEffect(() => {
        const unsubscribe = candidacyEventBus.on((eventData: CandidacyEventData) => {
            console.log('Evento de candidatura recebido:', eventData);
            
            // Se uma candidatura foi cancelada em outra página, atualizar nossa lista
            if (eventData.action === 'cancelled' && eventData.userId === auth.user.id) {
                setCandidacies(prev => prev.filter(c => c.id !== eventData.candidacyId));
                
                // Se o modal de cancelamento está aberto para esta candidatura, fechá-lo
                if (cancelModal.open && cancelModal.candidacy?.id === eventData.candidacyId) {
                    setCancelModal({ open: false, candidacy: null, loading: false, error: null });
                }
            }
            
            // Se uma candidatura foi criada em outra página, recarregar a lista se o modal estiver aberto
            if (eventData.action === 'created' && eventData.userId === auth.user.id && candidaciesModalOpen) {
                // Recarregar candidaturas se o modal estiver aberto
                const loadCandidacies = async () => {
                    try {
                        setCandidaciesLoading(true);
                        const response = await axios.get(`http://localhost:8000/api/person/${auth.user.id}/candidacy`);
                        
                        const candidaciesWithDetails = await Promise.all(
                            (response.data || []).map(async (candidacy: Candidacy) => {
                                try {
                                    const [vacancyRes, processRes, interviewRes] = await Promise.all([
                                        axios.get(`http://localhost:8000/api/process/${candidacy.id_process}/vacancy/${candidacy.id_vacancy}`),
                                        axios.get(`http://localhost:8000/api/process/${candidacy.id_process}`),
                                        axios.get(`http://localhost:8000/api/candidacy/${candidacy.id}/interview`).catch(() => null)
                                    ]);
                                    
                                    return {
                                        ...candidacy,
                                        vacancy: { ...vacancyRes.data, processo: processRes.data },
                                        interview: interviewRes?.data || null
                                    };
                                } catch {
                                    return candidacy;
                                }
                            })
                        );
                        
                        setCandidacies(candidaciesWithDetails);
                    } catch (error) {
                        console.error('Erro ao recarregar candidaturas:', error);
                    } finally {
                        setCandidaciesLoading(false);
                    }
                };
                
                loadCandidacies();
            }
        });

        return unsubscribe; // Cleanup quando o componente for desmontado
    }, [auth.user.id, candidaciesModalOpen, cancelModal.open, cancelModal.candidacy]);

    const abrirModalCancelamento = (candidacy: Candidacy) => {
        setCancelModal({ open: true, candidacy, loading: false, error: null });
    };

    const handleCancel = async () => {
        if (!cancelModal.candidacy || !auth.user.id) {
            setCancelModal(prev => ({ ...prev, error: 'Não foi possível identificar a candidatura para cancelamento.' }));
            return;
        }

        try {
            setCancelModal(prev => ({ ...prev, loading: true, error: null }));
            
            const candidacyId = cancelModal.candidacy.id;
            const userId = auth.user.id;
            const url = `http://localhost:8000/api/person/${userId}/candidacy/${candidacyId}`;

            console.log('Tentando cancelar candidatura:', {
                candidacyId,
                userId,
                url,
                candidacy: cancelModal.candidacy
            });

            // Primeiro verificar se a candidatura ainda existe
            const checkResponse = await axios.get(`http://localhost:8000/api/person/${userId}/candidacy`);
            const currentCandidacies = checkResponse.data || [];
            const candidacyExists = currentCandidacies.find((c: Candidacy) => c.id === candidacyId);
            
            if (!candidacyExists) {
                setCancelModal(prev => ({ 
                    ...prev, 
                    loading: false, 
                    error: 'Esta candidatura já foi cancelada ou não existe mais.' 
                }));
                
                // Atualizar a lista de candidaturas
                const candidaciesWithDetails = await Promise.all(
                    currentCandidacies.map(async (candidacy: Candidacy) => {
                        try {
                            const [vacancyRes, processRes, interviewRes] = await Promise.all([
                                axios.get(`http://localhost:8000/api/process/${candidacy.id_process}/vacancy/${candidacy.id_vacancy}`),
                                axios.get(`http://localhost:8000/api/process/${candidacy.id_process}`),
                                axios.get(`http://localhost:8000/api/candidacy/${candidacy.id}/interview`).catch(() => null)
                            ]);
                            
                            return {
                                ...candidacy,
                                vacancy: { ...vacancyRes.data, processo: processRes.data },
                                interview: interviewRes?.data || null
                            };
                        } catch {
                            return candidacy;
                        }
                    })
                );
                
                setCandidacies(candidaciesWithDetails);
                return;
            }

            const response = await axios.delete(url, {
                timeout: 10000,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                }
            });
            
            console.log('Resposta do cancelamento:', response.status, response.data);
            
            if (response.status === 200) {
                // Recarregar a lista de candidaturas
                try {
                    console.log('Recarregando candidaturas após cancelamento...');
                    const refreshResponse = await axios.get(`http://localhost:8000/api/person/${userId}/candidacy`);
                    console.log('Candidaturas recarregadas:', refreshResponse.data);
                    
                    const refreshedCandidacies = await Promise.all(
                        (refreshResponse.data || []).map(async (candidacy: Candidacy) => {
                            try {
                                const [vacancyRes, processRes, interviewRes] = await Promise.all([
                                    axios.get(`http://localhost:8000/api/process/${candidacy.id_process}/vacancy/${candidacy.id_vacancy}`),
                                    axios.get(`http://localhost:8000/api/process/${candidacy.id_process}`),
                                    axios.get(`http://localhost:8000/api/candidacy/${candidacy.id}/interview`).catch(() => null)
                                ]);
                                
                                return {
                                    ...candidacy,
                                    vacancy: { ...vacancyRes.data, processo: processRes.data },
                                    interview: interviewRes?.data || null
                                };
                            } catch {
                                return candidacy;
                            }
                        })
                    );
                    
                    setCandidacies(refreshedCandidacies);
                } catch (refreshError) {
                    console.error('Erro ao recarregar candidaturas:', refreshError);
                    setCandidacies(prev => prev.filter(c => c.id !== cancelModal.candidacy?.id));
                }
                
                setCancelModal(prev => ({ 
                    ...prev, 
                    loading: false, 
                    error: null,
                    candidacy: prev.candidacy ? { ...prev.candidacy, status: 'Cancelado' as const } : null
                }));

                // Emitir evento para sincronizar com outras páginas
                candidacyEventBus.emit({
                    candidacyId,
                    userId,
                    action: 'cancelled',
                    timestamp: Date.now()
                });
            }
        } catch (error) {
            console.error('Erro ao cancelar candidatura:', error);
            
            let errorMessage = 'Erro ao cancelar candidatura';
            
            if (axios.isAxiosError(error)) {
                console.log('Detalhes do erro:', {
                    status: error.response?.status,
                    statusText: error.response?.statusText,
                    data: error.response?.data,
                    code: error.code,
                    message: error.message
                });

                if (error.code === 'ECONNABORTED') {
                    errorMessage = 'Timeout: A requisição demorou muito para responder';
                } else if (error.code === 'ERR_NETWORK') {
                    errorMessage = 'Erro de rede: Verifique sua conexão';
                } else if (error.code === 'ERR_EMPTY_RESPONSE') {
                    errorMessage = 'Servidor retornou resposta vazia. Tente novamente.';
                } else if (error.response?.status) {
                    errorMessage = error.response.data?.message || `Erro ${error.response.status}: ${error.response.statusText || 'Erro no servidor'}`;
                    
                    if (error.response.status === 404) {
                        errorMessage = 'Candidatura não encontrada. Pode ter sido cancelada anteriormente.';
                    }
                } else {
                    errorMessage = `Erro de conexão: ${error.message}`;
                }
            } else if (error instanceof Error) {
                errorMessage = `Erro inesperado: ${error.message}`;
            }
            
            setCancelModal(prev => ({ ...prev, loading: false, error: errorMessage }));
        }
    };

    const getStatusBadge = (status: string) => {
        const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = { 
            Completo: 'default', 
            Analise: 'secondary', 
            Cancelado: 'destructive' 
        };
        const icons: Record<string, React.ReactElement> = { 
            Completo: <CheckCircle className="h-4 w-4" />, 
            Analise: <AlertCircle className="h-4 w-4" />, 
            Cancelado: <X className="h-4 w-4" /> 
        };

        return (
            <Badge variant={variants[status] || 'outline'} className="flex items-center gap-1">
                {icons[status]}
                {status}
            </Badge>
        );
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return 'Data não informada';
        const date = new Date(dateString);
        if (isNaN(date.getTime()) || date.getFullYear() < 1970) {
            return 'Data não informada';
        }
        return date.toLocaleDateString('pt-BR');
    };

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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />

            <SettingsLayout>
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <HeadingSmall title="Informações do Perfil" description={data.tipo_perfil} />
                        
                        {/* Botão Minhas Candidaturas - apenas para candidatos */}
                        {auth.user.tipo_perfil === 'Candidato' && (
                            <Button
                                variant="outline"
                                className="flex items-center gap-2"
                                onClick={() => {
                                    // Limpar candidaturas antes de abrir o modal para forçar reload
                                    setCandidacies([]);
                                    setCandidaciesLoading(false);
                                    // Fechar qualquer modal de cancelamento aberto
                                    setCancelModal({ open: false, candidacy: null, loading: false, error: null });
                                    setCandidaciesModalOpen(true);
                                }}
                            >
                                <FileText className="h-4 w-4" />
                                Minhas Candidaturas
                            </Button>
                        )}
                    </div>

                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Nome *</Label>

                            <Input
                                id="name"
                                className="mt-1 block w-full"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                                autoComplete="name"
                                placeholder="Full name"
                            />

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
                                placeholder="Email address"
                            />

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

                    <form onSubmit={submitPessoa} className="space-y-6">
                        <HeadingSmall title="Formulário Pessoa" />

                        <div className="grid gap-2">
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
                                    setPessoaDataField('cpf', value); // Changed to setPessoaDataField
                                }}
                                required
                                autoComplete="cpf"
                                placeholder="CPF"
                            />

                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="data_nascimento">Data de Nascimento *</Label>

                            <Input
                                id="data_nascimento"
                                className="mt-1 block w-full"
                                value={pessoaData.data_nascimento}
                                onChange={(e) => {
                                    let value = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters
                                    if (value.length > 2) value = value.slice(0, 2) + '/' + value.slice(2);
                                    if (value.length > 5) value = value.slice(0, 5) + '/' + value.slice(5, 9);
                                    setPessoaDataField('data_nascimento', value); // Changed to setPessoaDataField
                                }}
                                required
                                autoComplete="data_nascimento"
                                placeholder="Data de Nascimento"
                            />

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
                                    setPessoaDataField('telefone', value); // Changed to setPessoaDataField
                                }}
                                required 
                                autoComplete="telefone"
                                placeholder="Telefone"
                            />

                        </div>

                        <HeadingSmall title="Endereço" />

                        <div className="grid gap-2">
                            <Label htmlFor="cep">CEP</Label>

                            <Input
                                id="cep"
                                className="mt-1 block w-full"
                                value={pessoaData.cep}
                                onChange={handleCepChange} // Use the handleCepChange function
                                autoComplete="cep"
                                placeholder="CEP"
                            />

                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="estado">Estado</Label>

                            <Select
                                value={pessoaData.estado}
                                onValueChange={(value) => setPessoaDataField('estado', value)} // Changed to setPessoaDataField
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
                            <Label htmlFor="cidade">Cidade</Label>

                            <Input
                                id="cidade"
                                className="mt-1 block w-full"
                                value={pessoaData.cidade}
                                onChange={(e) => setPessoaDataField('cidade', e.target.value)} // Changed to setPessoaDataField
                                autoComplete="cidade"
                                placeholder="Cidade"
                            />

                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="bairro">Bairro</Label>

                            <Input
                                id="bairro"
                                className="mt-1 block w-full"
                                value={pessoaData.bairro}
                                onChange={(e) => setPessoaDataField('bairro', e.target.value)} // Changed to setPessoaDataField
                                autoComplete="bairro"
                                placeholder="Bairro"
                            />

                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="rua">Rua</Label>

                            <Input
                                id="rua"
                                className="mt-1 block w-full"
                                value={pessoaData.rua}
                                onChange={(e) => setPessoaDataField('rua', e.target.value)} // Changed to setPessoaDataField
                                autoComplete="rua"
                                placeholder="Rua"
                            />

                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="numero">Número</Label>

                            <Input
                                id="numero"
                                className="mt-1 block w-full"
                                value={pessoaData.numero}
                                onChange={(e) => setPessoaDataField('numero', e.target.value)} // Changed to setPessoaDataField
                                autoComplete="numero"
                                placeholder="Número"
                            />

                        </div>
                        
                        <div className="grid gap-2">
                            <Label htmlFor="complemento">Complemento</Label>

                            <Input
                                id="complemento"
                                className="mt-1 block w-full"
                                value={pessoaData.complemento}
                                onChange={(e) => setPessoaDataField('complemento', e.target.value)} // Changed to setPessoaDataField
                                autoComplete="complemento"
                                placeholder="Complemento"
                            />

                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="referencia">Referência</Label>

                            <Input
                                id="referencia"
                                className="mt-1 block w-full"
                                value={pessoaData.referencia}
                                onChange={(e) => setPessoaDataField('referencia', e.target.value)} // Changed to setPessoaDataField
                                autoComplete="referencia"
                                placeholder="Referência"
                            />

                        </div>

                        <HeadingSmall title="Sobre você" />
                        <HeadingSmall title="Gênero *" />

                        <div className="grid gap-2">
                            
                            <RadioGroup
                                value={pessoaData.genero}
                                required
                                onValueChange={(value) => setPessoaDataField('genero', value)} // Changed to setPessoaDataField
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
                                        onValueChange={(value) => setPessoaDataField('servico_militar', value)} // Changed to setPessoaDataField
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

                        <HeadingSmall title="Pessoa com deficiência" />

                        <div className="grid gap-2">
                            <Label htmlFor="deficiencia">Você possui algum tipo de deficiência?</Label>
                                
                            <RadioGroup
                                value={pessoaData.deficiencia}
                                onValueChange={(value) => setPessoaDataField('deficiencia', value)} // Directly set the value
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
                                    onChange={(e) => setPessoaDataField('qual_deficiencia', e.target.value)} // Changed to setPessoaDataField
                                    autoComplete="qual_deficiencia"
                                    placeholder="Tipo de deficiência"
                                />

                            </div>
                        )}

                        <HeadingSmall title="Fale um pouco sobre você" />

                        <div className="grid gap-2">
                            <Textarea 
                                id="sobre"
                                className="mt-1 block w-full"
                                value={pessoaData.sobre}
                                onChange={(e) => setPessoaDataField('sobre', e.target.value)} // Changed to setPessoaDataField
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
                                onChange={(e) => setPessoaDataField('linkedin', e.target.value)} // Changed to setPessoaDataField
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
                                onChange={(e) => setPessoaDataField('instagram', e.target.value)} // Changed to setPessoaDataField
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
                                onChange={(e) => setPessoaDataField('facebook', e.target.value)} // Changed to setPessoaDataField
                                autoComplete="facebook"
                                placeholder="Facebook"
                            />

                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="twitter">X</Label>

                            <Input
                                id="twitter"
                                className="mt-1 block w-full"
                                value={pessoaData.twitter}
                                onChange={(e) => setPessoaDataField('twitter', e.target.value)} // Changed to setPessoaDataField
                                autoComplete="twitter"
                                placeholder="X"
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
            </SettingsLayout>

            {/* Modal de Candidaturas */}
            {auth.user.tipo_perfil === 'Candidato' && (
                <Dialog 
                    open={candidaciesModalOpen} 
                    onOpenChange={(open) => {
                        setCandidaciesModalOpen(open);
                        if (!open) {
                            // Limpar dados quando fechar o modal
                            setCandidacies([]);
                            setCancelModal({ open: false, candidacy: null, loading: false, error: null });
                        }
                    }}
                >
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Minhas Candidaturas</DialogTitle>
                            <DialogDescription>
                                Gerencie suas candidaturas a vagas
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <Badge variant="outline">{candidacies.length} candidatura(s)</Badge>
                            </div>

                            {candidaciesLoading ? (
                                <div className="animate-pulse space-y-4">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="h-48 bg-gray-200 rounded"></div>
                                    ))}
                                </div>
                            ) : candidacies.length === 0 ? (
                                <Alert>
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>Nenhuma candidatura encontrada</AlertTitle>
                                    <AlertDescription>
                                        Você ainda não se candidatou a nenhuma vaga.
                                    </AlertDescription>
                                </Alert>
                            ) : (
                                candidacies.map((candidacy) => (
                                    <Card key={candidacy.id}>
                                        <CardHeader>
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <CardTitle>{candidacy.vacancy?.titulo || 'Vaga não encontrada'}</CardTitle>
                                                    <div className="flex items-center gap-2 mt-2">
                                                        {getStatusBadge(candidacy.status)}
                                                        <span className="text-sm text-muted-foreground">
                                                            {formatDate(candidacy.data_candidatura)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardHeader>

                                        <CardContent className="space-y-4">
                                            {candidacy.vacancy && (
                                                <div className="grid md:grid-cols-2 gap-4 text-sm">
                                                    <div className="space-y-2">
                                                        <div><strong>Carga Horária:</strong> {candidacy.vacancy.carga_horaria}</div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Informações da Entrevista */}
                                            <div className="bg-blue-50 p-4 rounded-lg">
                                                <h4 className="font-semibold text-sm mb-2">Status da Entrevista:</h4>
                                                <div className="flex items-center gap-2 mb-2">
                                                    {candidacy.interview && candidacy.interview.status === 'Agendada' ? (
                                                        <>
                                                            <Badge variant="default">
                                                                Agendada
                                                            </Badge>
                                                            {candidacy.interview.data_hora && (
                                                                <span className="text-sm text-blue-700">
                                                                    {formatDate(candidacy.interview.data_hora)} às {new Date(candidacy.interview.data_hora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                                                </span>
                                                            )}
                                                        </>
                                                    ) : (
                                                        <Badge variant="secondary">
                                                            Em análise
                                                        </Badge>
                                                    )}
                                                </div>
                                                {candidacy.interview && candidacy.interview.localizacao && candidacy.interview.status === 'Agendada' && (
                                                    <div className="flex items-center gap-2 text-sm text-blue-700">
                                                        <MapPin className="h-4 w-4" />
                                                        <span>Local: {candidacy.interview.localizacao}</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex gap-2">
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => abrirModalCancelamento(candidacy)}
                                                    disabled={candidacy.status === 'Cancelado'}
                                                >
                                                    <X className="h-4 w-4 mr-2" />
                                                    Cancelar Candidatura
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </div>
                    </DialogContent>
                </Dialog>
            )}

            {/* Modal de Cancelamento */}
            <Dialog open={cancelModal.open} onOpenChange={() => setCancelModal(prev => ({ ...prev, open: false }))}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {cancelModal.error ? 'Erro ao cancelar' : 
                             !cancelModal.candidacy || cancelModal.candidacy.status === 'Cancelado' ? 
                             'Candidatura cancelada com sucesso!' : 'Confirmar cancelamento'}
                        </DialogTitle>
                        <DialogDescription>
                            {cancelModal.error ? 
                                cancelModal.error :
                                !cancelModal.candidacy || cancelModal.candidacy.status === 'Cancelado' ?
                                'Sua candidatura foi cancelada. Agora você pode se candidatar a outra vaga.' :
                                `Deseja cancelar sua candidatura para "${cancelModal.candidacy?.vacancy?.titulo}"? Esta ação não pode ser desfeita.`
                            }
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end gap-2">
                        <Button 
                            variant="outline" 
                            onClick={() => setCancelModal(prev => ({ ...prev, open: false }))}
                            disabled={cancelModal.loading}
                        >
                            {cancelModal.error ? 'Fechar' : 
                             !cancelModal.candidacy || cancelModal.candidacy.status === 'Cancelado' ? 'Entendido' : 'Não, manter'}
                        </Button>
                        {!cancelModal.error && cancelModal.candidacy && cancelModal.candidacy.status !== 'Cancelado' && (
                            <Button 
                                variant="destructive" 
                                onClick={handleCancel}
                                disabled={cancelModal.loading}
                            >
                                {cancelModal.loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                                Sim, cancelar
                            </Button>
                        )}
                        {cancelModal.error && (
                            <Button 
                                variant="destructive" 
                                onClick={handleCancel}
                                disabled={cancelModal.loading}
                            >
                                {cancelModal.loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                                Tentar novamente
                            </Button>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </AppLayout>
        
    );
}
