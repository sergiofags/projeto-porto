// Components
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, AtSign } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm<Required<{ email: string }>>({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <AuthLayout title="Redefinir sua senha" description="Insira o endereço de e-mail verificado da sua conta de usuário e lhe enviaremos um link para redefinir sua senha.">
            <Head title="Redefinir senha" />

            {status && <div className="mb-4 text-center text-sm font-medium text-green-600">{status}</div>}

            <div className="space-y-6">
                <form onSubmit={submit}>
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
                                name="email"
                                autoComplete="off"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="Endereço de email"
                                className="pl-10"
                            />

                            <InputError message={errors.email} />
                        </div>
                    </div>

                    <div className="my-6 flex items-center justify-start">
                        <Button className="w-full" disabled={processing}>
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Enviar link
                        </Button>
                    </div>
                </form>

                <div className="text-muted-foreground space-x-1 text-center text-sm">
                    <TextLink href={route('login')}>Voltar ao login</TextLink>
                </div>
            </div>
        </AuthLayout>
    );
}
