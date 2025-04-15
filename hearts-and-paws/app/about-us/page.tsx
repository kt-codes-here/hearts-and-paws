"use client";

import Image from "next/image";
import Link from "next/link";

export default function AboutUs() {
  const teamMembers = [
    {
      name: "Emily Carter",
      role: "Founder & CEO",
      bio: "Animal welfare advocate with 15+ years of experience in pet rescue and rehoming.",
      image: "/team-member1.jpg", // Replace with actual image path
    },
    {
      name: "David Wilson",
      role: "Head Veterinarian",
      bio: "Certified veterinarian with special interest in shelter medicine and animal behavior.",
      image: "/team-member2.jpg", // Replace with actual image path
    },
    {
      name: "Sarah Johnson",
      role: "Adoption Coordinator",
      bio: "Passionate about matching pets with their perfect forever homes since 2015.",
      image: "/team-member3.jpg", // Replace with actual image path
    },
  ];

  return (
    <div className="mx-auto px-4 w-full md:w-9/10 lg:w-9/10 xl:w-9/10">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between px-8 py-16 bg-white">
        <div className="md:w-1/2 text-center md:text-left">
          <h2 className="text-4xl font-bold text-gray-900">About</h2>
          <h3 className="text-3xl font-semibold text-[#675bc8] mt-2">Hearts & Paws</h3>
          <p className="text-gray-700 mt-4">At Hearts & Paws, we believe every pet deserves a loving home. Our mission is to connect pets in need with caring families through our adoption and rehoming services, while also providing exceptional pet care services to support pet owners.</p>
        </div>
        <div className="md:w-1/2 flex justify-center relative">
          <div className="relative w-[400px] h-[400px]">
            <Image
              src="/petadoption.jpg"
              alt="Our Mission"
              fill
              style={{ objectFit: "contain" }}
            />
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900">Our Story</h2>
          <div className="mt-8 bg-white p-8 rounded-lg shadow-md">
            <p className="text-gray-700 mb-4">Hearts & Paws was founded in 2018 with a simple but powerful vision: to create a community where no pet is left behind. What started as a small local initiative has grown into a comprehensive platform that serves pet lovers nationwide.</p>
            <p className="text-gray-700 mb-4">Our founder, Emily Carter, witnessed firsthand the challenges faced by pet owners who, due to various life circumstances, could no longer care for their beloved companions. She also saw how traditional shelters were often overwhelmed and unable to provide the personalized attention each animal deserved.</p>
            <p className="text-gray-700">Today, Hearts & Paws stands as a testament to the power of compassion and innovation. We've helped thousands of pets find new homes and have supported countless pet owners with our range of services. Our community continues to grow, united by a shared love for animals and a commitment to their welfare.</p>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-16 px-8">
        <h2 className="text-3xl font-bold text-center text-gray-900">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-[#675bc8]">
            <div className="flex items-center mb-4">
              <div className="bg-purple-100 p-3 rounded-full">
                <Image
                  src="/heart-icon.svg"
                  alt="Compassion"
                  width={30}
                  height={30}
                />
              </div>
              <h3 className="text-xl font-semibold ml-4 text-gray-900">Compassion</h3>
            </div>
            <p className="text-gray-700">We approach every animal and human with kindness, understanding, and respect. Every pet deserves dignity and love.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-green-600">
            <div className="flex items-center mb-4">
              <div className="bg-green-100 p-3 rounded-full">
                <Image
                  src="/community-icon.svg"
                  alt="Community"
                  width={30}
                  height={30}
                />
              </div>
              <h3 className="text-xl font-semibold ml-4 text-gray-900">Community</h3>
            </div>
            <p className="text-gray-700">We believe in the power of connection. By bringing together pet lovers, we create a supportive network that benefits both animals and humans.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-blue-600">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <Image
                  src="/excellence-icon.svg"
                  alt="Excellence"
                  width={30}
                  height={30}
                />
              </div>
              <h3 className="text-xl font-semibold ml-4 text-gray-900">Excellence</h3>
            </div>
            <p className="text-gray-700">We strive for excellence in all our services, continuously improving to better serve the needs of pets and their owners.</p>
          </div>
        </div>
      </section>

      {/* Meet Our Team Section */}
      <section className="py-16 px-8 bg-gray-50">
        <h2 className="text-3xl font-bold text-center text-gray-900">Meet Our Team</h2>
        <p className="text-center text-gray-700 mt-4 max-w-2xl mx-auto">Our dedicated team of animal lovers works tirelessly to ensure the best outcomes for pets and their families.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="bg-white rounded-lg overflow-hidden shadow-md"
            >
              <div className="h-64 relative">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900">{member.name}</h3>
                <p className="text-purple-600 font-medium">{member.role}</p>
                <p className="text-gray-700 mt-4">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-8 bg-purple-100 text-center">
        <h2 className="text-3xl font-bold text-gray-900">Join Our Mission</h2>
        <p className="text-gray-700 mt-4 max-w-2xl mx-auto">Whether you're looking to adopt, rehome, or use our pet services, you're becoming part of a community dedicated to improving the lives of animals.</p>
        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <Link
            href="/pet-listing"
            className="bg-[#675bc8] text-white px-6 py-3 rounded-md text-lg hover:bg-purple-700"
          >
            Adopt a Pet
          </Link>
          <Link
            href="/rehomer-dashboard"
            className="bg-white text-[#675bc8] border border-purple-600 px-6 py-3 rounded-md text-lg hover:bg-purple-50"
          >
            Rehome a Pet
          </Link>
          <Link
            href="/services"
            className="bg-green-600 text-white px-6 py-3 rounded-md text-lg hover:bg-green-700"
          >
            Explore Our Services
          </Link>
        </div>
      </section>
    </div>
  );
}
