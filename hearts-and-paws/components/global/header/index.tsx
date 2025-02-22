import Image from "next/image";
import { Acme } from "next/font/google";
import React from "react";
import { Button } from "@/components/ui/button";
import { Bell, BellDot, BellIcon, User, UserCircle } from "lucide-react";

const acme = Acme({
  weight: "400", // Acme has only one weight
  subsets: ["latin"],
  display: "swap",
});

type Props = {};

const Header = (props: Props) => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto flex justify-between items-center py-2 px-4">
        <div className="flex items-center space-x-3">
          <Image width={50} height={50} src="/Logo-sub.png" alt="logo" />
          {/* <h1 className={`${acme.className} text-primary text-3xl pl-2`}>Hearts & <span className="block">Paws</span> </h1> */}
          {/* <img src='/Logo.png' alt="Hearts & Paws Logo" className="h-10" width="50" height="50" /> */}

          <h1
            className={`${acme.className} text-3xl leading-tight font-extrabold flex flex-col items-start`}
          >
            <span className="text-primary">Hearts &</span>
            <span className="text-[#2E256F] -mt-2">Paws</span>
          </h1>

          <div className="flex space-x-1">
            <Image
              width={25}
              height={25}
              src="/Paw1.png"
              alt="paw1"
              className="relative -top-2"
            />
            <Image
              width={25}
              height={25}
              src="/Paw2.png"
              alt="paw2"
              className="relative top-3"
            />
            <Image
              width={25}
              height={25}
              src="/Paw3.png"
              alt="paw2"
              className="relative -top-2"
            />
            <Image
              width={25}
              height={25}
              src="/Paw4.png"
              alt="paw2"
              className="relative top-4"
            />
          </div>
        </div>
        <nav className="hidden md:flex space-x-6">
          <a href="#" className="text-[#2E256F] hover:text-purple-500 font-semibold">
            Adopt
          </a>
          <a href="#" className="text-[#2E256F] hover:text-purple-500 font-semibold">
            Rehome
          </a>
          <a href="#" className="text-[#2E256F] hover:text-purple-500 font-semibold">
            Services
          </a>
          <a href="#" className="text-[#2E256F] hover:text-purple-500 font-semibold">
            About Us
          </a>
        </nav>
        <div className="hidden md:flex items-center space-x-4">
          <Button className="flex items-center border-2 border-primary bg-white text-primary hover:bg-purple-100 rounded-full">
            <Bell size={50} className="stroke-primary fill-white " />
          </Button>

          <Button className="text-[#5D4FC4] flex gap-x-2 border-primary bg-white border-2 rounded-full p-2 m-2  hover:bg-purple-100">
            <UserCircle />
            Login | Register
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
