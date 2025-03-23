"use client";
import Image from "next/image";
import { useState } from "react";

interface Pet {
  id: string;
  name: string;
  breed: string;
  age: number;
  color: string;
  size: string;
  gender: string;
  location: string;
  address: {
    line1: string;
    line2?: string;
    city: string;
    postcode: string;
  };
  images: string[];
  mainImage: string | null;
  story: string;
  vaccination: {
    week8: string;
    week14: string;
    week22: string;
  };
  traits: string[];
  rehomeInfo?: {
    reason: string;
    durationToKeepPet: string;
    listedDate: string;
  };
  owner: {
    name: string;
    email: string;
    profileImage: string | null;
  };
  shotsUpToDate: boolean;
}

export default function PetProfile({ pet }: { pet: Pet }) {
  const defaultImage = '../../../public/1-section.png';
  const [currentImage, setCurrentImage] = useState(pet.mainImage || defaultImage);
  const [isFavorite, setIsFavorite] = useState(false);

  
  const handleImageClick = (imageSrc: string) => {
    setCurrentImage(imageSrc || defaultImage);
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  return (
    <div className="container mx-auto p-6 max-w-[1100px]">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold">Hi Human !</h1>
      </div>
      
      {/* Pet Info Header */}
      <div className="flex items-center gap-4 mb-4">
        <div className="w-[70px] h-[70px] rounded-full overflow-hidden border-2 border-gray-200">
          <Image
            src={pet.owner.profileImage || '/default-profile.png'}
            alt={pet.owner.name}
            width={70}
            height={70}
            className="object-cover w-full h-full"
            priority
          />
        </div>
        <div>
          <h2 className="text-xl font-semibold">{pet.name}</h2>
          <p className="text-gray-600">Listed by: {pet.owner.name}</p>
        </div>
        <div className="ml-auto">
          <button className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-6 py-2 rounded-md transition duration-200">
            Adopt Pet
          </button>
        </div>
      </div>

      {/* Location */}
      <div className="mb-4">
        <div className="flex items-center gap-2 text-gray-600">
          <span>{pet.location}</span>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex gap-6 mb-6">
        {/* Main image and gallery */}
        <div className="relative flex-grow flex flex-col items-center">
          <div className="w-full mb-3 relative">
            <Image
              src={currentImage || defaultImage}
              alt={pet.name}
              width={600}
              height={400}
              className="rounded-lg w-full h-auto"
            />
            <button 
              onClick={toggleFavorite}
              className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md hover:shadow-lg transition-all duration-200"
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <span className="text-xl">{isFavorite ? '❤️' : '🤍'}</span>
            </button>
          </div>
          
          {/* Gallery */}
          {pet.images.length > 0 && (
            <div className="flex gap-3 mb-4">
              {pet.images.map((img, index) => (
                <div
                  key={index}
                  onClick={() => handleImageClick(img)}
                  className={`cursor-pointer rounded-lg border-2 ${
                    currentImage === img ? 'border-purple-500' : 'border-gray-200'
                  } transition-all duration-200 hover:opacity-90 w-[120px] h-[90px] overflow-hidden`}
                >
                  <Image
                    src={img}
                    alt={`${pet.name} Image ${index + 1}`}
                    width={120}
                    height={90}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Right sidebar */}
        <div className="w-[350px]">
          {/* Traits section moved to top of sidebar */}
          {pet.traits.length > 0 && (
            <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Traits & Characteristics</h3>
              <ul className="space-y-3">
                {pet.traits.map((trait, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="text-purple-500">•</span> {trait}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Rehoming Info */}
          {pet.rehomeInfo && (
            <div className="border border-gray-200 rounded-lg p-4 bg-white">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Rehoming Information</h3>
              <p className="text-gray-600 mb-2">Reason: {pet.rehomeInfo.reason}</p>
              <p className="text-gray-600 mb-2">Available for: {pet.rehomeInfo.durationToKeepPet}</p>
              <p className="text-gray-600">
                Listed on: {new Date(pet.rehomeInfo.listedDate).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Story section moved below images */}
      {pet.story && (
        <div className="border border-gray-200 rounded-lg p-6 bg-white mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">{pet.name}'s Story</h3>
          <p className="text-gray-600 leading-relaxed text-md">{pet.story}</p>
        </div>
      )}

      {/* Pet Details Cards */}
      <div className="grid grid-cols-6 gap-4 mb-6">
        <div className="flex flex-col items-center p-3 border rounded-lg bg-white">
          <span className="text-purple-600 mb-1">🚻</span>
          <p className="text-gray-500 text-xs">Gender</p>
          <p className="text-sm font-medium">{pet.gender}</p>
        </div>
        <div className="flex flex-col items-center p-3 border rounded-lg bg-white">
          <span className="text-purple-600 mb-1">🐾</span>
          <p className="text-gray-500 text-xs">Breed</p>
          <p className="text-sm font-medium">{pet.breed}</p>
        </div>
        <div className="flex flex-col items-center p-3 border rounded-lg bg-white">
          <span className="text-purple-600 mb-1">⏳</span>
          <p className="text-gray-500 text-xs">Age</p>
          <p className="text-sm font-medium">{pet.age} years</p>
        </div>
        <div className="flex flex-col items-center p-3 border rounded-lg bg-white">
          <span className="text-purple-600 mb-1">🎨</span>
          <p className="text-gray-500 text-xs">Color</p>
          <p className="text-sm font-medium">{pet.color}</p>
        </div>
        <div className="flex flex-col items-center p-3 border rounded-lg bg-white">
          <span className="text-purple-600 mb-1">📏</span>
          <p className="text-gray-500 text-xs">Size</p>
          <p className="text-sm font-medium">{pet.size}</p>
        </div>
        <div className="flex flex-col items-center p-3 border rounded-lg bg-white">
          <span className="text-purple-600 mb-1">📍</span>
          <p className="text-gray-500 text-xs">City</p>
          <p className="text-sm font-medium">{pet.address.city}</p>
        </div>
      </div>

      {/* Vaccination Table */}
      <div className="mb-6">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left border">Vaccination Status</th>
              <th className="p-3 text-center border">8th Week</th>
              <th className="p-3 text-center border">14th Week</th>
              <th className="p-3 text-center border">22th Week</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-3 border font-medium text-purple-600">{pet.shotsUpToDate === true ? "Vaccinated" : "Not vaccinated"}</td>
              <td className="p-3 border text-center">{pet.vaccination.week8}</td>
              <td className="p-3 border text-center">{pet.vaccination.week14}</td>
              <td className="p-3 border text-center">{pet.vaccination.week22}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Similar Pets Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-center mb-6">Similar Pets</h2>
        <div className="grid grid-cols-4 gap-4">
          {['Lisa', 'Bella', 'Lucy', 'Stella'].map((name, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-gray-200 mb-2 overflow-hidden">
                <Image 
                  src={`/sample${index + 1}.jpg`} 
                  alt={name}
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-medium mb-1">{name}</h3>
              <p className="text-sm text-gray-600 mb-1">{index === 1 ? 'Male' : 'Female'}</p>
              <p className="text-sm text-gray-600 mb-3">Shiba Inu</p>
              <button className="text-sm border border-gray-300 rounded-md px-4 py-1 hover:bg-gray-50">
                More Info
              </button>
            </div>
          ))}
        </div>
      </div>

     
    </div>
  );
}
