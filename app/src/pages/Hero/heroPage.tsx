import { useState } from "react";
import Carousel from "~/src/components/common/Carousel/carousel";
import { DataProducts } from "~/src/data/carousel/products";
import { DataVehicles } from "~/src/data/static/vehicles/vehicles";
import { DataCategories } from "~/src/data/static/categories/categories";
import { DataNewReleases } from "~/src/data/static/releases/releases";
import { DataTestmonial } from "~/src/data/static/testmonials/testmonials";
import WordCarousel from "~/src/components/Hero/Words/carouselWords";
import TopSellers from "~/src/components/Hero/Top/topSellers";
import NewReleases from "~/src/components/Hero/Releases/releases";
import SocialProof from "~/src/components/Hero/Testmonials/testmonials";
import SpecialOffers from "~/src/components/Hero/Offerts/specialOfferts";
import CategorySelector from "~/src/components/Hero/Categories/categories";
import BlogBanner from "~/src/components/common/Banner/banner";

export function Hero() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

   // Estado para Novidades
  const [newVehiclesLoading, setNewVehiclesLoading] = useState(true);
  const [newVehiclesError, setNewVehiclesError] = useState<string | null>(null);

  // Estado para Prova Social
  const [testimonialsLoading, setTestimonialsLoading] = useState(true);
  const [testimonialsError, setTestimonialsError] = useState<string | null>(null);

    return (
        <>
         <Carousel
        items={DataProducts}
        variant="overlay"
        contentPosition="right"
        showDots={false}
        showProgress={true}
        height="h-[80vh]"
      />
      <CategorySelector categories={DataCategories} />
      <TopSellers 
        vehicles={DataVehicles}
        error={error}
      />
      <SpecialOffers/>
      <NewReleases 
        vehicles={DataNewReleases}
        error={newVehiclesError}
      />
      <SocialProof 
        testimonials={DataTestmonial}
        error={testimonialsError}
      />
      <WordCarousel 
      words={['Descontos Exclusivos', 'Financiamento Facilitado', 'Garantia Estendida']} 
      speed={60}
      className="text-zinc-950 text-xl mb-6 mt-6"
      separator="  •  "
      />
      <BlogBanner/>
      </>
    );
}
