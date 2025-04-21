import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TagIcon, ArrowRightIcon } from 'lucide-react';

interface SpecialOffer {
  id: string;
  model: string;
  manufacturer: string;
  originalPrice: number;
  discountPrice: number;
  discountPercentage: number;
  imageUrl: string;
  endDate: string;
  route: string;
}

const SpecialOffers: React.FC = () => {
  const navigate = useNavigate();

  // Dados estáticos das ofertas
  const offers: SpecialOffer[] = [
    {
      id: '1',
      model: '911 Carrera S',
      manufacturer: 'Porsche',
      originalPrice: 850000,
      discountPrice: 765000,
      discountPercentage: 10,
      imageUrl: "https://cdn.leonardo.ai/users/c60a0145-a4a8-4ee5-91cf-76495889e8b2/generations/4af2a3d3-e347-4745-98c1-b1c362f2b3fc/Leonardo_Kino_XL_Porsche_911_Turbo_S_black_matte_finish_on_mat_3.jpg",
      endDate: '2024-12-31',
      route: '/ofertas/porsche-911-carrera-s'
    },
    {
      id: '2',
      model: 'Huracán EVO',
      manufacturer: 'Lamborghini',
      originalPrice: 3200000,
      discountPrice: 2880000,
      discountPercentage: 10,
      imageUrl: "https://cdn.leonardo.ai/users/c60a0145-a4a8-4ee5-91cf-76495889e8b2/generations/4af2a3d3-e347-4745-98c1-b1c362f2b3fc/Leonardo_Kino_XL_Porsche_911_Turbo_S_black_matte_finish_on_mat_3.jpg",
      endDate: '2024-11-30',
      route: '/ofertas/lamborghini-huracan-evo'
    },
    {
      id: '3',
      model: 'AMG GT R',
      manufacturer: 'Mercedes-Benz',
      originalPrice: 1200000,
      discountPrice: 1080000,
      discountPercentage: 10,
      imageUrl: "https://cdn.leonardo.ai/users/c60a0145-a4a8-4ee5-91cf-76495889e8b2/generations/4af2a3d3-e347-4745-98c1-b1c362f2b3fc/Leonardo_Kino_XL_Porsche_911_Turbo_S_black_matte_finish_on_mat_3.jpg",
      endDate: '2024-10-15',
      route: '/ofertas/mercedes-amg-gt-r'
    },
    {
        id: '4',
        model: 'AMG GT R',
        manufacturer: 'Mercedes-Benz',
        originalPrice: 1200000,
        discountPrice: 1080000,
        discountPercentage: 10,
        imageUrl: "https://cdn.leonardo.ai/users/c60a0145-a4a8-4ee5-91cf-76495889e8b2/generations/4af2a3d3-e347-4745-98c1-b1c362f2b3fc/Leonardo_Kino_XL_Porsche_911_Turbo_S_black_matte_finish_on_mat_3.jpg",
        endDate: '2024-10-15',
        route: '/ofertas/mercedes-amg-gt-r'
      }
  ];

  // Formatar data para exibição
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  };

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-full lg:px-14 mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-light text-gray-900 mb-1">Ofertas Especiais</h2>
          <p className="text-gray-500 text-sm">Oportunidades exclusivas por tempo limitado</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {offers.map((offer) => (
            <div 
              key={offer.id} 
              className="group bg-white border border-gray-100 hover:border-gray-200 transition-colors"
            >
              <div className="relative overflow-hidden">
                <img 
                  src={offer.imageUrl} 
                  alt={`${offer.manufacturer} ${offer.model}`}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder-car.jpg';
                  }}
                />
                <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-medium flex items-center">
                  <TagIcon className="w-3 h-3 mr-1" />
                  <span>-{offer.discountPercentage}%</span>
                </div>
              </div>

              <div className="p-4">
                <div className="mb-3">
                  <h3 className="font-medium text-gray-900 line-clamp-1">{offer.model}</h3>
                  <p className="text-gray-500 text-sm">{offer.manufacturer}</p>
                </div>

                <div className="space-y-2 mb-3">
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-light text-gray-900">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                        minimumFractionDigits: 0
                      }).format(offer.discountPrice)}
                    </span>
                    <span className="text-sm text-gray-400 line-through">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                        minimumFractionDigits: 0
                      }).format(offer.originalPrice)}
                    </span>
                  </div>
                  <span className="inline-block bg-gray-50 text-red-600 text-xs px-2 py-1">
                    Economize {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                      minimumFractionDigits: 0
                    }).format(offer.originalPrice - offer.discountPrice)}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <span className="text-xs text-gray-500">
                    Até {formatDate(offer.endDate)}
                  </span>
                  <button
                    onClick={() => navigate(offer.route)}
                    className="text-gray-400 hover:text-gray-900 transition-colors flex items-center"
                    aria-label="Ver oferta"
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

export default SpecialOffers;