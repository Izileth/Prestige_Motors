import React from 'react'; 
import { useState} from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useUser';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [senha, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { signIn} = useAuth(); // Adicionei auth para debug
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        
        if (!email || !senha) {
            setError('Todos os campos são obrigatórios');
            return;
        }
        
        try {
            setIsLoading(true);
            setError(null);
            
            await signIn({ email, senha});
            
            // Redirecionamento condicional baseado no papel do usuário
            navigate('/dashboard'); 
        } catch (err) {
            console.error('Erro detalhado:', err);
            setError(
                err instanceof Error ? 
                    err.message :
                'Credenciais inválidas ou erro de conexão'
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-8 sm:px-10">
            <div className="mb-6 text-center">
                <h2 className="text-3xl font-extrabold text-gray-900">
                Acessar sua conta
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                E-commerce de veículos premium para você
                </p>
            </div>
            
            {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md border border-red-200">
                {error}
                </div>
            )}
            
            <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                <label 
                    htmlFor="email" 
                    className="block text-sm font-medium text-gray-700"
                >
                    E-mail
                </label>
                <div className="mt-1">
                    <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="seu@email.com"
                    />
                </div>
                </div>

                <div>
                <label 
                    htmlFor="password" 
                    className="block text-sm font-medium text-gray-700"
                >
                    Senha
                </label>
                <div className="mt-1">
                    <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={senha}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="••••••••"
                    />
                </div>
                </div>

                <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <input
                    id="remember_me"
                    name="remember_me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-900">
                    Lembrar-me
                    </label>
                </div>

                <div className="text-sm">
                    <Link to="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                    Esqueceu sua senha?
                    </Link>
                </div>
                </div>

                <div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-75"
                >
                    {isLoading ? 'Entrando...' : 'Entrar'}
                </button>
                </div>
            </form>

            <div className="mt-6">
                <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">
                    Ou continue com
                    </span>
                </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                <div>
                    <button
                    type="button"
                    className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                    <span className="sr-only">Entrar com Google</span>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
                    </svg>
                    </button>
                </div>

                <div>
                    <button
                    type="button"
                    className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                    <span className="sr-only">Entrar com Facebook</span>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z" clipRule="evenodd" />
                    </svg>
                    </button>
                </div>
                </div>
            </div>
            
            <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                Não tem uma conta?{' '}
                <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
                    Cadastre-se
                </Link>
                </p>
            </div>
            </div>
        </div>
        </div>
    );
};

export default LoginPage;