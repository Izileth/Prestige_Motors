import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ClockIcon, ArrowRightIcon } from 'lucide-react';

interface NewVehicle {
  id: string;
  model: string;
  manufacturer: string;
  releaseDate: string;
  price: number;
  imageUrl: string;
  isComingSoon?: boolean;
  route: string;
}

interface NewReleasesProps {
  vehicles?: NewVehicle[];
  loading?: boolean;
  error?: string | null;
}

const NewReleases: React.FC<NewReleasesProps> = ({ 
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
          <h2 className="text-2xl font-light text-gray-900 mb-8 text-center">Novidades</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, index) => (
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
          <h2 className="text-2xl font-light text-gray-900 mb-4">Novidades</h2>
          <p className="text-gray-500 mb-4">Erro ao carregar as novidades</p>
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
          <h2 className="text-2xl font-light text-gray-900 mb-4">Novidades</h2>
          <p className="text-gray-500">Nenhuma novidade no momento</p>
        </div>
      </section>
    );
  }

  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  };

  return (
    <section className="py-12 bg-white">
      <div className="max-w-full lg:px-14 mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-light text-gray-900 mb-1">Novidades</h2>
          <p className="text-gray-500 text-sm">Os lançamentos mais recentes no mercado</p>
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
                {vehicle.isComingSoon && (
                  <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium flex items-center">
                    <ClockIcon className="w-3 h-3 mr-1" />
                    <span>Em breve</span>
                  </div>
                )}
              </div>

              <div className="p-4">
                <div className="mb-3">
                  <h3 className="font-medium text-gray-900 line-clamp-1">{vehicle.model}</h3>
                  <p className="text-gray-500 text-sm">{vehicle.manufacturer}</p>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-lg font-light text-gray-900 block">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                        minimumFractionDigits: 0
                      }).format(vehicle.price)}
                    </span>
                    <span className="text-xs text-gray-500">
                      Lançamento: {formatDate(vehicle.releaseDate)}
                    </span>
                  </div>

                  <button
                    onClick={() => navigate(vehicle.route)}
                    className="text-gray-400 hover:text-gray-900 transition-colors flex items-center"
                    aria-label="Ver detalhes"
                  >
                    <ArrowRightIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewReleases;