"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PetCard } from "@/components/ui/petCard";

export default function AdoptionDashboard() {
  const [rehomes, setRehomes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  console.log(rehomes)

  useEffect(() => {
    fetch("/api/auth/adoption/rehomes")
      .then((res) => res.json())
      .then((data) => {
        setRehomes(data.rehomes || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching adoption listings:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl font-semibold">Loading adoption listings...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-purple-700 mb-6">
          Available Pets for Adoption
        </h1>
        {rehomes.length === 0 ? (
          <p className="text-gray-600">
            No pets are currently available for adoption.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {rehomes.map((item) => (
              <PetCard
                key={item.id}
                name={item.pet.name}
                location={`${item.pet.city}, ${item.pet.postcode}`}
                gender={item.pet.gender}
                breed={item.pet.breed}
                age={item.pet.age.toString()}
                size={item.pet.size}
                image={
                  item.pet.images && item.pet.images.length > 0
                    ? item.pet.images[0]
                    : "/placeholder.jpg"
                }
                description={item.pet.additionalInfo}
                isNew={false} // Optionally, you can mark new listings here
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
