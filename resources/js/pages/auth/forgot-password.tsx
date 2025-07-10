import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { LoaderCircle, AtSign, ArrowLeft } from 'lucide-react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm<Required<{ email: string }>>({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <>
            <Head title="Redefinir senha" />

            <div className="min-h-screen bg-[#008DD0] flex items-center justify-center px-4">
                <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md">
                    <div className="mb-6 flex flex-col items-center gap-2">
                        <TextLink href={route('login')} className="flex items-center text-sm text-black no-underline self-start">
                            <ArrowLeft size={16} className="mr-1" />
                            Voltar 
                        </TextLink>

                        <img src="/PORTO_IMBITUBA_Colorida.png" alt="Logo" className="w-40 h-auto self-start" />
                        <h1 className="text-2xl text-black mt-2 self-start">Redefinir senha</h1>
                        <p className="text-sm text-muted-foreground text-left self-start">
                            Insira o endereço de e-mail verificado da sua conta de usuário e lhe enviaremos um link para redefinir sua senha.
                        </p>
                    </div>

                    <form onSubmit={submit} className="flex flex-col gap-6">
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
                                    name="email"
                                    autoComplete="off"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="Endereço de email"
                                    className="w-full pl-10 pr-4 py-2 border-transparent rounded-md focus:outline-none focus:border focus:border-gray-500 bg-gray-200 text-black"
                                />
                            </div>
                            <InputError message={errors.email} />
                        </div>

                        <Button
                            type="submit"
                            className="mt-2 w-full bg-[#008DD0] hover:bg-[#145F7F] text-white"
                            disabled={processing}
                        >
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                            Enviar link
                        </Button>

                        {status && (
                            <div className="mt-4 text-center text-sm font-medium text-green-600">
                                {status}
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </>
    );
}
