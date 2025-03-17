"use client";
import Image from "next/image";
import usalogo from "../../../public/usalogo.svg";
import { useState } from "react";

interface Pet {
  id: string;
  name: string;
  breed: string;
  age: string;
  color: string;
  weight: string;
  height: string;
  gender: string;
  location: string;
  images: string[];
  mainImage: string;
  story: string;
  vaccination: {
    week8: string;
    week14: string;
    week22: string;
  };
  traits: string[];
  distance?: string;
  country?: string;
}

export default function PetProfile({ pet }: { pet: Pet }) {
  // State to track the current displayed main image
  const [currentImage, setCurrentImage] = useState(pet.mainImage);
  // State to track favorite status
  const [isFavorite, setIsFavorite] = useState(false);
  
  // Function to handle image click
  const handleImageClick = (imageSrc: string) => {
    setCurrentImage(imageSrc);
  };

  // Function to toggle favorite status
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  return (
    <div className="container mx-auto p-6 max-w-[1100px]">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold">Hi Human !</h1>
      </div>
      
      <div className="flex items-center gap-4 mb-4">
        <div className="w-[70px] h-[70px] rounded-full overflow-hidden border-2 border-gray-200">
          <Image
            src={pet.mainImage}
            alt={pet.name}
            width={70}
            height={70}
            className="object-cover w-full h-full"
            priority
          />
        </div>
        <div>
          <h2 className="text-xl font-semibold">{pet.name}</h2>
          <p className="text-gray-600">Pet ID: {pet.id}</p>
        </div>
        <div className="ml-auto">
          <button className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-6 py-2 rounded-md transition duration-200">
            Adopt Pet
          </button>
        </div>
      </div>

      {/* Location */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-1">
          <Image src={usalogo} alt="Country" width={24} height={16} />
          <span>United States Of America</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600 ml-6">
          <span>{pet.location} {pet.distance && `(${pet.distance} away)`}</span>
        </div>
      </div>

      {/* Main content area with image and info */}
      <div className="flex gap-6 mb-2">
        {/* Main image container with gallery below it */}
        <div className="relative flex-grow flex flex-col items-center">
          {/* Main image */}
          <div className="w-full mb-3 relative">
            <Image
              src={currentImage}
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
              <span className="text-xl">
                {isFavorite ? '❤️' : '🤍'}
              </span>
            </button>
          </div>
          
          {/* Pet Gallery - centered below main image */}
          <div className="flex gap-3 mb-4">
            {/* Include the main image in the gallery */}
            <div 
              onClick={() => handleImageClick(pet.mainImage)}
              className={`cursor-pointer rounded-lg border-2 ${currentImage === pet.mainImage ? 'border-purple-500' : 'border-gray-200'} transition-all duration-200 hover:opacity-90 w-[120px] h-[90px] overflow-hidden`}
            >
              <Image
                src={pet.mainImage}
                alt={`${pet.name} Main Image`}
                width={120}
                height={90}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Other gallery images */}
            {pet.images.map((img, index) => (
              <div
                key={index}
                onClick={() => handleImageClick(img)}
                className={`cursor-pointer rounded-lg border-2 ${currentImage === img ? 'border-purple-500' : 'border-gray-200'} transition-all duration-200 hover:opacity-90 w-[120px] h-[90px] overflow-hidden`}
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
        </div>
        
        {/* Right sidebar with pet info */}
        <div className="w-[350px]">
          {/* Story section */}
          <div className="border border-gray-200 rounded-lg p-4 bg-white mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{pet.name} Story</h3>
            <p className="text-gray-600 text-sm">{pet.story}</p>
          </div>
          
          {/* Traits section */}
          <div className="bg-white p-4 rounded-lg">
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <span className="text-gray-500">👶</span> Can live with other children of any age
              </li>
              <li className="flex items-center gap-2">
                <span className="text-gray-500">💉</span> Vaccinated
              </li>
              <li className="flex items-center gap-2">
                <span className="text-gray-500">🏠</span> House-Trained
              </li>
              <li className="flex items-center gap-2">
                <span className="text-gray-500">⚕️</span> Neutered
              </li>
              <li className="flex items-center gap-2">
                <span className="text-gray-500">📋</span> Shots up to date
              </li>
              <li className="flex items-center gap-2">
                <span className="text-gray-500">🔍</span> Microchipped
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Pet Details (Small Cards) */}
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
          <p className="text-sm font-medium">{pet.age}</p>
        </div>
        <div className="flex flex-col items-center p-3 border rounded-lg bg-white">
          <span className="text-purple-600 mb-1">🎨</span>
          <p className="text-gray-500 text-xs">Color</p>
          <p className="text-sm font-medium">{pet.color}</p>
        </div>
        <div className="flex flex-col items-center p-3 border rounded-lg bg-white">
          <span className="text-purple-600 mb-1">⚖️</span>
          <p className="text-gray-500 text-xs">Weight</p>
          <p className="text-sm font-medium">{pet.weight}</p>
        </div>
        <div className="flex flex-col items-center p-3 border rounded-lg bg-white">
          <span className="text-purple-600 mb-1">📏</span>
          <p className="text-gray-500 text-xs">Height</p>
          <p className="text-sm font-medium">{pet.height}</p>
        </div>
      </div>

      {/* Vaccination Table */}
      <div className="mb-6">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left border">Age</th>
              <th className="p-3 text-center border">8th Week</th>
              <th className="p-3 text-center border">14th Week</th>
              <th className="p-3 text-center border">22th Week</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-3 border font-medium text-purple-600">Vaccinated</td>
              <td className="p-3 border text-center">
                <div>Bordetella</div>
                <div className="font-medium">Match</div>
                <div>Leptospirosis</div>
              </td>
              <td className="p-3 border text-center">
                <div>Bordetella,Canine Anfluanza</div>
                <div className="font-medium">Match</div>
                <div>Leptospirosis</div>
              </td>
              <td className="p-3 border text-center">
                <div>Bordetella,Canine Anfluanza</div>
                <div className="font-medium">Match</div>
                <div>Leptospirosis</div>
              </td>
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
