
import { useEffect, useState } from 'react'
import { useUser } from '~/src/hooks/useUser'

import { Button } from '~/src/components/imported/button'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '~/src/components/imported/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '~/src/components/imported/tabs'
import { Avatar, AvatarImage, AvatarFallback } from '~/src/components/imported/avatar'
import { Input } from '~/src/components/imported/input'
import { Label } from '~/src/components/imported/label'
import { Alert, AlertTitle, AlertDescription } from '~/src/components/imported/alert'
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '~/src/components/imported/alert-dialog'
import { Badge } from '~/src/components/imported/badge'

import { VehicleCard } from '~/src/components/vehicle/Card/card'

import { Skeleton } from '~/src/components/imported/skeleton'
import { Icons } from '~/src/components/common/Icon/icon'

import type { Endereco, Venda, Vehicle } from '~/src/types/types'
import type { UserProfileState, UpdateProfilePayload, UserStats, AuthState, SalesState } from '~/src/store/user/types'
import { useUserSales } from '~/src/hooks/useUser'

// Interface estendida para Endereco com isPrimary
type EnderecoWithPrimary = Endereco & { isPrimary?: boolean };

// Tipo para o formulário do perfil
type ProfileFormData = {
    name: string
    email: string
    phone?: string
}

// Interface para o retorno do hook useUser
interface UseUserReturn {
    auth: AuthState;
    profile: UserProfileState['profile'];
    addresses: EnderecoWithPrimary[];
    sales: SalesState;
    stats: UserStats | null;
    isAuthenticated: boolean;
    getProfile: (userId: string) => Promise<void>;
    updateProfile: (data: UpdateProfilePayload) => Promise<void>;
    deleteAccount: () => Promise<void>;
    getAddresses: () => Promise<void>;
    getUserSales: () => Promise<void>;
    signOut: () => void;
}

// Interface para o componente VehicleCard
interface VehicleCardProps {
    vehicle: Vehicle;
    isOwner?: boolean;
}

