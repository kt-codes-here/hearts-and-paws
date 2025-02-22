import {
  ArrowRight,
  LocateIcon,
  Mail,
  MapIcon,
  MapPinIcon,
  MessageCircle,
  Phone,
  Pin,
} from "lucide-react";
import React from "react";

type Props = {};

const Footer = (props: Props) => {
  return (
    <footer className="bg-[#F9F9F9]">
      <div className="container px-4 py-8 mx-auto">
        <div className="grid gap-10 md:grid-cols-3">
          <div className="space-y-4">
            <h3 className="mb-4 text-xl text-secondary">How can we help you</h3>
            <a
              href="#"
              className="block text-lg text-[#41349D] opacity-80 hover:opacity-100"
            >
              Adopt a pet
            </a>
            <a
              href="#"
              className="block text-lg text-[#41349D] opacity-80 hover:opacity-100"
            >
              Rehome a Pet
            </a>
            <a
              href="#"
              className="block text-lg opacity-80 text-[#41349D] hover:opacity-100"
            >
              Adopt FAQs
            </a>
            <a
              href="#"
              className="block text-lg opacity-80 text-[#41349D] hover:opacity-100"
            >
              Rehome FAQs
            </a>
          </div>
          <div>
            <h4 className="mb-4 text-xl text-secondary">Contact Us</h4>
            <div className="space-y-4">
              <p className="text-md font-semibold opacity-80 flex items-center gap-2 text-[#2E256F]">
                <MapPinIcon className="w-5 h-5" /> Pace University
              </p>
              <p className="text-sm opacity-80 flex items-center gap-2 text-[#41349D]">
                <Phone className="w-5 h-5" /> +1 (555) 123-4567
              </p>
              <p className="text-sm opacity-80 flex items-center gap-2 text-[#41349D]">
                <Mail className="w-5 h-5" /> contact@furryfriends.com
              </p>

            
              <p className="text-sm opacity-80"></p>
            </div>
          </div>
          <div>
            <h4 className="mb-4 text-xl text-secondary">Keep in Touch with Us</h4>
            <div className="flex gap-4">
              <a href="#" className="opacity-80 hover:opacity-100">
                <MessageCircle className="w-5 h-5" />
              </a>
              <a href="#" className="opacity-80 hover:opacity-100">
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
