import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  Mail,
  MailIcon,
  MapPinIcon,
  Phone,
  TwitterIcon,
} from "lucide-react";
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-[#F9F9F9]">
      <div className="container px-4 py-8 mx-auto">
        <div className="grid gap-10 md:grid-cols-3">
          <div className="space-y-4">
            <h3 className="mb-4 text-xl text-secondary">How can we help you</h3>
            <a
              href="#"
              className="block text-lg text-[#41349D] hover:opacity-100"
            >
              Adopt a pet
            </a>
            <a
              href="#"
              className="block text-lg text-[#41349D] hover:opacity-100"
            >
              Rehome a Pet
            </a>
            <a
              href="#"
              className="block text-lg text-[#41349D] hover:opacity-100"
            >
              Adopt FAQs
            </a>
            <a
              href="#"
              className="block text-lg text-[#41349D] hover:opacity-100"
            >
              Rehome FAQs
            </a>
          </div>
          <div>
            <h4 className="mb-4 text-xl text-secondary">Contact Us</h4>
            <div className="space-y-4">
              <p className="text-md flex items-center gap-2 text-[#41349D]">
                <MapPinIcon className="w-5 h-5" /> Pace University
              </p>
              <p className="text-md flex items-center gap-2 text-[#41349D]">
                <Phone className="w-5 h-5" /> +1 (555) 123-4567
              </p>
              <p className="text-md flex items-center gap-2 text-[#41349D]">
                <Mail className="w-5 h-5" /> Heartsandpaws@gmail.com
              </p>

            </div>
          </div>
          <div>

            <h4 className="mb-4 text-xl text-secondary">Keep in Touch with Us</h4>
            <div className="space-y-4">
            <p className="text-[#41349D] text-md">Join the Hearts&Paws magazine and be the first to hear about any news</p>
            <div className="flex items-center gap-4 w-full max-w-lg">
            <div className="flex gap-4 justify-center items-center border-2 border-[#CBCBCB] rounded-full px-4 w-full max-w-lg">
        <MailIcon size={25} className="text-[#606060]" />
        <Input
          className="bg-transparent border-none !placeholder-neutral-500"
          placeholder="E-mail Address"
        />
      </div>
      <Button className="rounded-full px-6 py-2">Subscribe</Button>
            </div>
           
            </div>
          </div>
        </div>
      </div>

      <div className="bg-primary text-white py-4">
        <div className="container flex flex-col md:flex-row items-center justify-between mx-auto px-4">
        <p className="text-sm opacity-80 mt-3 md:mt-0">
            © {new Date().getFullYear()} Hearts & Paws. All rights reserved.
          </p>
          
          <div className="flex gap-4">
            <a href="#" className="hover:opacity-80">
              <FacebookIcon className="w-6 h-6" />
            </a>
            <a href="#" className="hover:opacity-80">
              <InstagramIcon className="w-6 h-6" />
            </a>
            <a href="#" className="hover:opacity-80">
              <TwitterIcon className="w-6 h-6" />
            </a>
            <a href="#" className="hover:opacity-80">
              <LinkedinIcon className="w-6 h-6" />
            </a>
          </div>

         
        </div>
      </div>
    </footer>
  );
};

export default Footer;
