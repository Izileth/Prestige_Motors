import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

interface CategoryItem {
  id: string;
  name: string;
  imageUrl: string;
  route: string;
}

interface CategorySelectorProps {
  categories: CategoryItem[];
}

const CategorySelector: React.FC<CategorySelectorProps> = ({ categories }) => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery({ maxWidth: 767 });

  // Configurações do carrossel para mobile
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1.2,
    slidesToScroll: 1,
    centerMode: true,
    arrows: false,
    className: 'px-4', // Adiciona padding lateral
  };

  return (
    <section className="py-12 px-0 bg-white">
      <div className="max-w-full px-4 lg:px-14 mx-auto">
        <h2 className="text-center mb-12 text-3xl font-light text-gray-900 tracking-wide">
          Nossas Linhas Esportivas
        </h2>
        
        {/* Versão Desktop */}
        {!isMobile && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <CategoryCard 
                key={category.id}
                category={category}
                navigate={navigate}
              />
            ))}
          </div>
        )}

        {/* Versão Mobile (Carrossel) */}
        {isMobile && (
          <Slider {...sliderSettings}>
            {categories.map((category) => (
              <div key={category.id} className="px-2">
                <CategoryCard 
                  category={category}
                  navigate={navigate}
                  isMobile={true}
                />
              </div>
            ))}
          </Slider>
        )}
      </div>
    </section>
  );
};

// Componente de Card separado para reutilização
const CategoryCard: React.FC<{
  category: CategoryItem;
  navigate: (route: string) => void;
  isMobile?: boolean;
}> = ({ category, navigate, isMobile = false }) => {
  return (
    <div
      onClick={() => navigate(category.route)}
      className={`relative overflow-hidden cursor-pointer transition-all duration-300 ${
        isMobile ? 'h-64' : 'h-72'
      }`}
      style={{ 
        backgroundImage: `url(${category.imageUrl})`, 
        backgroundSize: 'cover', 
        backgroundPosition: 'center' 
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute inset-0 flex items-end p-6">
        <h3 className="text-zinc-50 text-xl font-medium tracking-wide transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
          {category.name}
        </h3>
      </div>
      <div className="absolute inset-0 border border-transparent hover:border-white/30 transition-all duration-300" />
    </div>
  );
};

export default CategorySelector;