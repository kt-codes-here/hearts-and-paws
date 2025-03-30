import { useState } from "react";
import Image from "next/image";

type FilterSidebarProps = {
  filters: {
    category: string;
    breed: string;
    color: string;
    gender: string;
    age: string;
    size: string;
    location: string;
  };
  onFilterChange: (filterType: string, value: string) => void;
  onApplyFilters: () => void;
  onResetFilters: () => void;
};

export default function FilterSidebar({
  filters,
  onFilterChange,
  onApplyFilters,
  onResetFilters,
}: FilterSidebarProps) {
  const [categoryOpen, setCategoryOpen] = useState(true);
  const [sizeOpen, setSizeOpen] = useState(true);
  const [locationOpen, setLocationOpen] = useState(true);
  const [breedOpen, setBreedOpen] = useState(true);
  const [colorOpen, setColorOpen] = useState(false);
  const [genderOpen, setGenderOpen] = useState(false);
  const [ageOpen, setAgeOpen] = useState(false);
  const [ageInputValue, setAgeInputValue] = useState(filters.age || "0");
  const [locationInput, setLocationInput] = useState(filters.location || "");
  const [locationStatus, setLocationStatus] = useState<"idle" | "loading" | "error">("idle");

  // Category options
  const categoryOptions = ["Dog", "Cat"];

  // Size options
  const sizeOptions = ["Small", "Medium", "Large"];

  // Breed options - you can fetch these from the database in the parent component if needed
  const breedOptions = [
    "German Shepherd",
    "Bulldog",
    "Labrador Retriever",
    "Golden Retriever",
    "Beagle",
    "Pit Bull",
    "Shiba Inu",
    "Jack Russell Terrier",
    "Cavalier King Charles Spaniel",
    "Pembroke Welsh Corgi",
    "Newfoundland",
    "Poodle",
    "Rottweiler",
    "Dobermann",
    "Chow Chow",
    "Siberian Husky",
    "DLH", // Domestic Long Hair (cat)
  ];

  const colorOptions = [
    "Golden",
    "Brown",
    "Gray",
    "Black",
    "Red",
    "Bicolor",
    "Brindle",
  ];

  const genderOptions = ["Any", "Female", "Male"];

  // Handle age input change
  const handleAgeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") {
      setAgeInputValue("");
      return;
    }
    
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 20) {
      setAgeInputValue(value);
      onFilterChange("age", value);
    }
  };

  // Handle age slider change
  const handleAgeSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAgeInputValue(value);
    onFilterChange("age", value);
  };

  // Get image path for size option
  const getSizeImagePath = (size: string) => {
    switch (size) {
      case "Small":
        return "/small.svg";
      case "Medium":
        return "/medium.svg";
      case "Large":
        return "/large.svg";
      default:
        return "";
    }
  };

  // Handle location input change
  const handleLocationInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocationInput(value);
  };

  // Handle location input submit (on Enter key)
  const handleLocationKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onFilterChange("location", locationInput);
    }
  };

  // Add this function to your component
  const getApproximateLocationName = (lat: number, lng: number): string => {
    // Simplified reverse geocoding for common US locations
    // This is a very basic approach and won't be accurate for all locations
    
    // Jersey City area
    if (lat >= 40.7 && lat <= 40.8 && lng >= -74.1 && lng <= -74.0) {
      return "Jersey City, NJ";
    }
    
    // New York City area
    if (lat >= 40.65 && lat <= 40.9 && lng >= -74.05 && lng <= -73.9) {
      return "New York City, NY";
    }
    
    // San Francisco area
    if (lat >= 37.7 && lat <= 37.8 && lng >= -122.5 && lng <= -122.35) {
      return "San Francisco, CA";
    }
    
    // Los Angeles area
    if (lat >= 33.9 && lat <= 34.1 && lng >= -118.4 && lng <= -118.2) {
      return "Los Angeles, CA";
    }
    
    // Chicago area
    if (lat >= 41.8 && lat <= 42.0 && lng >= -87.9 && lng <= -87.6) {
      return "Chicago, IL";
    }
    
    // Default fallback
    return "My current location";
  };

  // Then update your geolocation handler:
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setLocationStatus("loading");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        console.log("Coordinates:", lat, lng);
        
        // Try to get a city name based on coordinates
        const cityName = getApproximateLocationName(lat, lng);
        
        setLocationInput(cityName);
        onFilterChange("location", cityName);
        setLocationStatus("idle");
      },
      (error) => {
        console.error("Error getting location:", error);
        let errorMessage = "Unable to retrieve your location";
        
        // Provide more specific error messages based on the error code
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access was denied";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out";
            break;
        }
        
        alert(errorMessage);
        setLocationStatus("error");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  // This is example code for future implementation
  async function reverseGeocode(lat: number, lng: number) {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=YOUR_API_KEY`
      );
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        // Extract city and postal code from results
        let city = "";
        let postalCode = "";
        
        for (const component of data.results[0].address_components) {
          if (component.types.includes("locality")) {
            city = component.long_name;
          }
          if (component.types.includes("postal_code")) {
            postalCode = component.long_name;
          }
        }
        
        return city ? (postalCode ? `${city}, ${postalCode}` : city) : "Location found";
      }
      return "Location found";
    } catch (error) {
      console.error("Error with geocoding:", error);
      return "Location found";
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Category Filter - Pet Type */}
      <div className="border-b border-gray-200">
        <button
          className="flex items-center justify-between w-full p-4 text-left font-medium"
          onClick={() => setCategoryOpen(!categoryOpen)}
        >
          Pet Type
          <svg
            className={`w-5 h-5 transition-transform ${
              categoryOpen ? "transform rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
        {categoryOpen && (
          <div className="p-4 pt-0 flex gap-2">
            {categoryOptions.map((category) => (
              <button
                key={category}
                className={`flex-1 p-1 rounded-lg transition-all ${
                  filters.category === category
                    ? "ring-2 ring-purple-600 scale-105"
                    : "hover:scale-105"
                }`}
                onClick={() => 
                  onFilterChange("category", 
                    filters.category === category ? "" : category
                  )
                }
              >
                <div className="relative w-full aspect-square overflow-hidden">
                  <Image
                    src={category === "Dog" ? "/dogcategory.svg" : "/catcategory.svg"} 
                    alt={category}
                    fill
                    sizes="100px"
                    style={{ objectFit: "contain" }}
                    className={`transition-opacity ${
                      filters.category === category ? "opacity-100" : "opacity-80 hover:opacity-100"
                    }`}
                  />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Location Filter - Updated section */}
      <div className="border-b border-gray-200">
        <button
          className="flex items-center justify-between w-full p-4 text-left font-medium"
          onClick={() => setLocationOpen(!locationOpen)}
        >
          Location
          <svg
            className={`w-5 h-5 transition-transform ${
              locationOpen ? "transform rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
        {locationOpen && (
          <div className="p-4 pt-0 space-y-3">
            <div>
              <label htmlFor="location-input" className="flex items-center text-sm text-gray-600 mb-1">
                City or Zip
                {filters.category && (
                  <span className="ml-2 inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                    {filters.category === "Dog" ? "🐶 Dog" : "🐱 Cat"}
                  </span>
                )}
              </label>
              <div className="relative">
                <input
                  id="location-input"
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-md"
                  placeholder="Ave 11th Fl, New York"
                  value={locationInput}
                  onChange={handleLocationInputChange}
                  onKeyDown={handleLocationKeyDown}
                />
                {locationInput && (
                  <button 
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => {
                      setLocationInput("");
                      onFilterChange("location", "");
                    }}
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
            
            <button
              onClick={handleUseCurrentLocation}
              disabled={locationStatus === "loading"}
              className={`flex items-center font-medium text-sm ${
                locationStatus === "loading" 
                  ? "text-gray-400 cursor-not-allowed" 
                  : locationStatus === "error"
                  ? "text-red-600 hover:text-red-700"
                  : "text-green-600 hover:text-green-700"
              }`}
            >
              {locationStatus === "loading" ? (
                <>
                  <svg 
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-green-600" 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24"
                  >
                    <circle 
                      className="opacity-25" 
                      cx="12" 
                      cy="12" 
                      r="10" 
                      stroke="currentColor" 
                      strokeWidth="4"
                    ></circle>
                    <path 
                      className="opacity-75" 
                      fill="currentColor" 
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Getting location...
                </>
              ) : (
                <>
                  <svg 
                    className="w-5 h-5 mr-1" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" 
                    />
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" 
                    />
                  </svg>
                  Use current location
                </>
              )}
            </button>
            
            {locationStatus === "error" && (
              <p className="text-xs text-red-600">
                There was a problem getting your location. Please try again or enter it manually.
              </p>
            )}
          </div>
        )}
      </div> 

      {/* Size Filter - Without labels */}
      <div className="border-b border-gray-200">
        <button
          className="flex items-center justify-between w-full p-4 text-left font-medium"
          onClick={() => setSizeOpen(!sizeOpen)}
        >
          Size
          <svg
            className={`w-5 h-5 transition-transform ${
              sizeOpen ? "transform rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
        {sizeOpen && (
          <div className="p-4 pt-0">
            <div className="flex justify-between items-end gap-2">
              {sizeOptions.map((size) => {
                // Determine dimensions based on size
                let width, height;
                switch (size) {
                  case "Small":
                    width = 48;
                    height = 66;
                    break;
                  case "Medium":
                    width = 64;
                    height = 82;
                    break;
                  case "Large":
                    width = 80;
                    height = 98;
                    break;
                  default:
                    width = 64;
                    height = 82;
                }
                
                return (
                  <button
                    key={size}
                    className={`flex-1 p-2 flex flex-col items-center justify-end rounded-lg transition-all ${
                      filters.size === size
                        ? "ring-2 ring-purple-600 bg-purple-50"
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => 
                      onFilterChange("size", 
                        filters.size === size ? "" : size
                      )
                    }
                  >
                    <div className="flex items-end justify-center">
                      <Image
                        src={getSizeImagePath(size)}
                        alt={size}
                        width={width}
                        height={height}
                        style={{ objectFit: "contain" }}
                        className={`transition-all ${
                          filters.size === size ? "opacity-100" : "opacity-80 hover:opacity-100"
                        }`}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div> 

      {/* Breed Filter */}
      <div className="border-b border-gray-200">
        <button
          className="flex items-center justify-between w-full p-4 text-left font-medium"
          onClick={() => setBreedOpen(!breedOpen)}
        >
          Breed
          <svg
            className={`w-5 h-5 transition-transform ${
              breedOpen ? "transform rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
        {breedOpen && (
          <div className="p-4 pt-0 max-h-64 overflow-y-auto">
            {breedOptions.map((breed) => (
              <div key={breed} className="mb-2">
                <button
                  className={`block w-full text-left py-2 px-1 rounded ${
                    filters.breed === breed
                      ? "bg-purple-100 text-purple-800 font-medium"
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => onFilterChange("breed", filters.breed === breed ? "" : breed)}
                >
                  {breed}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Color Filter */}
      <div className="border-b border-gray-200">
        <button
          className="flex items-center justify-between w-full p-4 text-left font-medium"
          onClick={() => setColorOpen(!colorOpen)}
        >
          Color
          <svg
            className={`w-5 h-5 transition-transform ${
              colorOpen ? "transform rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
        {colorOpen && (
          <div className="p-4 pt-0">
            {colorOptions.map((color) => (
              <div key={color} className="mb-2 flex items-center">
                <div 
                  className={`w-6 h-6 rounded-full mr-3 border border-gray-300 ${getColorClass(color)}`}
                ></div>
                <button
                  className={`block text-left py-1 rounded ${
                    filters.color === color
                      ? "text-purple-800 font-medium"
                      : ""
                  }`}
                  onClick={() => onFilterChange("color", filters.color === color ? "" : color)}
                >
                  {color}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Gender Filter */}
      <div className="border-b border-gray-200">
        <button
          className="flex items-center justify-between w-full p-4 text-left font-medium"
          onClick={() => setGenderOpen(!genderOpen)}
        >
          Gender
          <svg
            className={`w-5 h-5 transition-transform ${
              genderOpen ? "transform rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
        {genderOpen && (
          <div className="p-4 pt-0">
            {genderOptions.map((gender) => (
              <div key={gender} className="mb-2">
                <button
                  className={`block w-full text-left py-2 px-1 rounded ${
                    filters.gender === gender && gender !== "Any"
                      ? "bg-purple-100 text-purple-800 font-medium"
                      : gender === "Any" && !filters.gender
                      ? "bg-purple-100 text-purple-800 font-medium"
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => {
                    if (gender === "Any") {
                      onFilterChange("gender", "");
                    } else {
                      onFilterChange("gender", filters.gender === gender ? "" : gender);
                    }
                  }}
                >
                  {gender}
                </button>
              </div>
            ))}
          </div>
        )}
      </div> 

      {/* Age Filter - Enhanced with direct input */}
      <div className="border-b border-gray-200">
        <button
          className="flex items-center justify-between w-full p-4 text-left font-medium"
          onClick={() => setAgeOpen(!ageOpen)}
        >
          Age
          <svg
            className={`w-5 h-5 transition-transform ${
              ageOpen ? "transform rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
        {ageOpen && (
          <div className="p-4 pt-0">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm text-gray-600">Up to:</span>
              <input
                type="number"
                min="0"
                max="20"
                value={ageInputValue}
                onChange={handleAgeInputChange}
                className="w-16 p-1 border border-gray-300 rounded text-center"
              />
              <span className="text-sm text-gray-600">years</span>
            </div>
            
            <input
              type="range"
              min="0"
              max="20"
              step="1"
              value={ageInputValue}
              onChange={handleAgeSliderChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <span>0</span>
              <span>5</span>
              <span>10</span>
              <span>15</span>
              <span>20</span>
            </div>
          </div>
        )}
      </div>

      {/* Filter Action Buttons */}
      <div className="p-4 space-y-3">
        {/* Apply Filters Button */}
        <button
          onClick={onApplyFilters}
          className="w-full py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
        >
          Apply your Filter
        </button>
        
        {/* Reset Filters Button - Below Apply Filter button */}
        <button
          onClick={onResetFilters}
          className="w-full py-2.5 text-purple-600 border border-purple-600 rounded-md hover:bg-purple-50 transition-colors"
        >
          Reset All Filters
        </button>
      </div>
    </div>
  );
}

// Helper function to get background color class for color swatches
function getColorClass(color: string): string {
  switch (color.toLowerCase()) {
    case "golden":
      return "bg-amber-200";
    case "brown":
      return "bg-amber-700";
    case "gray":
      return "bg-gray-400";
    case "black":
      return "bg-black";
    case "red":
      return "bg-red-500";
    case "bicolor":
      return "bg-gradient-to-r from-gray-300 to-black";
    case "brindle":
      return "bg-gradient-to-r from-amber-700 to-black";
    default:
      return "bg-white";
  }
} 