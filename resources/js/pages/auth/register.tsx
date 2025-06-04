import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, LogIn , ALargeSmall, AtSign, Lock, ArrowLeft} from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

type RegisterForm = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
};

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm<Required<RegisterForm>>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
           <Head title="Cadastre-se" />
            
            <div className="min-h-screen bg-[#008DD0] flex items-center justify-center px-4">
                    <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md">
                        <div className="mb-6 flex flex-col items-center gap-2">
                            <TextLink href={route('login')} className="flex items-center text-sm text-black no-underline self-start">
                                <ArrowLeft size={16} className="mr-1" />
                                    Voltar
                            </TextLink>
                    
                            <img src="/PORTO_IMBITUBA_Colorida.png" alt="Logo" className="w-40 h-auto self-start" />
                            <h1 className="text-2xl text-black mt-2 self-start">Cadastre-se</h1>
                        </div>
                        <form className="flex flex-col gap-6" onSubmit={submit}>
                            <div className="grid gap-6">
                                <div className="grid gap-2">
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-black pointer-events-none">
                                            <ALargeSmall size="16"/>
                                        </span>

                                        <input
                                            id="name"
                                            type="text"
                                            required
                                            autoFocus
                                            tabIndex={1}
                                            autoComplete="name"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            disabled={processing}
                                            placeholder="Nome completo"
                                            className="w-full pl-10 pr-4 py-2 border-transparent rounded-md focus:outline-none focus:border focus:border-gray-500 bg-gray-200 text-black"
                                        />
                                    </div>
                                    <InputError message={errors.name} className="mt-2" />
                                </div>

                                <div className="grid gap-2">
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-black pointer-events-none">
                                            <AtSign size="16"/>
                                        </span>

                                        <input
                                            id="email"
                                            type="email"
                                            required
                                            tabIndex={2}
                                            autoComplete="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            disabled={processing}
                                            placeholder="Endereço de email"
                                            className="w-full pl-10 pr-4 py-2 border-transparent rounded-md focus:outline-none focus:border focus:border-gray-500 bg-gray-200 text-black"
                                        />
                                    </div>
                                    <InputError message={errors.email} />
                                </div>

                                <div className="grid gap-2">
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-black pointer-events-none">
                                        <Lock size="16"/>
                                        </span>
                                        <input
                                        id="password"
                                        type="password"
                                        required
                                        tabIndex={3}
                                        autoComplete="new-password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        disabled={processing}
                                        placeholder="Senha"
                                        className="w-full pl-10 pr-4 py-2 border-transparent rounded-md focus:outline-none focus:border focus:border-gray-500 bg-gray-200 text-black"
                                        />
                                    </div>
                                    <InputError message={errors.password} />
                                </div>


                                <div className="grid gap-2">
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-black pointer-events-none">
                                        <Lock size="16"/>
                                        </span>
                                        <input
                                        id="password_confirmation"
                                        type="password"
                                        required
                                        tabIndex={4}
                                        autoComplete="new-password"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        disabled={processing}
                                        placeholder="Confirmar senha"
                                        className="w-full pl-10 pr-4 py-2 border-transparent rounded-md focus:outline-none focus:border focus:border-gray-500 bg-gray-200 text-black"
                                        />
                                    </div>
                                    <InputError message={errors.password_confirmation} />
                                </div>


                                <Button type="submit" className="mt-2 w-full  bg-[#008DD0] hover:bg-[#145F7F] text-white" tabIndex={5} disabled={processing}>
                                    {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                    Cadastrar
                                    <LogIn size="16"/>
                                </Button>
                            </div>

                            <hr className="mt-1 mb-1 w-full bg-[#008DD0] h-0.5" />

                            <div className="text-center text-sm text-black">
                                Já possui uma conta?{' '}
                                <TextLink href={route('login')} tabIndex={6} className="text-[#008DD0] no-underline">
                                    Login
                                </TextLink>
                            </div>
                        </form>
                    </div> 
            </div>  

        </>
    );
}
