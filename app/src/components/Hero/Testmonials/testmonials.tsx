import React from 'react';
import { StarIcon } from 'lucide-react';

interface Testimonial {
  id: string;
  clientName: string;
  clientRole: string;
  rating: number;
  comment: string;
  purchaseDate: string;
  vehicleModel: string;
  vehicleImage?: string;
}

interface SocialProofProps {
  testimonials?: Testimonial[];
  loading?: boolean;
  error?: string | null;
}

const SocialProof: React.FC<SocialProofProps> = ({ 
  testimonials = [], 
  loading = false, 
  error = null 
}) => {
  // Skeleton loading
  if (loading) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-light text-gray-900 mb-8 text-center">Opinião de Clientes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(2)].map((_, index) => (
              <div key={index} className="bg-white p-6 border border-gray-100">
                <div className="flex items-center mb-4">
                  <div className="h-10 w-10 bg-gray-200 rounded-full mr-3"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 w-24"></div>
                    <div className="h-3 bg-gray-200 w-32"></div>
                  </div>
                </div>
                <div className="h-4 bg-gray-200 w-full mb-2"></div>
                <div className="h-4 bg-gray-200 w-5/6 mb-2"></div>
                <div className="h-4 bg-gray-200 w-2/3"></div>
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
      <section className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-light text-gray-900 mb-4">Opinião de Clientes</h2>
          <p className="text-gray-500 mb-4">Erro ao carregar os depoimentos</p>
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
  if (testimonials.length === 0 && !loading) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-light text-gray-900 mb-4">Opinião de Clientes</h2>
          <p className="text-gray-500">Nenhum depoimento disponível</p>
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
    <section className="py-12 bg-gray-50">
      <div className="max-w-full lg:px-14 mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-light text-gray-900 mb-1">Opinião de Clientes</h2>
          <p className="text-gray-500 text-sm">Experiências reais de nossos compradores</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white p-6 border border-gray-100">
              <div className="flex items-center mb-4">
                {testimonial.vehicleImage && (
                  <img 
                    src={testimonial.vehicleImage} 
                    alt={testimonial.vehicleModel}
                    className="h-12 w-16 object-cover rounded mr-3"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder-car-small.jpg';
                    }}
                  />
                )}
                <div>
                  <p className="font-medium text-gray-900">{testimonial.clientName}</p>
                  <p className="text-gray-500 text-sm">{testimonial.clientRole}</p>
                </div>
              </div>

              <div className="flex items-center mb-3">
                {[...Array(5)].map((_, i) => (
                  <StarIcon 
                    key={i}
                    className={`w-4 h-4 ${i < testimonial.rating ? 'text-yellow-500' : 'text-gray-300'}`}
                  />
                ))}
                <span className="ml-2 text-sm text-gray-500">
                  Comprado em {formatDate(testimonial.purchaseDate)}
                </span>
              </div>

              <p className="text-gray-700 italic">"{testimonial.comment}"</p>
              <p className="mt-3 text-sm text-gray-500">
                Modelo: {testimonial.vehicleModel}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProof;