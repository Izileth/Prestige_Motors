import React from 'react'; 

import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { FormEvent } from 'react';

// Este componente precisaria de uma função adicional em seu hook de autenticação
// para o envio do email de recuperação de senha
const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Esta função seria implementada no seu hook de autenticação
    const requestPasswordReset = async (email: string): Promise<void> => {
        // Simulação da chamada à API
        return new Promise((resolve, reject) => {
        // Em um cenário real, você chamaria sua API aqui
        setTimeout(() => {
            // Validar email básico para simular
            if (email && email.includes('@')) {
            resolve();
            } else {
            reject(new Error('E-mail inválido'));
            }
        }, 800);
        });
    };

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        
        // Validação básica
        if (!validateEmail(email)) {
        setError('Por favor, insira um endereço de e-mail válido.');
        return;
        }
        
        try {
        setIsLoading(true);
        setError(null);
        
        // Chamar a função de recuperação de senha
        await requestPasswordReset(email);
        
        // Mostrar mensagem de sucesso
        setIsSubmitted(true);
        } catch (err) {
        console.error('Erro ao solicitar recuperação de senha:', err);
        setError(err instanceof Error 
            ? err.message 
            : 'Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente.');
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
                Recuperar senha
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                {!isSubmitted 
                    ? 'Informe seu e-mail para receber instruções de recuperação' 
                    : 'Enviamos instruções para o seu e-mail'}
                </p>
            </div>
            
            {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md border border-red-200">
                {error}
                </div>
            )}
            
            {!isSubmitted ? (
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
                    <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-75"
                    >
                    {isLoading ? 'Enviando...' : 'Enviar instruções'}
                    </button>
                </div>
                </form>
            ) : (
                <div className="mt-6 space-y-6">
                <div className="p-4 bg-green-50 text-green-700 rounded-md border border-green-200">
                    <div className="flex">
                    <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-green-800">E-mail enviado com sucesso!</h3>
                        <div className="mt-2 text-sm text-green-700">
                        <p>
                            Enviamos um link de recuperação para {email}. Por favor, verifique sua caixa de entrada e siga as instruções para redefinir sua senha.
                        </p>
                        </div>
                    </div>
                    </div>
                </div>
                
                <div className="text-center">
                    <button
                    onClick={() => {
                        setEmail('');
                        setIsSubmitted(false);
                    }}
                    className="inline-flex text-sm font-medium text-blue-600 hover:text-blue-500"
                    >
                    Tentar com outro e-mail
                    </button>
                </div>
                </div>
            )}
            
            <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                Lembrou sua senha?{' '}
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

export default ForgotPasswordPage;