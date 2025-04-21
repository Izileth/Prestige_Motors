import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '~/src/components/imported/card'
import { Button } from '../../imported/button'
import { Badge } from '../../imported/badge'
import { Icons } from '../../common/Icon/icon'
import { useVehicles } from '~/src/hooks/useVehicle'
import { Combustivel, Cambio, Carroceria, StatusVeiculo } from '~/src/types/types'
import type { Vehicle } from '~/src/types/types'
import { useCallback } from 'react'
import { useNavigate } from 'react-router'

interface VehicleCardProps {
  vehicle: Vehicle
  isOwner?: boolean
  onStatusChange?: (id: string, status: StatusVeiculo) => void
  onDelete?: (id: string) => void
}

export function VehicleCard({ vehicle, isOwner = false, onStatusChange, onDelete }: VehicleCardProps) {
    const { deleteVehicle, updateVehicleStatus } = useVehicles()
    const router = useNavigate()

    const handleStatusChange = useCallback(async (newStatus: StatusVeiculo) => {
        try {
        await updateVehicleStatus(vehicle.id, newStatus)
        onStatusChange?.(vehicle.id, newStatus)
        } catch (error) {
        console.error('Failed to update vehicle status:', error)
        }
    }, [vehicle.id, updateVehicleStatus, onStatusChange])

    const handleDelete = useCallback(async () => {
        try {
        await deleteVehicle(vehicle.id)
        onDelete?.(vehicle.id)
        } catch (error) {
        console.error('Failed to delete vehicle:', error)
        }
    }, [vehicle.id, deleteVehicle, onDelete])

    const handleEdit = useCallback(() => {
        router(`/vehicles/edit/${vehicle.id}`)
    }, [vehicle.id, router])

    const handleViewDetails = useCallback(() => {
        router(`/vehicles/${vehicle.id}`)
    }, [vehicle.id, router])

    // Função auxiliar para traduzir enums para português
    const translateEnum = (value: string): string => {
        const translations: Record<string, string> = {
        [StatusVeiculo.DISPONIVEL]: 'Disponível',
        [StatusVeiculo.RESERVADO]: 'Reservado',
        [StatusVeiculo.VENDIDO]: 'Vendido',
        [StatusVeiculo.INDISPONIVEL]: 'Indisponível',
        [Combustivel.GASOLINA]: 'Gasolina',
        [Combustivel.ETANOL]: 'Etanol',
        [Combustivel.FLEX]: 'Flex',
        [Combustivel.DIESEL]: 'Diesel',
        [Combustivel.ELETRICO]: 'Elétrico',
        [Combustivel.HIBRIDO]: 'Híbrido',
        [Combustivel.GNV]: 'GNV',
        [Cambio.MANUAL]: 'Manual',
        [Cambio.AUTOMATICO]: 'Automático',
        [Cambio.SEMI_AUTOMATICO]: 'Semi-Automático',
        [Cambio.CVT]: 'CVT',
        [Carroceria.HATCH]: 'Hatch',
        [Carroceria.SEDAN]: 'Sedã',
        [Carroceria.SUV]: 'SUV',
        [Carroceria.PICAPE]: 'Picape',
        [Carroceria.COUPE]: 'Coupé',
        [Carroceria.CONVERSIVEL]: 'Conversível',
        [Carroceria.PERUA]: 'Perua',
        [Carroceria.MINIVAN]: 'Minivan',
        [Carroceria.VAN]: 'Van'
        }
        return translations[value] || value
    }

    // Encontra a imagem principal ou a primeira imagem
    const mainImage = vehicle.imagens.find(img => img.isMain) || vehicle.imagens[0]

    return (
        <Card className="hover:shadow-lg transition-shadow h-full flex flex-col">
        <CardHeader className="p-0 relative flex-1">
            <div className="relative h-48 w-full">
            <img 
                src={mainImage?.url || '/placeholder-vehicle.jpg'} 
                alt={`${vehicle.marca} ${vehicle.modelo}`}
                className="w-full h-full object-cover rounded-t-lg"
            />
            <Badge 
                variant={
                vehicle.status === StatusVeiculo.DISPONIVEL ? 'default' :
                vehicle.status === StatusVeiculo.RESERVADO ? 'secondary' :
                vehicle.status === StatusVeiculo.VENDIDO ? 'destructive' : 'outline'
                }
                className="absolute top-2 right-2"
            >
                {translateEnum(vehicle.status)}
            </Badge>
            
            {vehicle.destaque && (
                <Badge variant="default" className="absolute top-2 left-2 bg-yellow-500 hover:bg-yellow-600">
                <Icons.star className="h-3 w-3 mr-1" />
                Destaque
                </Badge>
            )}
            
            {vehicle.seloOriginal && (
                <Badge variant="default" className="absolute top-10 left-2 bg-blue-500 hover:bg-blue-600">
                <Icons.badgeCheck className="h-3 w-3 mr-1" />
                Original
                </Badge>
            )}
            </div>
        </CardHeader>
        
        <CardContent className="p-4 flex-grow">
            <CardTitle className="text-lg">
            {vehicle.marca} {vehicle.modelo}
            </CardTitle>
            
            <div className="mt-2 space-y-1">
            <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                {vehicle.anoFabricacao}/{vehicle.anoModelo}
                </span>
                <span className="text-sm text-muted-foreground">
                {translateEnum(vehicle.carroceria)}
                </span>
            </div>
            
            <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                {translateEnum(vehicle.tipoCombustivel)}
                </span>
                <span className="text-sm text-muted-foreground">
                {translateEnum(vehicle.cambio)}
                </span>
            </div>
            
            <p className="text-sm text-muted-foreground">
                <span className="font-medium">KM:</span> {vehicle.quilometragem.toLocaleString('pt-BR')} km
            </p>
            
            <div className="mt-2">
                {vehicle.precoPromocional ? (
                <div className="flex items-center gap-2">
                    <p className="text-lg font-bold text-primary">
                    {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                    }).format(vehicle.precoPromocional)}
                    </p>
                    <p className="text-sm line-through text-muted-foreground">
                    {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                    }).format(vehicle.preco)}
                    </p>
                </div>
                ) : (
                <p className="text-lg font-bold">
                    {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                    }).format(vehicle.preco)}
                </p>
                )}
            </div>
            
            {vehicle.parcelamento && (
                <p className="text-sm text-muted-foreground">
                Até {vehicle.parcelamento}x de {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }).format(vehicle.preco / vehicle.parcelamento)}
                </p>
            )}
            </div>
        </CardContent>
        
        <CardFooter className="p-4 pt-0 flex justify-between gap-2">
            <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={handleViewDetails}
            >
            Ver Detalhes
            </Button>
            
            {isOwner && (
            <div className="flex gap-2">
                <Button 
                variant="outline" 
                size="sm" 
                onClick={handleEdit}
                >
                <Icons.edit className="h-4 w-4" />
                </Button>
                
                {vehicle.status !== StatusVeiculo.VENDIDO && (
                <Button 
                    variant="secondary" 
                    size="sm"
                    onClick={() => handleStatusChange(
                    vehicle.status === StatusVeiculo.DISPONIVEL ? 
                    StatusVeiculo.RESERVADO : 
                    StatusVeiculo.DISPONIVEL
                    )}
                >
                    {vehicle.status === StatusVeiculo.DISPONIVEL ? (
                    <Icons.lock className="h-4 w-4" />
                    ) : (
                    <Icons.unlock className="h-4 w-4" />
                    )}
                </Button>
                )}
                
                <Button 
                variant="destructive" 
                size="sm"
                onClick={handleDelete}
                >
                <Icons.trash className="h-4 w-4" />
                </Button>
            </div>
            )}
        </CardFooter>
        </Card>
    )
}