import { useState, useEffect } from "react";

const useCityManagement = (cities) => {
  const [stagingCities, setStagingCities] = useState([]);
  const [deletedCityIds, setDeletedCityIds] = useState([]);

  // Initialize staging cities when cities are loaded
  useEffect(() => {
    setStagingCities(cities);
  }, [cities]);

  // Get combined cities (original + staging - deleted)
  const displayCities = stagingCities.filter(city => !deletedCityIds.includes(city.id));

  // Get pending changes for modal display
  const getPendingChanges = () => {
    const newCities = stagingCities.filter(city => city.isStaging);
    const deletedCities = cities.filter(city => deletedCityIds.includes(city.id));

    return {
      newCities,
      deletedCities,
      hasChanges: newCities.length > 0 || deletedCities.length > 0
    };
  };

  // Revert specific changes
  const revertNewCity = (cityId) => {
    setStagingCities(prev => prev.filter(city => city.id !== cityId));
  };

  const revertDeletedCity = (cityId) => {
    setDeletedCityIds(prev => prev.filter(id => id !== cityId));
  };

  return {
    stagingCities,
    setStagingCities,
    deletedCityIds,
    setDeletedCityIds,
    displayCities,
    getPendingChanges,
    revertNewCity,
    revertDeletedCity
  };
};

export default useCityManagement;
