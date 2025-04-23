import type { AsyncThunkAction } from '@reduxjs/toolkit';
import type { AnyAction } from 'redux';

export type UserPreview = Pick<User, 'id' | 'nome' | 'avatar'> & WithId;
export type VehiclePreview = Pick<Vehicle, 'id' | 'marca' | 'modelo'> & {
  imagemPrincipal?: string;
};

type WithId<T = string> = { id: T };
type WithTimestamps = {
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string;
};
export type Kilometers = number & { readonly __brand: 'Kilometers' };
export type Price = number & { readonly __brand: 'Price' };

// Enums para corresponder ao Prisma
export enum Combustivel {
  GASOLINA = 'GASOLINA',
  ETANOL = 'ETANOL',
  FLEX = 'FLEX',
  DIESEL = 'DIESEL',
  ELETRICO = 'ELETRICO',
  HIBRIDO = 'HIBRIDO',
  GNV = 'GNV'
}

export enum Cambio {
  MANUAL = 'MANUAL',
  AUTOMATICO = 'AUTOMATICO',
  SEMI_AUTOMATICO = 'SEMI_AUTOMATICO',
  CVT = 'CVT'
}

export enum Carroceria {
  HATCH = 'HATCH',
  SEDAN = 'SEDAN',
  SUV = 'SUV',
  PICAPE = 'PICAPE',
  COUPE = 'COUPE',
  CONVERSIVEL = 'CONVERSIVEL',
  PERUA = 'PERUA',
  MINIVAN = 'MINIVAN',
  VAN = 'VAN'
}

export enum Categoria {
  ESPORTIVO = 'ESPORTIVO',
  SUPER_ESPORTIVO = 'SUPER_ESPORTIVO',
  LUXO = 'LUXO',
  CLASSICO = 'CLASSICO',
  CONCEITO = 'CONCEITO',
  TUNING = 'TUNING'
}

export enum Classe {
  ENTRY_LEVEL = 'ENTRY_LEVEL',
  INTERMEDIARIO = 'INTERMEDIARIO',
  HIGH_END = 'HIGH_END',
  HYPER_CAR = 'HYPER_CAR'
}

export enum StatusVeiculo {
  DISPONIVEL = 'DISPONIVEL',
  RESERVADO = 'RESERVADO',
  VENDIDO = 'VENDIDO',
  INDISPONIVEL = 'INDISPONIVEL'
}

// Tipos principais
export type User = {
  id: string;
  nome: string;
  email: string;
  role?: string;
  telefone: string;
  avatar?: string;
};

export type Endereco = {
  id: string;
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  pais?: string;
  latitude?: number;
  longitude?: number;
};

export type Vehicle = WithTimestamps & WithId &  {
  id: string;
  marca: string;
  modelo: string;
  anoFabricacao: number;
  anoModelo: number;
  preco: number;
  precoPromocional?: number;
  quilometragem: number;
  tipoCombustivel: Combustivel;
  cambio: Cambio;
  cor: string;
  portas: number;
  finalPlaca?: number;
  carroceria: Carroceria;
  potencia?: number;
  motor?: string;
  categoria: Categoria;
  classe: Classe;
  status: StatusVeiculo;
  destaque: boolean;
  seloOriginal: boolean;
  aceitaTroca: boolean;
  parcelamento?: number;
  imagens: VehicleImage[];
  videos?: MediaAsset[];
  avaliacoes?: Avaliacao[];

};


export interface Venda extends WithTimestamps, WithId {
  precoVenda: Price;
  formaPagamento: string;
  parcelas?: number;
  dataVenda: string;
  vehicle: VehiclePreview;
  vendedor: UserPreview;
  comprador: UserPreview;
  status: 'COMPLETE' | 'PENDING' | 'CANCELED';
}

export interface MediaAsset extends WithId {
  url: string;
  altText?: string;
  ordem?: number;
}

export interface VehicleImage extends MediaAsset {
  isMain: boolean;
  colorHex?: string;
}

export type Avaliacao = {
  id: string;
  rating: number;
  comentario?: string;
  createdAt: string;
  user: Pick<User, 'id' | 'nome' | 'avatar'>;
};


export type PaginatedResponse<T> = {
  data: T[];
  meta: {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
};

export type VehicleFilters = {
  marca?: string[];
  precoMin?: number;
  precoMax?: number;
  anoMin?: number;
  anoMax?: number;
  combustivel?: Combustivel[];
};

