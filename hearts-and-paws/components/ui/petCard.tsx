import Link from "next/link";
import Image from "next/image";

type PetCardProps = {
  id: string;
  name: string;
  category?: string;
  location: string;
  gender: string;
  breed: string;
  age: string;
  size: string;
  image: string;
  description?: string;
  isNew?: boolean;
};

export function PetCard({
  id,
  name,
  category,
  location,
  gender,
  breed,
  age,
  size,
  image,
  description,
  isNew = false,
}: PetCardProps) {
  // Trim the description to a consistent length to keep card heights uniform
  const trimDescription = (text: string, maxLength: number = 80) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength);
  };

  const hasLongDescription = (description?.length || 0) > 80;
  const trimmedDescription = trimDescription(description || "");

  return (
    <div className="bg-white shadow-lg rounded-lg w-80 relative p-4 flex flex-col h-[500px]">
      {/* "New" Badge */}
      {isNew && (
        <div className="absolute top-2 left-2 z-10 bg-[#675bc8] text-white text-xs font-bold px-2 py-1 rounded-full">
          New
        </div>
      )}

      {/* Category Badge */}
      {category && (
        <div className="absolute top-2 right-2 z-10 bg-purple-100 text-purple-800 text-xs font-bold px-2 py-1 rounded-full">
          {category === "dog" || category === "Dog" ? "🐶 Dog" : "🐱 Cat"}
        </div>
      )}

      <div className="flex flex-col flex-1 space-y-2">
        {/* Image Container */}
        <div className="aspect-[16/9] w-full relative bg-gray-100 h-36">
          <Image
            src={image || "/placeholder.jpg"}
            alt={`Photo of ${name}`}
            fill
            sizes="320px"
            className="absolute inset-0 w-full h-full object-cover object-center rounded-md"
            priority
            quality={80}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/placeholder.jpg";
            }}
          />
        </div>

        {/* Content Section - reduced spacing */}
        <div className="flex flex-col flex-1 space-y-2">
          {/* Pet Name with Category Tag */}
          <div className="flex items-center">
            <h4 className="text-xl font-bold">{name.toUpperCase()}</h4>
            {category && (
              <span className="ml-2 inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                {category === "dog" || category === "Dog" ? "🐶 Dog" : "🐱 Cat"}
              </span>
            )}
          </div>

          {/* Location */}
          <p className="text-[#0A453A] font-semibold">📍 {location}</p>

          {/* Pet Info Grid - tighter spacing */}
          <div className="grid grid-cols-2 gap-x-2 gap-y-2 text-sm">
            <div className="text-gray-700">
              <span className="font-bold block mb-0.5">Gender:</span>
              <span className="px-2 py-0.5 bg-purple-100 text-purple-900 rounded-xl inline-block">{gender}</span>
            </div>
            <div className="text-gray-700">
              <span className="font-bold block mb-0.5">Breed:</span>
              <span className="px-2 py-0.5 bg-purple-100 text-purple-900 rounded-xl inline-block">{breed}</span>
            </div>
            <div className="text-gray-700">
              <span className="font-bold block mb-0.5">Age:</span>
              <span className="px-2 py-0.5 bg-purple-100 text-purple-900 rounded-xl inline-block">{age}</span>
            </div>
            <div className="text-gray-700">
              <span className="font-bold block mb-0.5">Size:</span>
              <span className="px-2 py-0.5 bg-purple-100 text-purple-900 rounded-xl inline-block">{size}</span>
            </div>
          </div>

          {/* Pet Description */}
          <div className="text-gray-600 text-sm pt-4">
            {trimmedDescription}
            {hasLongDescription && (
              <Link href={`/pet/${id}`} className="text-[#675bc8] hover:text-purple-800 ml-1">
                ... Read More
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* More Info Button */}
      <div className="mt-auto pt-2">
        <Link href={id ? `/pet/${id}` : "#"} className="block">
          <button 
            className="w-full py-2 border border-purple-600 text-purple-600 rounded-lg font-medium hover:bg-purple-50 transition-colors"
            disabled={!id}
          >
            More Info
          </button>
        </Link>
      </div>
    </div>
  );
}