export function UserDashboard() {
    const {
        auth,
        profile,
        addresses,
        sales,
        stats,
        isAuthenticated,
        getProfile,
        updateProfile,
        deleteAccount,
        getAddresses,
        getUserSales,
        signOut
    } = useUser();

    const [activeTab, setActiveTab] = useState<'profile' | 'vehicles' | 'addresses' | 'settings'>('profile')
    const [isLoading, setIsLoading] = useState(true)
    const [profileForm, setProfileForm] = useState<ProfileFormData>({
        name: '',
        email: '',
        phone: ''
    })
    const [isEditing, setIsEditing] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)

    // Carrega os dados do usuário
    useEffect(() => {
        if (isAuthenticated && auth.user?.id) {
        const userId = auth.user.id;
        const loadData = async () => {
            try {
            await Promise.all([
                getProfile(userId),
                getAddresses(),
                getUserSales()
            ])
            } catch (err) {
            setError('Falha ao carregar dados do usuário')
            } finally {
            setIsLoading(false)
            }
        }
        loadData()
        }
    }, [isAuthenticated, auth.user?.id, getProfile, getAddresses, getUserSales])

    // Preenche o formulário quando o perfil é carregado
    useEffect(() => {
        if (profile) {
        setProfileForm({
            name: profile.nome || '',
            email: profile.email || '',
            phone: profile.telefone || ''
        })
        }
    }, [profile])

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
        if (!auth.user?.id) return
        
        const updateData: UpdateProfilePayload = {
            nome: profileForm.name,
            telefone: profileForm.phone || ''
            // email não está no UpdateProfilePayload, então removemos
        };
        
        await updateProfile(updateData)
        setSuccess('Perfil atualizado com sucesso!')
        setIsEditing(false)
        setTimeout(() => setSuccess(null), 3000)
        } catch (err) {
        setError('Falha ao atualizar perfil')
        setTimeout(() => setError(null), 3000)
        }
    }

    const handleDeleteAccount = async () => {
        try {
        await deleteAccount()
        signOut()
        } catch (err) {
        setError('Falha ao deletar conta')
        setTimeout(() => setError(null), 3000)
        }
    }

    if (isLoading) {
        return (
        <div className="container mx-auto py-8">
            <div className="flex flex-col space-y-4">
            <Skeleton className="h-12 w-full" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Skeleton className="h-64" />
                <Skeleton className="h-64" />
                <Skeleton className="h-64" />
            </div>
            </div>
        </div>
        )
    }

    if (!isAuthenticated) {
        return (
        <div className="container mx-auto py-8 text-center">
            <Alert variant="destructive">
            <AlertTitle>Acesso não autorizado</AlertTitle>
            <AlertDescription>
                Você precisa estar logado para acessar esta página.
            </AlertDescription>
            </Alert>
        </div>
        )
    }

    return (
        <div className="container mx-auto py-8">
        {/* Alertas de erro/sucesso */}
        {error && (
            <Alert variant="destructive" className="mb-6">
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}
        
        {success && (
            <Alert className="mb-6">
            <AlertTitle>Sucesso!</AlertTitle>
            <AlertDescription>{success}</AlertDescription>
            </Alert>
        )}

        <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar */}
            <div className="w-full md:w-64 flex-shrink-0">
            <Card>
                <CardHeader className="flex flex-row items-center space-x-4">
                <Avatar>
                    <AvatarImage src={profile?.avatar} />
                    <AvatarFallback>
                    {profile?.nome ? profile.nome.charAt(0) : 'U'}
                    </AvatarFallback>
                </Avatar>
                <div>
                    <h2 className="font-semibold">{profile?.nome}</h2>
                    <p className="text-sm text-muted-foreground">
                    {profile?.email}
                    </p>
                </div>
                </CardHeader>
                <CardContent className="p-0">
                <TabsList className="flex flex-col h-full w-full p-0">
                    <Button
                    variant="ghost"
                    className={`justify-start rounded-none w-full ${activeTab === 'profile' ? 'bg-accent' : ''}`}
                    onClick={() => setActiveTab('profile')}
                    >
                    <Icons.user className="mr-2 h-4 w-4" />
                    Perfil
                    </Button>
                    <Button
                    variant="ghost"
                    className={`justify-start rounded-none w-full ${activeTab === 'vehicles' ? 'bg-accent' : ''}`}
                    onClick={() => setActiveTab('vehicles')}
                    >
                    <Icons.car className="mr-2 h-4 w-4" />
                    Meus Veículos
                    </Button>
                    <Button
                    variant="ghost"
                    className={`justify-start rounded-none w-full ${activeTab === 'addresses' ? 'bg-accent' : ''}`}
                    onClick={() => setActiveTab('addresses')}
                    >
                    <Icons.mapPin className="mr-2 h-4 w-4" />
                    Endereços
                    </Button>
                    <Button
                    variant="ghost"
                    className={`justify-start rounded-none w-full ${activeTab === 'settings' ? 'bg-accent' : ''}`}
                    onClick={() => setActiveTab('settings')}
                    >
                    <Icons.settings className="mr-2 h-4 w-4" />
                    Configurações
                    </Button>
                </TabsList>
                </CardContent>
            </Card>
            </div>

            {/* Conteúdo principal */}
            <div className="flex-1">
            {/* Seção de Perfil */}
            {activeTab === 'profile' && (
                <Card>
                <CardHeader>
                    <CardTitle>Informações do Perfil</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleProfileUpdate}>
                    <div className="grid gap-4">
                        <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nome</Label>
                            <Input
                            id="name"
                            value={profileForm.name}
                            onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                            disabled={!isEditing}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                            id="email"
                            type="email"
                            value={profileForm.email}
                            onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                            disabled={!isEditing}
                            />
                        </div>
                        </div>
                        <div className="space-y-2">
                        <Label htmlFor="phone">Telefone</Label>
                        <Input
                            id="phone"
                            value={profileForm.phone || ''}
                            onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                            disabled={!isEditing}
                        />
                        </div>
                        
                        {isEditing ? (
                        <div className="flex gap-2">
                            <Button type="submit">Salvar</Button>
                            <Button variant="outline" onClick={() => setIsEditing(false)}>
                            Cancelar
                            </Button>
                        </div>
                        ) : (
                        <Button variant="outline" onClick={() => setIsEditing(true)}>
                            Editar Perfil
                        </Button>
                        )}
                    </div>
                    </form>
                </CardContent>
                
                {/* Estatísticas */}
                {stats && (
                    <CardFooter className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border rounded-lg p-4 text-center">
                        <h3 className="text-sm font-medium text-muted-foreground">Veículos Anunciados</h3>
                        <p className="text-2xl font-bold">{stats.totalVehicles || 0}</p>
                    </div>
                    <div className="border rounded-lg p-4 text-center">
                        <h3 className="text-sm font-medium text-muted-foreground">Veículos Vendidos</h3>
                        <p className="text-2xl font-bold">{stats.totalSales || 0}</p>
                    </div>
                    <div className="border rounded-lg p-4 text-center">
                        <h3 className="text-sm font-medium text-muted-foreground">Avaliação</h3>
                        <p className="text-2xl font-bold">{stats.averageRating ? `${stats.averageRating}/5` : 'N/A'}</p>
                    </div>
                    </CardFooter>
                )}
                </Card>
            )}

            {/* Seção de Veículos */}
            {activeTab === 'vehicles' && (
                <div className="space-y-4">
                <Card>
                    <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>Meus Veículos Anunciados</CardTitle>
                        <Button>
                        <Icons.plus className="mr-2 h-4 w-4" />
                        Novo Anúncio
                        </Button>
                    </div>
                    </CardHeader>
                    <CardContent>
                    {sales.sales.data && sales.sales.data.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {sales.sales.data.map((sale: Venda) => {
                            // Aqui precisamos converter o tipo parcial para o tipo completo Vehicle
                            // Esta é uma solução temporária. Idealmente, VehicleCard deveria aceitar tipos parciais
                            // ou você deveria garantir que o objeto sale.vehicle tenha todas as propriedades necessárias
                            const vehicleData = sale.vehicle as unknown as Vehicle;
                            
                            return (
                            <VehicleCard 
                                key={sale.id} 
                                vehicle={vehicleData}
                                isOwner={true}
                            />
                            );
                        })}
                        </div>
                    ) : (
                        <Alert>
                        <Icons.info className="h-4 w-4" />
                        <AlertTitle>Nenhum veículo anunciado</AlertTitle>
                        <AlertDescription>
                            Você ainda não anunciou nenhum veículo. Clique em "Novo Anúncio" para começar.
                        </AlertDescription>
                        </Alert>
                    )}
                    </CardContent>
                </Card>
                </div>
            )}

            {/* Seção de Endereços */}
            {activeTab === 'addresses' && (
                <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                    <CardTitle>Meus Endereços</CardTitle>
                    <Button>
                        <Icons.plus className="mr-2 h-4 w-4" />
                        Adicionar Endereço
                    </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {addresses && addresses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {addresses.map((address: EnderecoWithPrimary) => (
                        <Card key={address.id}>
                            <CardHeader>
                            <div className="flex justify-between items-center">
                                <CardTitle>{address.logradouro ? 'Endereço' : 'Endereço'}</CardTitle>
                                {address.isPrimary && (
                                <Badge variant="secondary">Principal</Badge>
                                )}
                            </div>
                            </CardHeader>
                            <CardContent>
                            <p>{address.logradouro}, {address.numero}</p>
                            <p>{address.bairro}</p>
                            <p>{address.cidade} - {address.estado}</p>
                            <p>CEP: {address.cep}</p>
                            </CardContent>
                            <CardFooter className="flex justify-end gap-2">
                            <Button variant="outline" size="sm">
                                Editar
                            </Button>
                            {!address.isPrimary && (
                                <Button variant="destructive" size="sm">
                                Remover
                                </Button>
                            )}
                            </CardFooter>
                        </Card>
                        ))}
                    </div>
                    ) : (
                    <Alert>
                        <Icons.info className="h-4 w-4" />
                        <AlertTitle>Nenhum endereço cadastrado</AlertTitle>
                        <AlertDescription>
                        Adicione um endereço para facilitar suas compras e vendas.
                        </AlertDescription>
                    </Alert>
                    )}
                </CardContent>
                </Card>
            )}

            {/* Seção de Configurações */}
            {activeTab === 'settings' && (
                <div className="space-y-4">
                <Card>
                    <CardHeader>
                    <CardTitle>Configurações da Conta</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                    <div>
                        <h3 className="font-medium mb-2">Alterar Senha</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="currentPassword">Senha Atual</Label>
                            <Input id="currentPassword" type="password" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="newPassword">Nova Senha</Label>
                            <Input id="newPassword" type="password" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                            <Input id="confirmPassword" type="password" />
                        </div>
                        </div>
                        <Button className="mt-4">Atualizar Senha</Button>
                    </div>
                    </CardContent>
                </Card>

                <Card className="border-destructive">
                    <CardHeader>
                    <CardTitle className="text-destructive">Zona Perigosa</CardTitle>
                    </CardHeader>
                    <CardContent>
                    <div className="space-y-4">
                        <Alert variant="destructive">
                        <Icons.warning className="h-4 w-4" />
                        <AlertTitle>Atenção!</AlertTitle>
                        <AlertDescription>
                            Estas ações são irreversíveis. Tenha certeza do que está fazendo.
                        </AlertDescription>
                        </Alert>

                        <div className="flex flex-col space-y-2">
                        <Button variant="outline" onClick={signOut}>
                            <Icons.logout className="mr-2 h-4 w-4" />
                            Sair da Conta
                        </Button>

                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                            <Button variant="destructive">
                                <Icons.trash className="mr-2 h-4 w-4" />
                                Excluir Conta Permanentemente
                            </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Você tem certeza absoluta?</AlertDialogTitle>
                                <AlertDialogDescription>
                                Esta ação não pode ser desfeita. Isso excluirá permanentemente sua conta
                                e removerá todos os seus dados de nossos servidores.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction 
                                onClick={handleDeleteAccount}
                                >
                                Sim, excluir conta
                                </AlertDialogAction>
                            </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                        </div>
                    </div>
                    </CardContent>
                </Card>
                </div>
            )}
            </div>
        </div>
        </div>
    )
}