"use client";

import { useState } from "react";
import { useUser, SignOutButton, SignedOut, SignInButton } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";

const Header = () => {
  const { user } = useUser();
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-white shadow-md sticky z-10 top-0">
      <div className="container mx-auto flex justify-between items-center h-18 px-4">
        <div className="flex items-center space-x-3">
          <Image width={50} height={50} src="/Logo-sub.png" alt="logo" />
          <h1 className="text-3xl font-extrabold">
            <span className="text-primary">Hearts &</span>
            <span className="text-[#2E256F]">Paws</span>
          </h1>
        </div>

        <nav className="hidden md:flex space-x-6">
          <Link href="/adopt" className="text-[#2E256F] hover:text-purple-500 font-semibold">Adopt</Link>
          <Link href="/rehoming" className="text-[#2E256F] hover:text-purple-500 font-semibold">Rehome</Link>
          <Link href="/services" className="text-[#2E256F] hover:text-purple-500 font-semibold">Services</Link>
          <Link href="/about" className="text-[#2E256F] hover:text-purple-500 font-semibold">About Us</Link>
        </nav>

        <div className="flex items-center space-x-4 relative">
          <Button className="bg-[#675bc8] hover:bg-[#5d4fc4] rounded-full">
            <Bell size={40} />
          </Button>

          {/* Auth Controls */}
          {!user ? (
          <SignedOut>
          <SignInButton mode="modal">
            <Button className="bg-[#675bc8] hover:bg-[#5d4fc4] rounded-full p-2">Login | Register</Button>
          </SignInButton>
        </SignedOut>
          ) : (
            <div className="relative">
              <Image
                src={user.imageUrl}
                alt="Profile"
                width={40}
                height={40}
                className="rounded-full cursor-pointer"
                onClick={() => setOpen(!open)}
              />
              {open && (
                <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md p-2">
                  <Link href="/profile" className="block px-4 py-2 hover:bg-gray-100">
                    View Profile
                  </Link>
                  <SignOutButton>
                    <button className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100">
                      Logout
                    </button>
                  </SignOutButton>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
