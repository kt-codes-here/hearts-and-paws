import { notFound } from "next/navigation";
import PetProfile from "@/components/global/pet-profile";
import profilePets from "@/constant/pet-profiles";
import Header from "@/components/global/header";
import Footer from "@/components/global/footer";

const fetchPetData = async (id: string) => {

  return profilePets.find((pet) => pet.id === id) || null;
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