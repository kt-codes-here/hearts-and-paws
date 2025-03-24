"use client";

import PetList from "@/components/ui/petList"; 
import PetServiceStatic from "@/components/global/static/pet-service-static";
import Image from "next/image";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { user, isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      // Save user data first
      fetch("/api/auth/save-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          email: user.emailAddresses?.[0]?.emailAddress,
          firstName: user.firstName,
          lastName: user.lastName,
          profileImage: user.imageUrl,
        }),
      })
        .then((res) => res.json())
        .then(() => {
          // Then fetch the user record to check registration
          return fetch("/api/auth/user");
        })
        .then((res) => res.json())
        .then((userData) => {
          if (!userData.role) {
            router.push("/user-registration");
          } else if (userData.role === 1) {
            router.push("/adopter-dashboard");
          } else if (userData.role === 2) {
            router.push("/rehomer-dashboard");
          } else if (userData.role === 3) {
            router.push("/service-provider-dashboard");
          }
        })
        .catch((err) => console.error("Error saving user:", err));
    }
  }, [isLoaded, isSignedIn, user, router]);

  // Until Clerk is loaded, or if the user is signed in (and waiting for redirect),
  // show a loading state. This prevents the home page from flashing.
  if (!isLoaded) {
    return <div style={{ padding: "2rem", textAlign: "center" }}>Loading...</div>;
  }
  if (isLoaded && isSignedIn) {
    return <div style={{ padding: "2rem", textAlign: "center" }}>Loading...</div>;
  }

  // Render the home page for non-signed in users
  const steps = [
    {
      id: 1,
      icon: "/user-icon.svg",
      text: "Set up your profile (including photos) in minutes",
    },
    {
      id: 2,
      icon: "/home.svg",
      text: "Describe your home and routine so rehomers can see if it's right for their pet",
    },
    {
      id: 3,
      icon: "/search.svg",
      text: "Start your search!",
    },
  ];

  return (
    <div>
      <div className="mx-auto px-4 w-full md:w-9/10 lg:w-9/10 xl:w-9/10">
        <section className="flex flex-col md:flex-row items-center justify-between px-8 py-16 bg-white">
          {/* Left Text Content */}
          <div className="md:w-1/2 text-center md:text-left">
            <h2 className="text-4xl font-bold text-gray-900">Give a New Life to</h2>
            <h3 className="text-3xl font-semibold text-purple-600 mt-2">Hearts & Paws</h3>
            <p className="text-gray-700 mt-4">
              Pet adoption and rehoming are both vital aspects of animal welfare, offering hope and a fresh start to pets in need.
              Open your heart and your home to a shelter pet.
            </p>
            <div className="mt-6 flex gap-4 justify-center md:justify-start">
              <Link href="/pet-listing" className="bg-purple-600 text-white px-6 py-3 rounded-md text-lg hover:bg-purple-700">
                Adopt Now
              </Link>
              <Link href="/rehomer-dashboard" className="border border-purple-600 text-purple-600 px-6 py-3 rounded-md text-lg hover:bg-purple-100">
                Rehome Now
              </Link>
            </div>
          </div>

          {/* Right Image */}
          <div className="md:w-1/2 flex justify-center relative">
            <div className="relative w-[400px] h-[400px]">
              <Image src="/1-section.png" alt="Dog and Cat" fill style={{ objectFit: "contain" }} />
            </div>
          </div>
        </section>

        <section className="py-16 px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900">Adopt or Rehome a Pet in Just</h2>
          <h3 className="text-2xl text-green-600 mt-2">3 Easy Steps</h3>
          <div className="flex flex-col md:flex-row justify-center items-center gap-8 mt-8">
            {steps.map((step) => (
              <div key={step.id} className="flex flex-col items-center bg-white border-2 border-cardBackground shadow-lg rounded-lg p-6 w-80 h-300 relative">
                <div className="absolute -top-6 bg-purple-200 text-purple-800 font-bold rounded-full w-12 h-12 flex items-center justify-center">
                  {step.id}
                </div>
                <Image className="m-4" src={step.icon} alt={`Step ${step.id}`} width={60} height={60} />
                <p className="text-gray-700 mt-4">{step.text}</p>
              </div>
            ))}
          </div>
        </section>
        <PetList />
        <PetServiceStatic />
      </div>
    </div>
  );
}
