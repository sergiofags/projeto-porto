import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { LoaderCircle, LogIn, AtSign, Lock, ArrowLeft } from 'lucide-react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
};

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Login" />

            <div className="min-h-screen bg-[#008DD0] flex items-center justify-center px-4">
                <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md">
                    <div className="mb-6 flex flex-col items-center gap-2">
                        <TextLink href={route('register')} className="flex items-center text-sm text-black no-underline self-start">
                            <ArrowLeft size={16} className="mr-1" />
                            Voltar
                        </TextLink>

                        <img src="/PORTO_IMBITUBA_Colorida.png" alt="Logo" className="w-40 h-auto self-start" />
                        <h1 className="text-2xl text-black mt-2 self-start">Login</h1>
                    </div>

                    <form className="flex flex-col gap-6" onSubmit={submit}>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-black pointer-events-none">
                                        <AtSign size="16" />
                                    </span>
                                    <input
                                        id="email"
                                        type="email"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="Endereço de email"
                                        className="w-full pl-10 pr-4 py-2 border-transparent rounded-md focus:outline-none focus:border focus:border-gray-500 bg-gray-200 text-black"
                                    />
                                </div>
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-black pointer-events-none">
                                        <Lock size="16" />
                                    </span>
                                    <input
                                        id="password"
                                        type="password"
                                        required
                                        tabIndex={2}
                                        autoComplete="current-password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="Senha"
                                        className="w-full pl-10 pr-4 py-2 border-transparent rounded-md focus:outline-none focus:border focus:border-gray-500 bg-gray-200 text-black"
                                    />
                                </div>
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex items-center justify-between w-full">
                                <div className="flex items-center space-x-3">
                                    <Checkbox
                                        id="remember"
                                        name="remember"
                                        checked={data.remember}
                                        onClick={() => setData('remember', !data.remember)}
                                        tabIndex={3}
                                    />
                                    <Label htmlFor="remember">Lembre-me</Label>
                                </div>

                                {canResetPassword && (
                                    <TextLink
                                        href={route('password.request')}
                                        className="text-sm text-[#008DD0] no-underline"
                                        tabIndex={5}
                                    >
                                        Esqueci minha senha
                                    </TextLink>
                                )}
                            </div>

                            <Button
                                type="submit"
                                className="mt-4 w-full bg-[#008DD0] hover:bg-[#145F7F] text-white"
                                tabIndex={4}
                                disabled={processing}
                            >
                                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                Entrar
                                <LogIn />
                            </Button>
                        </div>

                        <div className="text-center text-sm">
                            Não possui uma conta?{' '}
                            <TextLink href={route('register')} tabIndex={5} className="text-[#008DD0] no-underline">
                                Cadastre-se
                            </TextLink>
                        </div>
                    </form>

                    {status && (
                        <div className="mt-4 text-center text-sm font-medium text-green-600">
                            {status}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
