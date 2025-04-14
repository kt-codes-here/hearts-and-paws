"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";

export default function KnowledgeCenter() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [expandedFaqs, setExpandedFaqs] = useState<number[]>([]);

  const categories = [
    { id: "all", name: "All FAQs" },
    { id: "adoption", name: "Pet Adoption" },
    { id: "rehoming", name: "Pet Rehoming" },
    { id: "services", name: "Pet Services" },
    { id: "payments", name: "Payments & Refunds" },
    { id: "appointments", name: "Appointments" },
    { id: "support", name: "Support" },
  ];

  const faqs = [
    {
      id: 1,
      question: "How can I adopt a pet through Hearts and Paws?",
      answer: "To adopt a pet, browse the Pet Listings page and filter by breed, size, gender, or location. Once you find a pet you love, visit their profile and submit an adoption request. The pet owner will review and approve your request. Upon approval, the pet will be marked as adopted and added to your dashboard.",
      category: "adoption",
    },
    {
      id: 2,
      question: "Can I list my pet for adoption on the website?",
      answer: "Yes! If you're a pet owner, simply sign up and navigate to your dashboard. From there, you can add your pet's details, upload photos, and list them for adoption. You'll be notified when someone sends an adoption request.",
      category: "rehoming",
    },
    {
      id: 3,
      question: "What types of services can I book for my pet?",
      answer: "Hearts and Paws currently offers Grooming, Veterinary, and Training services through our verified Service Providers. You can explore available services and book appointments directly from your dashboard.",
      category: "services",
    },
    {
      id: 4,
      question: "How do I book an appointment with a service provider?",
      answer: 'Visit the "Services" section, select a provider, and choose from the available time slots listed. Once booked, you\'ll receive a confirmation, and your appointment will appear in your dashboard.',
      category: "appointments",
    },
    {
      id: 5,
      question: "How do I know which time slots are available?",
      answer: "When booking a service, our platform shows real-time availability based on the provider's calendar. You can only select from open slots, ensuring smooth and conflict-free scheduling.",
      category: "appointments",
    },
    {
      id: 6,
      question: "Can I make payments for services online?",
      answer: "Yes! We've integrated Stripe into our platform for secure and seamless payment. Once you confirm a service, you'll be prompted to pay the associated fee directly through the website.",
      category: "payments",
    },
    {
      id: 7,
      question: "What happens after I submit an adoption request?",
      answer: "Once you submit a request, the pet owner is notified. They will review your details and either approve or reject the request. You'll receive updates via your dashboard and email.",
      category: "adoption",
    },
    {
      id: 8,
      question: "I have a query or need help. How can I contact support?",
      answer: "You can submit a support ticket anytime via your dashboard. Our team will respond promptly to resolve your issue or answer your question.",
      category: "support",
    },
    {
      id: 9,
      question: "Can I cancel or reschedule a service appointment after booking?",
      answer: "Yes, appointments can be canceled or rescheduled from your dashboard. We recommend doing so at least 24 hours in advance to avoid any cancellation penalties. Once canceled, you will receive a confirmation and refund if applicable.",
      category: "appointments",
    },
    {
      id: 10,
      question: "What if no one showed up for the scheduled service?",
      answer: "We're sorry to hear that! If your service provider didn't arrive at the scheduled time, you may be eligible for a full refund. Please submit a support ticket through your dashboard with the appointment details — our team will investigate and guide you through the refund process.",
      category: "services",
    },
    {
      id: 11,
      question: "How do I request a refund after payment?",
      answer: "If you believe you're eligible for a refund (e.g., due to cancellation, no-show, or unsatisfactory service), submit a support ticket from your dashboard. Our support team will review your request and issue a refund based on our refund policy.",
      category: "payments",
    },
    {
      id: 12,
      question: "How will I receive a refund if I cancel a paid appointment?",
      answer: "Refunds are processed through Stripe, our secure payment partner. Depending on your payment method, it may take 5–7 business days for the refund to reflect in your account. You can track the refund status in your dashboard.",
      category: "payments",
    },
    {
      id: 13,
      question: "Can I rate and review a service provider after my appointment?",
      answer: "Yes! After each completed appointment, you'll receive a prompt to rate your experience and leave a review. This helps other pet parents make informed choices and helps us maintain high service standards.",
      category: "services",
    },
    {
      id: 14,
      question: "Is there any support if I face issues with payment or service quality?",
      answer: "Absolutely. If you have any concerns about your payment, service experience, or provider behavior, simply submit a support ticket through your dashboard. Our team is here to help and will resolve your issue as quickly as possible.",
      category: "support",
    },
    {
      id: 15,
      question: "Is my payment information secure on Hearts and Paws?",
      answer: "Absolutely. All payments on our platform are processed securely through Stripe, a trusted global payment gateway. We do not store any sensitive payment information on our servers.",
      category: "payments",
    },
  ];

  const toggleFaq = (id: number) => {
    if (expandedFaqs.includes(id)) {
      setExpandedFaqs(expandedFaqs.filter((faqId) => faqId !== id));
    } else {
      setExpandedFaqs([...expandedFaqs, id]);
    }
  };

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory = activeCategory === "all" || faq.category === activeCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || faq.answer.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const quickLinks = [
    { title: "Adopt a Pet", link: "/pet-listing", icon: "/paw-icon.svg" },
    { title: "Rehome a Pet", link: "/rehomer-dashboard", icon: "/heart-icon.svg" },
    { title: "Book a Service", link: "/services", icon: "/grooming-icon.svg" },
    { title: "Submit Support Ticket", link: "/support", icon: "/support-icon.svg" },
  ];

  return (
    <div className="mx-auto px-4 w-full md:w-9/10 lg:w-9/10 xl:w-9/10">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center px-8 py-16 bg-white text-center">
        <h2 className="text-4xl font-bold text-gray-900">Knowledge Center</h2>
        <h3 className="text-3xl font-semibold text-[#675bc8] mt-2">Hearts & Paws</h3>
        <p className="text-gray-700 mt-4 max-w-2xl">Your go-to space for everything related to pet adoption, services, appointment scheduling, and more. Find answers to all your questions here.</p>

        {/* Search Bar */}
        <div className="mt-8 w-full max-w-2xl relative">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search for answers..."
            className="w-full py-3 pl-12 pr-4 text-gray-700 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#675bc8]"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="py-12 px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">Quick Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickLinks.map((link, index) => (
              <Link
                key={index}
                href={link.link}
                className="bg-white flex flex-col items-center p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="bg-[#675bc8] bg-opacity-10 p-4 rounded-full">
                  <Image
                    src={link.icon}
                    alt={link.title}
                    width={32}
                    height={32}
                    className="text-[#675bc8]"
                  />
                </div>
                <h3 className="mt-4 font-semibold text-gray-900">{link.title}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">Frequently Asked Questions</h2>
          <p className="text-center text-gray-700 mb-8 max-w-2xl mx-auto">Find answers to common questions about our platform, services, and policies.</p>

          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${activeCategory === category.id ? "bg-[#675bc8] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                onClick={() => setActiveCategory(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* FAQs */}
          <div className="space-y-4">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq) => (
                <div
                  key={faq.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <button
                    className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
                    onClick={() => toggleFaq(faq.id)}
                  >
                    <h3 className="text-lg font-medium text-gray-900">{faq.question}</h3>
                    <span className="ml-6 flex-shrink-0">
                      <svg
                        className={`h-6 w-6 transform ${expandedFaqs.includes(faq.id) ? "rotate-180" : ""} text-[#675bc8] transition-transform duration-200`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </span>
                  </button>
                  <div className={`px-6 pb-4 ${expandedFaqs.includes(faq.id) ? "block" : "hidden"}`}>
                    <p className="text-gray-700">{faq.answer}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No results found for your search. Please try different keywords.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Still Need Help Section */}
      <section className="py-16 px-8 bg-purple-100 text-center">
        <h2 className="text-3xl font-bold text-gray-900">Still Need Help?</h2>
        <p className="text-gray-700 mt-4 max-w-2xl mx-auto">Can't find what you're looking for? Our support team is ready to assist you with any questions or concerns.</p>
        <div className="mt-8">
          <Link
            href="/support"
            className="bg-[#675bc8] text-white px-6 py-3 rounded-md text-lg hover:bg-purple-700"
          >
            Contact Support
          </Link>
        </div>
      </section>
    </div>
  );
}
