
import React from 'react'; 
import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

// Este componente seria a segunda etapa do fluxo de recuperação de senha
const ResetPasswordPage = () => {
    const [passwords, setPasswords] = useState({
        newPassword: '',
        confirmPassword: ''
    });
    const [token, setToken] = useState<string | null>(null);
    const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    
    const navigate = useNavigate();
    const params = useParams<{ token?: string }>();

    // Função para validar o token (seria implementada no hook de autenticação)
    const validateToken = async (token: string): Promise<boolean> => {
        // Simulação da chamada à API
        return new Promise((resolve) => {
        setTimeout(() => {
            // Em um cenário real, verificaria se o token é válido na API
            resolve(true);
        }, 500);
        });
    };

    // Função para redefinir a senha (seria implementada no hook de autenticação)
    const resetPassword = async (token: string, newPassword: string): Promise<void> => {
        // Simulação da chamada à API
        return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Em um cenário real, enviaria o token e a nova senha para a API
            if (newPassword.length >= 6) {
            resolve();
            } else {
            reject(new Error('A senha deve ter pelo menos 6 caracteres'));
            }
        }, 800);
        });
    };

    // Verificar o token quando o componente for montado
    useEffect(() => {
        const tokenFromUrl = params.token || new URLSearchParams(window.location.search).get('token');
        
        if (tokenFromUrl) {
        setToken(tokenFromUrl);
        
        // Validar o token
        validateToken(tokenFromUrl)
            .then(isValid => {
            setIsTokenValid(isValid);
            if (!isValid) {
                setError('O link de recuperação é inválido ou expirou.');
            }
            })
            .catch(() => {
            setIsTokenValid(false);
            setError('Não foi possível validar o link de recuperação.');
            });
        } else {
        setIsTokenValid(false);
        setError('Link de recuperação inválido. Solicite um novo link.');
        }
    }, [params.token]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswords(prev => ({ ...prev, [name]: value }));
    };

    const validatePasswords = (): boolean => {
        // Validar senha
        if (passwords.newPassword.length < 6) {
        setError('A senha deve ter pelo menos 6 caracteres');
        return false;
        }

        // Validar confirmação de senha
        if (passwords.newPassword !== passwords.confirmPassword) {
        setError('As senhas não coincidem');
        return false;
        }

        return true;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        
        // Validar senhas
        if (!validatePasswords()) {
        return;
        }
        
        // Verificar se temos um token válido
        if (!token || !isTokenValid) {
        setError('Link de recuperação inválido. Solicite um novo link.');
        return;
        }
        
        try {
        setIsLoading(true);
        setError(null);
        
        // Chamar a função para redefinir a senha
        await resetPassword(token, passwords.newPassword);
        
        // Mostrar mensagem de sucesso
        setIsSuccess(true);
        
        // Redirecionar para a página de login após alguns segundos
        setTimeout(() => {
            navigate('/login', { 
            state: { message: 'Senha redefinida com sucesso! Faça login com sua nova senha.' } 
            });
        }, 3000);
        } catch (err) {
        console.error('Erro ao redefinir senha:', err);
        setError(err instanceof Error 
            ? err.message 
            : 'Ocorreu um erro ao redefinir sua senha. Por favor, tente novamente.');
        } finally {
        setIsLoading(false);
        }
    };

    // Se estiver carregando ou verificando o token
    if (isTokenValid === null) {
        return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
            <div className="animate-pulse text-gray-600">
                Verificando link de recuperação...
            </div>
            </div>
        </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-8 sm:px-10">
            <div className="mb-6 text-center">
                <h2 className="text-3xl font-extrabold text-gray-900">
                Redefinir senha
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                {isSuccess 
                    ? 'Sua senha foi redefinida com sucesso!' 
                    : 'Crie uma nova senha para sua conta'}
                </p>
            </div>
            
            {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md border border-red-200">
                {error}
                </div>
            )}
            
            {isSuccess ? (
                <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md border border-green-200">
                <div className="flex">
                    <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    </div>
                    <div className="ml-3">
                    <p className="text-sm font-medium text-green-800">
                        Senha redefinida com sucesso! Redirecionando para a página de login...
                    </p>
                    </div>
                </div>
                </div>
            ) : isTokenValid ? (
                <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                    <label 
                    htmlFor="newPassword" 
                    className="block text-sm font-medium text-gray-700"
                    >
                    Nova senha
                    </label>
                    <div className="mt-1">
                    <input
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        autoComplete="new-password"
                        required
                        value={passwords.newPassword}
                        onChange={handleChange}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Mínimo 6 caracteres"
                    />
                    </div>
                </div>

                <div>
                    <label 
                    htmlFor="confirmPassword" 
                    className="block text-sm font-medium text-gray-700"
                    >
                    Confirmar nova senha
                    </label>
                    <div className="mt-1">
                    <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        autoComplete="new-password"
                        required
                        value={passwords.confirmPassword}
                        onChange={handleChange}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Digite a senha novamente"
                    />
                    </div>
                </div>

                <div>
                    <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-75"
                    >
                    {isLoading ? 'Processando...' : 'Redefinir senha'}
                    </button>
                </div>
                </form>
            ) : (
                <div className="text-center">
                <p className="text-sm text-gray-700 mb-4">
                    O link de recuperação é inválido ou expirou. Por favor, solicite um novo link.
                </p>
                <Link 
                    to="/recuperar-senha" 
                    className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Solicitar novo link
                </Link>
                </div>
            )}
            
            <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                    Voltar para login
                </Link>
                </p>
            </div>
            </div>
        </div>
        </div>
    );
};

export default ResetPasswordPage;