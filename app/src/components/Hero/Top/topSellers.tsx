import React from 'react';
import { useNavigate } from 'react-router-dom';
import { StarIcon, ArrowRightIcon } from 'lucide-react';

interface TopSellingVehicle {
  id: string;
  model: string;
  manufacturer: string;
  price: number;
  imageUrl: string;
  rating: number;
  salesCount: number;
  route: string;
}

interface TopSellersProps {
  vehicles?: TopSellingVehicle[];
  loading?: boolean;
  error?: string | null;
}

const TopSellers: React.FC<TopSellersProps> = ({ 
  vehicles = [], 
  loading = false, 
  error = null 
}) => {
  const navigate = useNavigate();

  // Skeleton loading
  if (loading) {
    return (
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-light text-gray-900 mb-6 text-center">Principais Destaques</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="bg-gray-50 animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-4 space-y-3">
                  <div className="h-5 bg-gray-200 w-3/4"></div>
                  <div className="h-4 bg-gray-200 w-1/2"></div>
                  <div className="h-6 bg-gray-200 w-1/3 mt-2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-light text-gray-900 mb-4">Principais Destaques</h2>
          <p className="text-gray-500 mb-4">Erro ao carregar os destaques</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 text-sm border border-gray-300 hover:bg-gray-50 transition"
          >
            Tentar novamente
          </button>
        </div>
      </section>
    );
  }

  // Empty state
  if (vehicles.length === 0 && !loading) {
    return (
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-light text-gray-900 mb-4">Principais Destaques</h2>
          <p className="text-gray-500">Nenhum destaque disponível no momento</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-white">
      <div className="max-w-full mx-auto px-4 lg:px-16">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-light text-gray-900 mb-1">Principais Destaques</h2>
          <p className="text-gray-500 text-sm">Os modelos mais desejados</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {vehicles.map((vehicle) => (
            <div 
              key={vehicle.id} 
              className="group bg-white border border-gray-100 hover:border-gray-200 transition-colors"
            >
              <div className="relative overflow-hidden">
                <img 
                  src={vehicle.imageUrl} 
                  alt={`${vehicle.manufacturer} ${vehicle.model}`}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder-car.jpg';
                  }}
                />
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium flex items-center">
                  <StarIcon className="w-3 h-3 text-yellow-500 mr-1" />
                  <span>{vehicle.rating.toFixed(1)}</span>
                </div>
              </div>

              <div className="p-4">
                <div className="mb-3">
                  <h3 className="font-medium text-gray-900 line-clamp-1">{vehicle.model}</h3>
                  <p className="text-gray-500 text-sm">{vehicle.manufacturer}</p>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-lg font-light text-gray-900">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                      minimumFractionDigits: 0
                    }).format(vehicle.price)}
                  </span>

                  <button
                    onClick={() => navigate(vehicle.route)}
                    className="text-gray-400 hover:text-gray-900 transition-colors flex items-center"
                    aria-label="Ver detalhes"
                  >
                    <ArrowRightIcon className="w-4 h-4" />
                  </button>
                </div>

                <div className="mt-2">
                  <span className="inline-block bg-gray-50 text-gray-600 text-xs px-2 py-1">
                    {vehicle.salesCount} vendas
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopSellers;