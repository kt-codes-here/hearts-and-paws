import { notFound } from "next/navigation";
import PetProfile from "@/components/global/pet-profile";

// Define the Pet interface based on our schema
interface Pet {
  id: string;
  name: string;
  breed: string;
  age: number;
  size: string;
  gender: string;
  color: string;
  location: string;
  images: string[];
  mainImage: string | null;
  story: string;
  additionalInfo?: string;
  shotsUpToDate: boolean;
  address: {
    line1: string;
    line2?: string;
    city: string;
    postcode: string;
  };
  vaccination: {
    week8: string;
    week14: string;
    week22: string;
  };
  owner: {
    name: string;
    email: string;
    profileImage: string | null;
  };
  rehomeInfo?: {
    reason: string;
    durationToKeepPet: string;
    listedDate: string;
  };
  traits: string[];
}

const fetchPetData = async (id: string): Promise<Pet | null> => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/pets/${id}?t=${Date.now()}`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Fetched pet data:", data);
    
    // Transform the data to match the expected format
    const transformedPet: Pet = {
      id: data.id,
      name: data.name,
      breed: data.breed,
      age: Number(data.age),
      size: data.size,
      gender: data.gender,
      color: data.colors, // Make sure this is mapped correctly
      location: `${data.city}, ${data.postcode}`,
      images: data.images.filter(Boolean), // Filter out any empty strings or null values
      mainImage: data.images[0] || null, // Use null instead of empty string
      story: data.additionalInfo || "", // Map the story from additionalInfo
      address: {
        line1: data.addressLine1,
        line2: data.addressLine2 || undefined,
        city: data.city,
        postcode: data.postcode,
      },
      vaccination: {
        week8: data.shotsUpToDate ? "Complete" : "Incomplete",
        week14: data.shotsUpToDate ? "Complete" : "Incomplete",
        week22: data.shotsUpToDate ? "Complete" : "Incomplete",
      },
      shotsUpToDate: data.shotsUpToDate,
      traits: [
        data.goodWithDogs && "Good with dogs",
        data.goodWithCats && "Good with cats",
        data.goodWithKids && "Good with kids",
        data.houseTrained && "House trained",
        data.microchipped && "Microchipped",
        data.shotsUpToDate && "Shots up to date",
        data.specialNeeds && "Special needs",
        data.behavioralIssues && "Has behavioral issues",
        data.purebred && "Purebred",
      ].filter(Boolean) as string[],
      owner: {
        name: data.owner.name,
        email: data.owner.email,
        profileImage: data.owner.profileImage || null, // Use null instead of empty string
      },
      rehomeInfo: data.rehomeInfo ? {
        reason: data.rehomeInfo.reason,
        durationToKeepPet: data.rehomeInfo.durationToKeepPet,
        listedDate: data.rehomeInfo.listedDate,
      } : undefined,
    };

    return transformedPet;
  } catch (error) {
    console.error("Error fetching pet data:", error);
    return null;
  }
};

export default async function PetPage({ params }: { params: { id: string } }) {
  const pet = await fetchPetData(params.id);

  if (!pet) return notFound();

  return (
    <>
      <PetProfile pet={pet} />
    </>
  );
}
