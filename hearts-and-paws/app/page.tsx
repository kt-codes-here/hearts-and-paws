"use client"; // Ensure this component runs on the client side

import Footer from "@/components/global/footer";
import Header from "@/components/global/header";
import { PetCard } from "@/components/ui/petCard";
import Image from "next/image";
import Link from "next/link";
import { pets } from "../constant/pets";
import PetServiceStatic from "@/components/global/static/pet-service-static";
import { UserButton, SignInButton, SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import { useEffect } from "react";

export function PetList() {
  

  return (
    <section className="py-16 px-8 text-center">
      <h2 className="text-3xl font-bold text-gray-900">Take a Look at Some of <span className="text-green-600">Our Pets</span></h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        {pets.map((pet) => (
          <PetCard key={pet.name} {...pet} />
        ))}
      </div>
      <button className="mt-6 px-6 py-3 border border-purple-600 text-purple-600 rounded-md hover:bg-purple-100">See more</button>
    </section>
  );
}

export default function Home() {

  const { user, isSignedIn } = useUser(); // ✅ Get user data & login status


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


  useEffect(() => {
    if (isSignedIn) {
      fetch("/api/auth/save-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user?.id,
          email: user?.emailAddresses[0]?.emailAddress,
          firstName: user?.firstName,
          lastName: user?.lastName,
          profileImage: user?.imageUrl,
        }),
      })
        .then((res) => res.json())
        .then((data) => console.log("User saved:", data))
        .catch((err) => console.error("Error saving user:", err));
    }
  }, [isSignedIn, user]); 


  
  return (
    <div>
      <Header />

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
              <Link href="/adopt" className="bg-purple-600 text-white px-6 py-3 rounded-md text-lg hover:bg-purple-700">
                Adopt Now
              </Link>
              <Link href="/rehoming" className="border border-purple-600 text-purple-600 px-6 py-3 rounded-md text-lg hover:bg-purple-100">
                Rehome Now
              </Link>
            </div>
          </div>

          {/* Right Image */}
          <div className="md:w-1/2 flex justify-center relative">
            <div className="relative w-[400px] h-[400px]">
              <Image src="/1-section.png" alt="Dog and Cat" layout="fill" objectFit="contain" />
            </div>
          </div>
        </section>

        {/* Clerk Authentication Section
        <section className="py-8 px-8 text-center bg-gray-100 rounded-md">
          <h2 className="text-3xl font-bold text-gray-900">Your Profile</h2>
          <div className="mt-4">
            <SignedIn>
              <UserProfile />
            </SignedIn>

            <SignedOut>
              <SignInButton mode="modal">
                <button className="mt-4 bg-purple-600 text-white px-6 py-3 rounded-md text-lg hover:bg-purple-700">
                  Sign in to Continue
                </button>
              </SignInButton>
            </SignedOut>
          </div>
        </section> */}
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

// ✅ Move user-related UI to a separate client component
function UserProfile() {
  const { user } = useUser();

  return (
    <div className="flex flex-col items-center">
      {user?.imageUrl && (
        <Image src={user.imageUrl} alt="User Profile" width={100} height={100} className="rounded-full border" />
      )}
      <h3 className="text-2xl mt-2">{user?.firstName} {user?.lastName}</h3>
      <p className="text-gray-600">{user?.emailAddresses[0]?.emailAddress}</p>
      <div className="mt-4">
        <UserButton afterSignOutUrl="/" />
      </div>
    </div>
  );
}
