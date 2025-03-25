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
  const [colorOpen, setColorOpen] = useState(false);


  // Category options
  const categoryOptions = ["Dog", "Cat"];

  // Size options
  const sizeOptions = ["Small", "Medium", "Large"];


  const colorOptions = [
    "Golden",
    "Brown",
    "Gray",
    "Black",
    "Red",
    "Bicolor",
    "Brindle",
  ];


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