"use client";

import Image from "next/image";
import Link from "next/link";

export default function Services() {
  const services = [
    {
      id: 1,
      title: "Pet Grooming",
      description: "Professional grooming services to keep your pet looking and feeling their best.",
      details: ["Bath and brush treatments", "Breed-specific haircuts", "Nail trimming and paw care", "Ear cleaning and dental hygiene", "De-shedding treatments"],
      icon: "/grooming-icon.svg",
      image: "/grooming-service.jpg",
    },
    {
      id: 2,
      title: "Pet Training",
      description: "Expert training services to help your pet develop good behavior and social skills.",
      details: ["Basic obedience training", "Puppy socialization classes", "Behavior modification", "Leash training", "Advanced commands and tricks"],
      icon: "/training-icon.svg",
      image: "/training-service.jpg",
    },
    {
      id: 3,
      title: "Pet Daycare",
      description: "Safe and stimulating environment for your pet while you're away during the day.",
      details: ["Supervised play sessions", "Regular exercise and activities", "Comfortable rest areas", "Socialization with other pets", "Daily updates and photos"],
      icon: "/daycare-icon.svg",
      image: "/daycare-service.jpg",
    },
    {
      id: 4,
      title: "Pet Health Check-ups",
      description: "Regular health screenings and preventative care to keep your pet in optimal health.",
      details: ["Comprehensive physical examinations", "Vaccination administration", "Parasite prevention", "Dietary consultations", "Health certificates for travel"],
      icon: "/health-icon.svg",
      image: "/health-service.jpg",
    },
  ];

  const testimonials = [
    {
      id: 1,
      text: "The grooming service at Hearts & Paws is exceptional! My dog always looks amazing and the staff treats him like family.",
      author: "Michael T.",
      pet: "Charlie, Golden Retriever",
      image: "/testimonial1.webp",
    },
    {
      id: 2,
      text: "The training sessions completely transformed my puppy's behavior. I can't thank the trainers enough for their patience and expertise.",
      author: "Jennifer L.",
      pet: "Max, German Shepherd",
      image: "/testimonial2.jpg",
    },
    {
      id: 3,
      text: "I feel completely at ease leaving my cat at the Hearts & Paws daycare. The staff is attentive and truly cares about the animals.",
      author: "Robert K.",
      pet: "Luna, Maine Coon",
      image: "/testimonial3.jpg",
    },
  ];

  return (
    <div className="mx-auto px-4 w-full md:w-9/10 lg:w-9/10 xl:w-9/10">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between px-8 py-16 bg-white">
        <div className="md:w-1/2 text-center md:text-left">
          <h2 className="text-4xl font-bold text-gray-900">Our Pet</h2>
          <h3 className="text-3xl font-semibold text-green-600 mt-2">Services</h3>
          <p className="text-gray-700 mt-4">At Hearts & Paws, we offer a complete range of professional pet services delivered with love and expertise. From grooming to training, we're committed to keeping your furry friends happy, healthy, and well-cared for.</p>
          <div className="mt-6">
            <Link
              href="#services-list"
              className="bg-green-600 text-white px-6 py-3 rounded-md text-lg hover:bg-green-700"
            >
              Explore Services
            </Link>
          </div>
        </div>
        <div className="md:w-1/2 flex justify-center relative">
          <div className="relative w-[600px] h-[600px]">
            <Image
              src="/services-hero.png"
              alt="Pet Services"
              fill
              style={{ objectFit: "contain" }}
            />
          </div>
        </div>
      </section>

      {/* Services List Section */}
      <section
        id="services-list"
        className="py-16 px-8"
      >
        <h2 className="text-3xl font-bold text-center text-gray-900">Our Services</h2>
        <p className="text-center text-gray-700 mt-4 max-w-2xl mx-auto">We provide comprehensive care for your pets with our range of professional services tailored to meet their unique needs.</p>

        <div className="mt-12">
          {services.map((service, index) => (
            <div
              key={service.id}
              className={`flex flex-col ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} gap-8 mb-16 items-center`}
            >
              <div className="md:w-1/2">
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-600">
                  <div className="flex items-center mb-4">
                    <div className="bg-green-100 p-3 rounded-full">
                      <Image
                        src={service.icon}
                        alt={service.title}
                        width={40}
                        height={40}
                      />
                    </div>
                    <h3 className="text-2xl font-semibold ml-4 text-gray-900">{service.title}</h3>
                  </div>
                  <p className="text-gray-700 mb-6">{service.description}</p>
                  <h4 className="font-medium text-green-700 mb-3">What's Included:</h4>
                  <ul className="space-y-2">
                    {service.details.map((detail, idx) => (
                      <li
                        key={idx}
                        className="flex items-start"
                      >
                        <span className="text-green-500 mr-2">✓</span>
                        <span className="text-gray-700">{detail}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6">
                    <Link
                      href="/adopter-dashboard/service-booking"
                      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 inline-block"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
              <div className="md:w-1/2">
                <div className="rounded-lg overflow-hidden shadow-lg h-80 relative">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900">How It Works</h2>
          <div className="mt-12">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md flex-1 relative">
                <div className="absolute -top-4 -left-4 bg-green-600 text-white font-bold rounded-full w-12 h-12 flex items-center justify-center">1</div>
                <h3 className="text-xl font-semibold text-gray-900 mt-4">Book Your Service</h3>
                <p className="text-gray-700 mt-3">Choose the service you need and select an available date and time that works for you.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md flex-1 relative">
                <div className="absolute -top-4 -left-4 bg-green-600 text-white font-bold rounded-full w-12 h-12 flex items-center justify-center">2</div>
                <h3 className="text-xl font-semibold text-gray-900 mt-4">Confirm Details</h3>
                <p className="text-gray-700 mt-3">Provide information about your pet and any special requirements they might have.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md flex-1 relative">
                <div className="absolute -top-4 -left-4 bg-green-600 text-white font-bold rounded-full w-12 h-12 flex items-center justify-center">3</div>
                <h3 className="text-xl font-semibold text-gray-900 mt-4">Enjoy the Service</h3>
                <p className="text-gray-700 mt-3">Drop off your pet at our facility or welcome our professional to your home, depending on the service.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-8">
        <h2 className="text-3xl font-bold text-center text-gray-900">What Pet Parents Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 rounded-full overflow-hidden relative">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.author}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-900">{testimonial.author}</h4>
                  <p className="text-green-600">{testimonial.pet}</p>
                </div>
              </div>
              <p className="text-gray-700 italic">"{testimonial.text}"</p>
              <div className="mt-4 flex text-yellow-400">
                <span>★</span>
                <span>★</span>
                <span>★</span>
                <span>★</span>
                <span>★</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-8 bg-green-100 text-center">
        <h2 className="text-3xl font-bold text-gray-900">Ready to Pamper Your Pet?</h2>
        <p className="text-gray-700 mt-4 max-w-2xl mx-auto">Book a service today and give your furry friend the care they deserve. Our experienced team is ready to help.</p>
        <div className="mt-8">
          <Link
            href="/adopter-dashboard/service-booking"
            className="bg-green-600 text-white px-6 py-3 rounded-md text-lg hover:bg-green-700"
          >
            Book a Service Now
          </Link>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900">Frequently Asked Questions</h2>
          <div className="mt-8 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-900">How long does a typical grooming session take?</h3>
              <p className="text-gray-700 mt-2">Grooming sessions typically take 1-2 hours depending on your pet's size, coat condition, and the specific services requested.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-900">Do you offer services for all breeds and sizes?</h3>
              <p className="text-gray-700 mt-2">Yes, our services are available for all breeds and sizes of dogs and cats. Our team is experienced in handling the specific needs of different breeds.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-900">How often should I book training sessions?</h3>
              <p className="text-gray-700 mt-2">For optimal results, we recommend weekly training sessions, especially for puppies and dogs with behavioral issues. Consistency is key to successful training.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-900">Can I stay with my pet during services?</h3>
              <p className="text-gray-700 mt-2">While we understand your concern, we find that most pets relax better when their owners aren't present. However, you're welcome to discuss specific arrangements with our staff.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
