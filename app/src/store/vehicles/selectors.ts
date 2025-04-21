import type { RootState } from "../globalStore";

// Seletores básicos
export const selectAllVehicles = (state: RootState) => state.vehicles.vehicles;
export const selectFeaturedVehicles = (state: RootState) => state.vehicles.featuredVehicles;
export const selectUserVehicles = (state: RootState) => state.vehicles.userVehicles;
export const selectVendorVehicles = (state: RootState) => state.vehicles.vendorVehicles;
export const selectCurrentVehicle = (state: RootState) => state.vehicles.currentVehicle;
export const selectVehicleFilters = (state: RootState) => state.vehicles.filters;
export const selectPagination = (state: RootState) => state.vehicles.pagination;
export const selectFavorites = (state: RootState) => state.vehicles.favorites.data;
export const selectFavoritesMeta = (state: RootState) => state.vehicles.favorites.meta;
export const selectReviews = (state: RootState) => state.vehicles.reviews.data;
export const selectReviewsMeta = (state: RootState) => state.vehicles.reviews.meta;
export const selectVehiclesStatus = (state: RootState) => state.vehicles.status;
export const selectUploadStatus = (state: RootState) => state.vehicles.uploadStatus;
export const selectVehiclesError = (state: RootState) => state.vehicles.error;
export const selectVehicleStats = (state: RootState) => state.vehicles.stats;
export const selectUserVehicleStats = (state: RootState) => state.vehicles.userStats;

// Seletor com filtragem
export const selectFilteredVehicles = (state: RootState) => {
    const { vehicles, filters } = state.vehicles;
    return vehicles.filter(vehicle => {
        return (
            // Aplica filtros apenas se estiverem definidos
            (!filters.marca || vehicle.marca.toLowerCase().includes(filters.marca.toLowerCase())) &&
            (!filters.modelo || vehicle.modelo.toLowerCase().includes(filters.modelo.toLowerCase())) &&
            (!filters.precoMin || vehicle.preco >= filters.precoMin) &&
            (!filters.precoMax || vehicle.preco <= filters.precoMax) &&
            (!filters.anoFabricacaoMin || vehicle.anoFabricacao >= filters.anoFabricacaoMin) &&
            (!filters.anoFabricacaoMax || vehicle.anoFabricacao <= filters.anoFabricacaoMax) &&
            (!filters.tipoCombustivel || vehicle.tipoCombustivel === filters.tipoCombustivel) &&
            (!filters.cambio || vehicle.cambio === filters.cambio) &&
            (!filters.carroceria || vehicle.carroceria === filters.carroceria) &&
            (!filters.categoria || vehicle.categoria === filters.categoria) &&
            (!filters.classe || vehicle.classe === filters.classe) &&
            (!filters.status || vehicle.status === filters.status)
        );
    });
};

// Seletor para veículo por ID
export const selectVehicleById = (id: string) => (state: RootState) => {
    return state.vehicles.vehicles.find(vehicle => vehicle.id === id) || 
            state.vehicles.userVehicles.find(vehicle => vehicle.id === id) ||
            state.vehicles.vendorVehicles.find(vehicle => vehicle.id === id) ||
            null;
};

// Seletor para verificar se um veículo é favorito
export const selectIsFavorite = (id: string) => (state: RootState) => {
    return state.vehicles.favorites.data.some(vehicle => vehicle.id === id);
};