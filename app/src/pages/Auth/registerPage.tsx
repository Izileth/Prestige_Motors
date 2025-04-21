import React from 'react'; 
import { useState} from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useUser';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        acceptTerms: false
    });
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    
    const { signUp } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
        }));
    };

    const validateForm = () => {
        // Validar nome
        if (!formData.name.trim()) {
        return 'Nome completo é obrigatório';
        }

        // Validar email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
        return 'Email inválido';
        }

        // Validar senha
        if (formData.password.length < 6) {
        return 'A senha deve ter pelo menos 6 caracteres';
        }

        // Validar confirmação de senha
        if (formData.password !== formData.confirmPassword) {
        return 'As senhas não coincidem';
        }

        // Validar telefone (opcional)
        if (formData.phone && !/^\d{10,11}$/.test(formData.phone.replace(/\D/g, ''))) {
        return 'Telefone inválido. Informe DDD + número';
        }

        // Validar termos
        if (!formData.acceptTerms) {
        return 'Você precisa aceitar os termos de uso';
        }

        return null;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        
        // Validar formulário
        const validationError = validateForm();
        if (validationError) {
        setError(validationError);
        return;
        }
        
        try {
        setIsLoading(true);
        setError(null);
        
        // Chamar o método de registro do hook
        await signUp({
            nome: formData.name,
            email: formData.email,
            senha: formData.password,
            telefone: formData.phone
        });
        
        
        // Redirecionar para a página de login ou dashboard após cadastro bem-sucedido
        navigate('/login', { state: { message: 'Cadastro realizado com sucesso! Faça login para continuar.' } });
        } catch (err) {
        console.error('Erro ao cadastrar:', err);
        setError(err instanceof Error 
            ? err.message 
            : 'Ocorreu um erro ao criar sua conta. Por favor, tente novamente.');
        } finally {
        setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-8 sm:px-10">
            <div className="mb-6 text-center">
                <h2 className="text-3xl font-extrabold text-gray-900">
                Criar nova conta
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                Cadastre-se para acessar o melhor do e-commerce de veículos
                </p>
            </div>
            
            {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md border border-red-200">
                {error}
                </div>
            )}
            
            <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Nome completo
                </label>
                <div className="mt-1">
                    <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Seu nome completo"
                    />
                </div>
                </div>

                <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    E-mail
                </label>
                <div className="mt-1">
                    <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="seu@email.com"
                    />
                </div>
                </div>

                <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Senha
                </label>
                <div className="mt-1">
                    <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Mínimo 6 caracteres"
                    />
                </div>
                </div>

                <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirmar senha
                </label>
                <div className="mt-1">
                    <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Digite a senha novamente"
                    />
                </div>
                </div>

                <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Telefone (opcional)
                </label>
                <div className="mt-1">
                    <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="(XX) XXXXX-XXXX"
                    />
                </div>
                </div>

                <div className="flex items-start">
                <div className="flex items-center h-5">
                    <input
                    id="acceptTerms"
                    name="acceptTerms"
                    type="checkbox"
                    checked={formData.acceptTerms}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                </div>
                <div className="ml-3 text-sm">
                    <label htmlFor="acceptTerms" className="font-medium text-gray-700">
                    Eu aceito os{' '}
                    <Link to="/termos" className="text-blue-600 hover:text-blue-500">
                        termos de uso
                    </Link>{' '}
                    e{' '}
                    <Link to="/privacidade" className="text-blue-600 hover:text-blue-500">
                        política de privacidade
                    </Link>
                    </label>
                </div>
                </div>

                <div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-75"
                >
                    {isLoading ? 'Cadastrando...' : 'Criar conta'}
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
                    Ou registre-se com
                    </span>
                </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                <div>
                    <button
                    type="button"
                    className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                    <span className="sr-only">Registrar com Google</span>
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
                    <span className="sr-only">Registrar com Facebook</span>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z" clipRule="evenodd" />
                    </svg>
                    </button>
                </div>
                </div>
            </div>
            
            <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                Já tem uma conta?{' '}
                <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                    Faça login
                </Link>
                </p>
            </div>
            </div>
        </div>
        </div>
    );
};

export default RegisterPage;