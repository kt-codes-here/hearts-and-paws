"use client";

import { useEffect, useState } from "react";
import { PetCard } from "@/components/ui/petCard";
import FilterSidebar from "@/components/ui/FilterSidebar";

type Pet = {
  id: string;
  name: string;
  category?: string;
  location: string;
  gender: string;
  breed: string;
  age: string;
  size: string;
  images?: string[];
  additionalInfo?: string;
  createdAt: string;
  compatibility: string;
  activityLevel: string;
};

export default function PetListings() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [allPets, setAllPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [filters, setFilters] = useState({
    category: "",
    breed: "",
    color: "",
    gender: "",
    age: "",
    size: "",
    location: "",
    compatibility: "",
    activityLevel: "",
  });

  useEffect(() => {
    // Fetch pets from API
    setLoading(true);
    fetch("/api/pets/fetch-pets")
      .then((res) => res.json())
      .then((data) => {
        // Add mock compatibility and activity level data to each pet
        const petsWithMockData = data.pets.map((pet: Pet) => ({
          ...pet,
          compatibility: ["Good with Kids", "Good with Other Pets", "Good with Strangers", "Needs a Companion"][Math.floor(Math.random() * 4)],
          activityLevel: ["Low", "Moderate", "High", "Very High"][Math.floor(Math.random() * 4)],
        }));
        setPets(petsWithMockData);
        setAllPets(petsWithMockData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching pets:", err);
        setLoading(false);
      });
  }, []);

  const handleFilterChange = (filterType: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));

    // Filter pets based on the selected filter
    const filteredPets = allPets.filter((pet) => {
      if (filterType === "compatibility" && value) {
        return pet.compatibility === value;
      }
      if (filterType === "activityLevel" && value) {
        return pet.activityLevel === value;
      }
      return true; // Keep the pet if no filter is applied
    });
    setPets(filteredPets);
  };

  const applyFilters = () => {
    // This function is triggered when the "Apply your Filter" button is clicked
    console.log("Filters applied:", filters);
  };

  const resetFilters = () => {
    // Reset all filters to their initial state
    setFilters({
      category: "",
      breed: "",
      color: "",
      gender: "",
      age: "",
      size: "",
      location: "",
      compatibility: "",
      activityLevel: "",
    });

    // Reset the pets list to the original state
    setPets(allPets);
  };

  if (loading && pets.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl font-semibold">Loading pets...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-[#675bc8] mb-8">Find Your Perfect Pet</h1>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters sidebar */}
          <div className="w-full md:w-1/4">
            <FilterSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
              onApplyFilters={applyFilters}
              onResetFilters={resetFilters}
            />
          </div>

          {/* Pet listings */}
          <div className="w-full md:w-3/4">
            {/* Active filters display */}
            {(filters.category || filters.breed || filters.color || filters.gender || (filters.age && filters.age !== "0") || filters.size || filters.location) && (
              <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-gray-700 font-medium">Active filters:</span>

                  {filters.category && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
                      Pet Type: {filters.category}
                      <button
                        onClick={() => handleFilterChange("category", "")}
                        className="ml-2 text-purple-600 hover:text-purple-800"
                      >
                        ×
                      </button>
                    </span>
                  )}

                  {filters.breed && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
                      Breed: {filters.breed}
                      <button
                        onClick={() => handleFilterChange("breed", "")}
                        className="ml-2 text-purple-600 hover:text-purple-800"
                      >
                        ×
                      </button>
                    </span>
                  )}

                  {filters.color && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
                      Color: {filters.color}
                      <button
                        onClick={() => handleFilterChange("color", "")}
                        className="ml-2 text-purple-600 hover:text-purple-800"
                      >
                        ×
                      </button>
                    </span>
                  )}

                  {filters.gender && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
                      Gender: {filters.gender}
                      <button
                        onClick={() => handleFilterChange("gender", "")}
                        className="ml-2 text-purple-600 hover:text-purple-800"
                      >
                        ×
                      </button>
                    </span>
                  )}

                  {filters.age && filters.age !== "0" && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
                      Age: Up to {filters.age} years
                      <button
                        onClick={() => handleFilterChange("age", "")}
                        className="ml-2 text-purple-600 hover:text-purple-800"
                      >
                        ×
                      </button>
                    </span>
                  )}

                  {filters.size && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
                      Size: {filters.size}
                      <button
                        onClick={() => handleFilterChange("size", "")}
                        className="ml-2 text-purple-600 hover:text-purple-800"
                      >
                        ×
                      </button>
                    </span>
                  )}

                  {filters.location && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
                      Location: {filters.location}
                      <button
                        onClick={() => handleFilterChange("location", "")}
                        className="ml-2 text-purple-600 hover:text-purple-800"
                      >
                        ×
                      </button>
                    </span>
                  )}

                  <button
                    onClick={resetFilters}
                    className="text-sm text-purple-600 hover:text-purple-800 hover:underline ml-auto"
                  >
                    Clear all
                  </button>
                </div>
              </div>
            )}

            {/* Pet listings display */}
            {loading ? (
              <div className="flex justify-center p-8">
                <p className="text-gray-600">Updating results...</p>
              </div>
            ) : pets.length === 0 ? (
              <div className="bg-white rounded-lg p-8 text-center">
                <p className="text-gray-600 text-lg">No pets match your current filters. Try adjusting your criteria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {pets.map((pet) => (
                  <PetCard
                    key={pet.id}
                    id={pet.id}
                    name={pet.name}
                    category={pet.category}
                    location={pet.location}
                    gender={pet.gender}
                    breed={pet.breed}
                    age={pet.age}
                    size={pet.size}
                    image={pet.images && pet.images.length > 0 ? pet.images[0] : "/placeholder.jpg"}
                    description={pet.additionalInfo}
                    isNew={isNewPet(pet.createdAt)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function to determine if a pet listing is new (within the last 7 days)
function isNewPet(createdAt: string): boolean {
  const created = new Date(createdAt);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - created.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= 7;
}
