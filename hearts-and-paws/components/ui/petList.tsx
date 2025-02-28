"use client";

import { PetCard } from "@/components/ui/petCard";
import { pets } from "@/constant/pets";

export function PetList() {
  return (
    <section className="py-16 px-8 text-center">
      <h2 className="text-3xl font-bold text-gray-900">
        Take a Look at Some of <span className="text-green-600">Our Pets</span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        {pets.map((pet) => (
          <PetCard key={pet.name} {...pet} />
        ))}
      </div>
      <button className="mt-6 px-6 py-3 border border-purple-600 text-purple-600 rounded-md hover:bg-purple-100">
        See more
      </button>
    </section>
  );
}

export default PetList;
