import Link from "next/link";
import Image from "next/image";

interface PetCardProps {
  name: string;
  location: string;
  gender: string;
  breed: string;
  age: string;
  size: string;
  image: string;
  description?: string;
  isNew?: boolean;
}

export function PetCard({
  name,
  location,
  gender,
  breed,
  age,
  size,
  image,
  description,
  isNew = false,
}: PetCardProps) {
  return (
    <div className="bg-white shadow-lg rounded-lg w-80 relative p-4">
      {/* "New" Badge */}
      {isNew && (
        <div className="absolute top-2 left-2 bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded-full">
          New
        </div>
      )}

      {/* Image Container with Fixed Height */}
      <div className="w-full h-48 overflow-hidden rounded-md">
        <Image
          src={image}
          alt={name}
          width={320}
          height={200}
          className="object-cover w-full h-full"
        />
      </div>

      {/* Pet Name */}
      <h4 className="text-xl font-bold mt-3">{name.toUpperCase()}</h4>

      {/* Location */}
      <p className="text-green-600 font-semibold my-2">📍 {location}</p>

      {/* Pet Info Grid */}
      <div className="grid grid-cols-2 gap-x-2 gap-y-5 my-5 text-sm">
        <p className="text-gray-700">
          <span className="font-bold">Gender:</span> <span className="px-3 py-1 text-right  bg-purple-100 text-purple-900  rounded-xl">{gender}</span>
        </p>
        <p className="text-gray-700">
          <span className="font-bold">Breed:</span> <span className="px-3  py-1 text-right bg-purple-100 text-purple-900  rounded-xl">{breed}</span>
        </p>
        <p className="text-gray-700">
          <span className="font-bold">Age:</span> <span className="px-3 py-1  text-right bg-purple-100 text-purple-900  rounded-xl">{age+ " " +"Years" }</span>
        </p>
        <p className="text-gray-700">
          <span className="font-bold">Size:</span> <span className="px-3 py-1 text-right bg-purple-100 text-purple-900  rounded-xl">{size}</span>
        </p>
      </div>

      {/* Optional Description */}
      {description && (
        <p className="text-gray-600 font-semibold text-sm my-4 line-clamp-3">
          {description}
        </p>
      )}

      {/* More Info Button */}
      <Link
        href={`/adopt/${name.toLowerCase()}`}
        className="text-purple-600 border border-purple-600 px-4 py-2 rounded-md mt-3 block text-center hover:bg-purple-50 transition-colors"
      >
        More Info
      </Link>
    </div>
  );
}
