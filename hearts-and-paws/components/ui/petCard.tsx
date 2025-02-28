import Link from "next/link";
import Image from "next/image";

export function PetCard({ name, location, gender, breed, age, size, image, isNew }:{ 
    name: string; 
    location: string; 
    gender: string; 
    breed: string; 
    age: string; 
    size: string; 
    image: string; 
    isNew?: boolean; 
  }) {
    return (
      <div className="bg-white shadow-lg rounded-lg p-4 w-80 relative">
        {isNew && <div className="absolute top-2 left-2 bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded-full">New</div>}
        <Image src={image} alt={name} width={320} height={200} className="rounded-md" />
        <h4 className="text-2xl font-bold flex items-center mt-3">{name}</h4>
        <p className="text-green-600 font-semibold flex items-center my-3">📍 {location}</p>
        <div className="grid grid-cols-2 justify-items-start gap-5 mt-3">
        <p className="text-gray-700"><span className="font-semibold">Gender:</span> <span className="bg-textBackground px-2 rounded-xl">{gender}</span></p>
        <p className="text-gray-700"><span className="font-semibold">Breed:</span> <span className="bg-textBackground px-2 rounded-xl">{breed}</span></p>
        <p className="text-gray-700"><span className="font-semibold">Age:</span> <span className="bg-textBackground px-2 rounded-xl">{age}</span></p>
        <p className="text-gray-700"><span className="font-semibold">Size:</span> <span className="bg-textBackground px-2 rounded-xl">{size}</span></p>
        </div>
        <Link href={`/adopt/${name.toLowerCase()}`} className="text-purple-600 border border-purple-600 px-4 py-2 rounded-md mt-3 block text-center">
          More Info
        </Link>
      </div>
    );
  }