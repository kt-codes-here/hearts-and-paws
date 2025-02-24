'use client';

import Image from 'next/image';

const cardData = [
  {
    title: "Emotional relationship",
    description: "The emotional bond between cats and humans is deeply rooted in felines' unconditional love and companionship.",
    icon: "/dog.svg"
  },
  {
    title: "Communication",
    description: "Animals can communicate better with people in such conditions, as verbal communication is replaced by non-verbal.",
    icon: "/cat.svg"
  },
  {
    title: "Children and pets",
    description: "Pets establish emotional attachments to children, and the relationship turns out positive in terms of affective aspects, reinforcing the child’s personality.",
    icon: "/dog2.svg"
  },
  {
    title: "Health",
    description: "Some studies suggest that owning a pet can lower blood pressure and improve heart health.",
    icon: "/cat2.svg"
  }
];

function InfoCard({ title, description, icon }) {
  return (
    <div className="border-2 border-cardBackground rounded-lg shadow-md p-4">
      <div className='flex justify-start'>
      <Image src="/paw5.svg" alt="Humans and Pets" width={40} height={30} className="mx-auto md:mx-0" />
      <h4 className="text-lg ml-4 font-semibold text-green-600">{title}</h4>
      </div>
      <p className="text-gray-700 mt-2">{description}</p>
      <Image src={icon} alt={title} width={40} height={40} className="mt-4" />
    </div>
  );
}

export default function PetServiceStatic() {
  return (
    <section className="flex flex-col md:flex-row items-center justify-between px-8 py-16 bg-white">
      {/* Left Section - Text and Illustration */}
      <div className="md:w-1/2 text-center md:text-left">
              <h2 className="text-3xl font-bold text-gray-900">Peaceful Coexistence</h2>
        <h3 className="text-2xl text-green-600 mt-2">Human & Animals</h3>
        <div className="mt-6">
          <Image src="/4section.png" alt="Humans and Pets" width={500} height={400} className="mx-auto md:mx-0" />
        </div>
      </div>

      {/* Right Section - Cards */}
      <div className="md:w-1/2 grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 md:mt-0">
        {cardData.map((card, index) => (
          <InfoCard key={index} {...card} />
        ))}
      </div>
    </section>
  );
}
