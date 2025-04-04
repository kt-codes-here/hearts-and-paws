"use client";

import { useState, useEffect, useRef } from "react";
import { useUser, SignOutButton, SignedOut, SignInButton } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";

const Header = () => {
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  const [userRole, setUserRole] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      fetch("/api/auth/user")
        .then((res) => res.json())
        .then((data) => {
          setUserRole(data.role);
        })
        .catch((err) => console.error("Error fetching user role:", err));
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-white shadow-md sticky z-10 top-0">
      <div className="container mx-auto flex justify-between items-center h-18 px-4">
        <div className="py-4">
          <Link
            href="/"
            className="flex items-center space-x-3"
          >
            <Image
              width={50}
              height={50}
              src="/Logo-sub.png"
              alt="logo"
            />
            <h1 className="text-3xl font-extrabold">
              <span className="text-primary">Hearts &</span>
              <span className="text-[#2E256F]">Paws</span>
            </h1>
          </Link>
        </div>

        <nav className="hidden md:flex space-x-6">
          {userRole === 1 ? (
            // Adopter navigation
            <>
              <Link
                href="/pet-listing"
                className="text-[#2E256F] hover:text-purple-500 font-semibold"
              >
                Adopt
              </Link>
              <Link
                href="/requests"
                className="text-[#2E256F] hover:text-purple-500 font-semibold"
              >
                My Requests
              </Link>
            </>
          ) : userRole === 2 ? (
            // Owner navigation
            <>
              <Link
                href="/rehomer-dashboard"
                className="text-[#2E256F] hover:text-purple-500 font-semibold"
              >
                Rehome
              </Link>
              <Link
                href="/adoption-requests"
                className="text-[#2E256F] hover:text-purple-500 font-semibold"
              >
                Adoption Requests
              </Link>
            </>
          ) : null}

          {/* Common links for both user types */}
          <Link
            href="/services"
            className="text-[#2E256F] hover:text-purple-500 font-semibold"
          >
            Services
          </Link>
          <Link
            href="/about"
            className="text-[#2E256F] hover:text-purple-500 font-semibold"
          >
            About Us
          </Link>
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
            <div className="relative"  ref={menuRef}>
              <Image
                src={user.imageUrl}
                alt="Profile"
                width={40}
                height={40}
                className="rounded-full cursor-pointer"
                onClick={() => setOpen((prev) => !prev)}
              />
              {open && (
                <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md p-2">
                  <Link
                    href="/profile"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    View Profile
                  </Link>
                  <SignOutButton>
                    <button className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100">Logout</button>
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
