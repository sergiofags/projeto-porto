import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { LoaderCircle, LogIn , AtSign, Lock, ArrowRight} from 'lucide-react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { Card } from '@/components/ui/card';

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
        <AuthLayout title="Login" description="">
                <form className="flex flex-col gap-6" onSubmit={submit}>
                    <div className="grid gap-6">
                        <div className="grid gap-2">
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 pointer-events-none">
                                <AtSign size="16"/>
                                </span>
                                <Input
                                id="email"
                                type="email"
                                required
                                autoFocus
                                tabIndex={1}
                                autoComplete="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="Endereço de email"
                                className="pl-10"
                                />
                            </div>
                            <InputError message={errors.email} />
                        </div>


                        <div className="grid gap-2">
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 pointer-events-none">
                                <Lock size="16"/>
                                </span>
                                <Input
                                id="password"
                                type="password"
                                required
                                tabIndex={2}
                                autoComplete="current-password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="Senha"
                                className="pl-10"
                                />
                            </div>
                            <InputError message={errors.password} />
                        </div>

                        <div className="flex items-center">
                                {canResetPassword && (
                                    <TextLink href={route('password.request')} className="ml-auto text-sm" tabIndex={5}>
                                        Esqueci minha senha
                                    </TextLink>
                                )}
                            </div>

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

                        <Button type="submit" className="mt-4 w-full" tabIndex={4} disabled={processing}>
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Entrar
                            <LogIn />
                        </Button>
                    </div>

                    <div className="text-muted-foreground text-center text-sm">
                        Não possui uma conta?{' '}
                        <TextLink href={route('register')} tabIndex={5}>
                            Cadastre-se
                        </TextLink>
                    </div>
                </form>
            

            {status && <div className="mb-4 text-center text-sm font-medium text-green-600">{status}</div>}
        </AuthLayout>
        </>
    );
}
