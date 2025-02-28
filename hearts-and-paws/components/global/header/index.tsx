"use client";

import { UserButton, SignInButton, SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { Acme } from "next/font/google";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";

const acme = Acme({ weight: "400", subsets: ["latin"], display: "swap" });

const Header = () => {

  return (
    <header className="bg-white shadow-md sticky z-10 top-0">
      <div className="container mx-auto flex justify-between items-center h-18 px-4">
        <div className="flex items-center space-x-3">
          <Image width={50} height={50} src="/Logo-sub.png" alt="logo" />
          <h1 className={`${acme.className} text-3xl font-extrabold`}>
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

        <div className="flex items-center space-x-4">
          <Button className="bg-[#675bc8] hover:bg-[#5d4fc4] rounded-full">
            <Bell size={40} />
          </Button>

          <SignedOut>
            <SignInButton mode="modal">
              <Button className="bg-[#675bc8] hover:bg-[#5d4fc4] rounded-full p-2">Login | Register</Button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </div>
    </header>
  );
};

export default Header;
