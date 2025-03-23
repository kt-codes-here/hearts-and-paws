"use client";
import Image from "next/image";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

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
  const { user: currentUser, isLoaded: userLoaded } = useUser();
  const defaultImage = '../../../public/1-section.png';
  const [currentImage, setCurrentImage] = useState(pet.mainImage || defaultImage);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedPet, setEditedPet] = useState({ ...pet });
  const [images, setImages] = useState(pet.images || []);
  const [vaccinations, setVaccinations] = useState({
    week8: pet.vaccination?.week8 || "",
    week14: pet.vaccination?.week14 || "",
    week22: pet.vaccination?.week22 || "",
  });
  const router = useRouter();

  const isOwner = useMemo(() => {
    if (!userLoaded || !currentUser || !pet.owner) {
      return false;
    }
    
    return currentUser.primaryEmailAddress?.emailAddress === pet.owner.email;
  }, [currentUser, userLoaded, pet.owner]);

  useEffect(() => {
    console.log("Current pet data:", pet);
  }, [pet]);

  const handleImageClick = (imageSrc: string) => {
    setCurrentImage(imageSrc || defaultImage);
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const toggleEditMode = () => {
    if (isEditing) {
      // Reset changes if canceling edit
      setEditedPet({ ...pet });
      setImages(pet.images || []);
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedPet(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTraitChange = (index: number, value: string) => {
    const updatedTraits = [...editedPet.traits];
    updatedTraits[index] = value;
    setEditedPet(prev => ({
      ...prev,
      traits: updatedTraits,
    }));
  };

  const removeTrait = (index: number) => {
    const updatedTraits = editedPet.traits.filter((_, i) => i !== index);
    setEditedPet(prev => ({
      ...prev,
      traits: updatedTraits,
    }));
  };

  const addTrait = () => {
    // Create a dropdown to select from available traits
    const availableTraits = [
      "Good with dogs",
      "Good with cats",
      "Good with kids",
      "House trained", 
      "Microchipped",
      "Shots up to date",
      "Special needs",
      "Has behavioral issues",
      "Purebred"
    ];
    
    // Filter out traits that are already selected
    const unusedTraits = availableTraits.filter(trait => !editedPet.traits.includes(trait));
    
    if (unusedTraits.length === 0) {
      alert("All available traits have already been added.");
      return;
    }
    
    // Add the first available trait
    setEditedPet(prev => ({ 
      ...prev, 
      traits: [...prev.traits, unusedTraits[0]]
    }));
  };

  const handleRehomeInfoChange = (field: string, value: string) => {
    if (editedPet.rehomeInfo) {
      setEditedPet(prev => ({
        ...prev,
        rehomeInfo: {
          ...prev.rehomeInfo!,
          [field]: value,
        },
      }));
    }
  };

  const handleVaccinationChange = (period: 'week8' | 'week14' | 'week22', value: string) => {
    setVaccinations(prev => ({
      ...prev,
      [period]: value,
    }));
  };

  const handleShotsChange = (value: boolean) => {
    setEditedPet(prev => ({
      ...prev,
      shotsUpToDate: value,
    }));
  };

  // Function to handle image reordering
  const moveImage = (index: number, direction: 'up' | 'down') => {
    const newImages = [...images];
    if (direction === 'up' && index > 0) {
      [newImages[index], newImages[index - 1]] = [newImages[index - 1], newImages[index]];
    } else if (direction === 'down' && index < newImages.length - 1) {
      [newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]];
    }
    setImages(newImages);
  };

  // Function to remove an image
  const removeImage = async (index: number) => {
    const imageToRemove = images[index];
    
    // Remove from UI immediately for better UX
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    
    if (currentImage === images[index]) {
      setCurrentImage(newImages[0] || defaultImage);
    }
    
    // Delete from storage
    try {
      const response = await fetch('/api/delete-gcp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUrl: imageToRemove,
          petId: pet.id
        }),
      });
      
      if (!response.ok) {
        // If deletion fails, revert the UI change
        console.error('Failed to delete image from storage');
        setImages(images); // Restore original images array
        alert('Failed to delete image. Please try again.');
      }
    } catch (error) {
      console.error('Error calling delete API:', error);
      // If there's an exception, also revert the UI
      setImages(images);
      alert('Failed to delete image. Please try again.');
    }
  };

  // Function to add new images
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      // Upload image to GCP using your existing endpoint
      const response = await fetch('/api/upload-gcp', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) throw new Error('Image upload failed');
      
      const { imageUrl } = await response.json();
      setImages([...images, imageUrl]);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    }
  };

  // Function to save changes
  const saveChanges = async () => {
    try {
      // Create a mapping between trait strings and the corresponding boolean fields
      const traitMapping = {
        "Good with dogs": "goodWithDogs",
        "Good with cats": "goodWithCats", 
        "Good with kids": "goodWithKids",
        "House trained": "houseTrained",
        "Microchipped": "microchipped",
        "Shots up to date": "shotsUpToDate",
        "Special needs": "specialNeeds",
        "Has behavioral issues": "behavioralIssues",
        "Purebred": "purebred"
      };
      
      // Create boolean fields based on the current traits
      const traitBooleans = {};
      
      // Set all traits to false by default
      Object.values(traitMapping).forEach(field => {
        traitBooleans[field] = false;
      });
      
      // Then set the ones that are present in the traits list to true
      editedPet.traits.forEach(trait => {
        const fieldName = traitMapping[trait];
        if (fieldName) {
          traitBooleans[fieldName] = true;
        }
      });
      
      console.log("Traits being updated:", editedPet.traits);
      console.log("Trait booleans:", traitBooleans);
      
      // Format the data directly matching the database schema fields
      const updatedPet = {
        // Basic info
        name: editedPet.name,
        age: parseInt(String(editedPet.age)), 
        size: editedPet.size,
        gender: editedPet.gender,
        breed: editedPet.breed,
        colors: editedPet.color, // Use color for colors field
        
        // Include all boolean fields from traits
        ...traitBooleans,
        
        // Map address fields to match the schema
        addressLine1: editedPet.address.line1,
        addressLine2: editedPet.address.line2 || null,
        city: editedPet.address.city,
        postcode: editedPet.address.postcode,
        
        // Story field
        additionalInfo: editedPet.story,
        
        // Updated images array
        images: images,
        
        // Rehome info as a separate structure
        rehomeInfo: editedPet.rehomeInfo
      };
      
      console.log("Sending update data:", JSON.stringify(updatedPet));
      
      const response = await fetch(`/api/pets/${pet.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPet),
      });
      
      const responseData = await response.json();
      console.log("Response from server:", responseData);
      
      if (!response.ok) {
        throw new Error(responseData.error || "Failed to update pet");
      }
      
      alert('Pet profile updated successfully!');
      
      // Force a hard refresh with no caching to ensure updated data is fetched
      window.location.href = window.location.pathname + '?t=' + new Date().getTime();
    } catch (error) {
      console.error('Error updating pet:', error);
      alert(`Update failed: ${error.message}`);
    }
  };

  const refreshData = async () => {
    try {
      // Fetch fresh data from API
      const response = await fetch(`/api/pets/${pet.id}?t=${Date.now()}`, {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' }
      });
      
      if (!response.ok) {
        throw new Error("Failed to refresh data");
      }
      
      const freshData = await response.json();
      console.log("Fresh data from database:", freshData);
      
      // Show alert with some of the updated data
      alert(`Latest data from database:\nName: ${freshData.name}\nBreed: ${freshData.breed}\nAge: ${freshData.age}\nColors: ${freshData.colors}`);
    } catch (error) {
      console.error("Error refreshing data:", error);
      alert("Failed to refresh data");
    }
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
          {isEditing ? (
            <input
              type="text"
              name="name"
              value={editedPet.name}
              onChange={handleInputChange}
              className="text-xl font-semibold w-full p-2 border rounded-md focus:ring-2 focus:ring-purple-500"
              placeholder="Pet Name"
            />
          ) : (
            <h2 className="text-xl font-semibold">{pet.name}</h2>
          )}
          <p className="text-gray-600">Listed by: {pet.owner.name}</p>
        </div>
        <div className="ml-auto flex gap-2">
          {isOwner && (
            <button 
              onClick={toggleEditMode}
              className={`${isEditing 
                ? "bg-gray-500 hover:bg-gray-600" 
                : "bg-blue-600 hover:bg-blue-700"} 
                text-white font-medium px-6 py-2 rounded-md transition duration-200`}
            >
              {isEditing ? "Cancel Edit" : "Edit Profile"}
            </button>
          )}
          
          {isOwner && isEditing && (
            <button 
              onClick={saveChanges}
              className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2 rounded-md transition duration-200"
            >
              Save Changes
            </button>
          )}
          
          {!isEditing && (
            <button className="bg-[#675bc8] hover:bg-[#5245b9] text-white font-medium px-6 py-2 rounded-md transition duration-200">
              Adopt Pet
            </button>
          )}
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
              alt={isEditing ? editedPet.name : pet.name}
              width={600}
              height={400}
              className="rounded-lg w-full h-auto"
            />
            {!isEditing && (
              <button 
                onClick={toggleFavorite}
                className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md hover:shadow-lg transition-all duration-200"
                aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
              >
                <span className="text-xl">{isFavorite ? '❤️' : '🤍'}</span>
              </button>
            )}
          </div>
          
          {/* Gallery with Edit Controls */}
          {images.length > 0 && (
            <div className="flex flex-wrap gap-3 mb-4">
              {images.map((img, index) => (
                <div
                  key={index}
                  className={`relative cursor-pointer rounded-lg border-2 ${
                    currentImage === img ? 'border-purple-500' : 'border-gray-200'
                  } transition-all duration-200 hover:opacity-90 w-[120px] h-[90px] overflow-hidden`}
                >
                  <div onClick={() => handleImageClick(img)}>
                    <Image
                      src={img}
                      alt={`${isEditing ? editedPet.name : pet.name} Image ${index + 1}`}
                      width={120}
                      height={90}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {isEditing && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center gap-1 opacity-0 hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => moveImage(index, 'up')} 
                        disabled={index === 0}
                        className="text-white bg-gray-700 p-1 rounded-full disabled:opacity-50"
                      >
                        ↑
                      </button>
                      <button 
                        onClick={() => moveImage(index, 'down')} 
                        disabled={index === images.length - 1}
                        className="text-white bg-gray-700 p-1 rounded-full disabled:opacity-50"
                      >
                        ↓
                      </button>
                      <button 
                        onClick={() => removeImage(index)}
                        className="text-white bg-red-700 p-1 rounded-full"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>
              ))}
              
              {isEditing && (
                <div className="w-[120px] h-[90px] border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-50">
                  <label className="cursor-pointer w-full h-full flex items-center justify-center">
                    <span className="text-3xl text-gray-400">+</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleImageUpload} 
                    />
                  </label>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Right sidebar */}
        <div className="w-[350px]">
          {/* Traits section with edit capability */}
          {(pet.traits.length > 0 || isEditing) && (
            <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Traits & Characteristics</h3>
              {isEditing ? (
                <div className="space-y-3">
                  {editedPet.traits.map((trait, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="text-purple-500">•</span>
                      <select
                        value={trait}
                        onChange={(e) => handleTraitChange(index, e.target.value)}
                        className="flex-1 p-2 border rounded-md focus:ring-purple-500 focus:border-purple-500"
                      >
                        <option value="Good with dogs">Good with dogs</option>
                        <option value="Good with cats">Good with cats</option>
                        <option value="Good with kids">Good with kids</option>
                        <option value="House trained">House trained</option>
                        <option value="Microchipped">Microchipped</option>
                        <option value="Shots up to date">Shots up to date</option>
                        <option value="Special needs">Special needs</option>
                        <option value="Has behavioral issues">Has behavioral issues</option>
                        <option value="Purebred">Purebred</option>
                      </select>
                      <button
                        onClick={() => removeTrait(index)}
                        className="text-red-500 p-1"
                        type="button"
                        aria-label="Remove trait"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={addTrait}
                    className="mt-2 bg-purple-100 text-purple-700 px-3 py-1 rounded-md flex items-center gap-1"
                    type="button"
                  >
                    <span>+</span> Add Trait
                  </button>
                </div>
              ) : (
                <ul className="space-y-3">
                  {pet.traits.map((trait, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <span className="text-purple-500">•</span> {trait}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Rehoming Info with edit capability */}
          {(pet.rehomeInfo || isEditing) && (
            <div className="border border-gray-200 rounded-lg p-4 bg-white">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Rehoming Information</h3>
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Reason:
                    </label>
                    <textarea
                      value={editedPet.rehomeInfo?.reason || ""}
                      onChange={(e) => handleRehomeInfoChange("reason", e.target.value)}
                      className="w-full p-2 border rounded-md focus:ring-purple-500 focus:border-purple-500"
                      rows={3}
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Available for:
                    </label>
                    <select
                      value={editedPet.rehomeInfo?.durationToKeepPet || ""}
                      onChange={(e) => handleRehomeInfoChange("durationToKeepPet", e.target.value)}
                      className="w-full p-2 border rounded-md focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="">Select duration</option>
                      <option value="1-2 weeks">1-2 weeks</option>
                      <option value="3-4 weeks">3-4 weeks</option>
                      <option value="1-2 months">1-2 months</option>
                      <option value="3+ months">3+ months</option>
                      <option value="Indefinitely">Indefinitely</option>
                    </select>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-gray-600 mb-2">Reason: {pet.rehomeInfo?.reason}</p>
                  <p className="text-gray-600 mb-2">Available for: {pet.rehomeInfo?.durationToKeepPet}</p>
                  <p className="text-gray-600">
                    Listed on: {pet.rehomeInfo?.listedDate ? new Date(pet.rehomeInfo.listedDate).toLocaleDateString() : "N/A"}
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Story section - Add edit capability */}
      {(pet.story || isEditing) && (
        <div className="border border-gray-200 rounded-lg p-6 bg-white mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">{isEditing ? editedPet.name : pet.name}'s Story</h3>
          {isEditing ? (
            <textarea
              name="story"
              value={editedPet.story}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              rows={5}
            ></textarea>
          ) : (
            <p className="text-gray-600 leading-relaxed text-md">{pet.story}</p>
          )}
        </div>
      )}

      {/* Pet Details Cards with edit capability */}
      <div className="grid grid-cols-6 gap-4 mb-6">
        <div className="flex flex-col items-center p-3 border rounded-lg bg-white">
          <span className="text-purple-600 mb-1">🚻</span>
          <p className="text-gray-500 text-xs">Gender</p>
          {isEditing ? (
            <select
              name="gender"
              value={editedPet.gender}
              onChange={handleInputChange}
              className="text-sm w-full text-center p-1 border rounded-md"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          ) : (
            <p className="text-sm font-medium">{pet.gender}</p>
          )}
        </div>
        <div className="flex flex-col items-center p-3 border rounded-lg bg-white">
          <span className="text-purple-600 mb-1">🐾</span>
          <p className="text-gray-500 text-xs">Breed</p>
          {isEditing ? (
            <input
              type="text"
              name="breed"
              value={editedPet.breed}
              onChange={handleInputChange}
              className="text-sm w-full text-center p-1 border rounded-md"
            />
          ) : (
            <p className="text-sm font-medium">{pet.breed}</p>
          )}
        </div>
        <div className="flex flex-col items-center p-3 border rounded-lg bg-white">
          <span className="text-purple-600 mb-1">⏳</span>
          <p className="text-gray-500 text-xs">Age</p>
          {isEditing ? (
            <input
              type="number"
              name="age"
              value={editedPet.age}
              onChange={handleInputChange}
              min="0"
              className="text-sm w-full text-center p-1 border rounded-md"
            />
          ) : (
            <p className="text-sm font-medium">{pet.age} years</p>
          )}
        </div>
        <div className="flex flex-col items-center p-3 border rounded-lg bg-white">
          <span className="text-purple-600 mb-1">🎨</span>
          <p className="text-gray-500 text-xs">Color</p>
          {isEditing ? (
            <input
              type="text"
              name="color"
              value={editedPet.color}
              onChange={handleInputChange}
              className="text-sm w-full text-center p-1 border rounded-md"
            />
          ) : (
            <p className="text-sm font-medium">{pet.color}</p>
          )}
        </div>
        <div className="flex flex-col items-center p-3 border rounded-lg bg-white">
          <span className="text-purple-600 mb-1">📏</span>
          <p className="text-gray-500 text-xs">Size</p>
          {isEditing ? (
            <select
              name="size"
              value={editedPet.size}
              onChange={handleInputChange}
              className="text-sm w-full text-center p-1 border rounded-md"
            >
              <option value="Small">Small</option>
              <option value="Medium">Medium</option>
              <option value="Large">Large</option>
              <option value="Extra Large">Extra Large</option>
            </select>
          ) : (
            <p className="text-sm font-medium">{pet.size}</p>
          )}
        </div>
        <div className="flex flex-col items-center p-3 border rounded-lg bg-white">
          <span className="text-purple-600 mb-1">📍</span>
          <p className="text-gray-500 text-xs">City</p>
          {isEditing ? (
            <input
              type="text"
              name="address.city"
              value={editedPet.address.city}
              onChange={(e) => {
                setEditedPet(prev => ({
                  ...prev,
                  address: {
                    ...prev.address,
                    city: e.target.value
                  }
                }));
              }}
              className="text-sm w-full text-center p-1 border rounded-md"
            />
          ) : (
            <p className="text-sm font-medium">{pet.address.city}</p>
          )}
        </div>
      </div>

      {/* Vaccination Table with edit capability */}
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
              <td className="p-3 border font-medium text-purple-600">
                {isEditing ? (
                  <select
                    value={editedPet.shotsUpToDate ? "true" : "false"}
                    onChange={(e) => handleShotsChange(e.target.value === "true")}
                    className="p-1 border rounded-md"
                  >
                    <option value="true">Vaccinated</option>
                    <option value="false">Not vaccinated</option>
                  </select>
                ) : (
                  pet.shotsUpToDate ? "Vaccinated" : "Not vaccinated"
                )}
              </td>
              <td className="p-3 border text-center">
                {isEditing ? (
                  <input
                    type="text"
                    value={vaccinations.week8}
                    onChange={(e) => handleVaccinationChange("week8", e.target.value)}
                    className="w-full p-1 text-center border rounded-md"
                  />
                ) : (
                  pet.vaccination.week8
                )}
              </td>
              <td className="p-3 border text-center">
                {isEditing ? (
                  <input
                    type="text"
                    value={vaccinations.week14}
                    onChange={(e) => handleVaccinationChange("week14", e.target.value)}
                    className="w-full p-1 text-center border rounded-md"
                  />
                ) : (
                  pet.vaccination.week14
                )}
              </td>
              <td className="p-3 border text-center">
                {isEditing ? (
                  <input
                    type="text"
                    value={vaccinations.week22}
                    onChange={(e) => handleVaccinationChange("week22", e.target.value)}
                    className="w-full p-1 text-center border rounded-md"
                  />
                ) : (
                  pet.vaccination.week22
                )}
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

      {/* Address information - make editable */}
      {isEditing && (
        <div className="border border-gray-200 rounded-lg p-6 bg-white mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Address Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address Line 1
              </label>
              <input
                type="text"
                name="address.line1"
                value={editedPet.address.line1}
                onChange={(e) => {
                  setEditedPet(prev => ({
                    ...prev,
                    address: {
                      ...prev.address,
                      line1: e.target.value
                    }
                  }));
                }}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address Line 2 (Optional)
              </label>
              <input
                type="text"
                name="address.line2"
                value={editedPet.address.line2 || ''}
                onChange={(e) => {
                  setEditedPet(prev => ({
                    ...prev,
                    address: {
                      ...prev.address,
                      line2: e.target.value
                    }
                  }));
                }}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                type="text"
                name="address.city"
                value={editedPet.address.city}
                onChange={(e) => {
                  setEditedPet(prev => ({
                    ...prev,
                    address: {
                      ...prev.address,
                      city: e.target.value
                    }
                  }));
                }}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Postcode
              </label>
              <input
                type="text"
                name="address.postcode"
                value={editedPet.address.postcode}
                onChange={(e) => {
                  setEditedPet(prev => ({
                    ...prev,
                    address: {
                      ...prev.address,
                      postcode: e.target.value
                    }
                  }));
                }}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
