"use client";

import React, { useState } from "react";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Step1 from "./steps/step1";  // Pet Details
import Step2 from "./steps/step2";  // Health & Behavior
import Step3 from "./steps/step3";  // Location
import Step4 from "./steps/step4";  // Pet's Story (new)
import Step5 from "./steps/step5";  // Documents/Images (new)
import Step6 from "./steps/step6";  // Rehome Details (old step5)
import Image from "next/image";

export interface PetFormInputs {
  petName: string;
  category: string;
  age: number;
  size: string;
  gender: string;
  breed: string;
  colors: string;
  shotsUpToDate: string;
  microchipped: string;
  houseTrained: string;
  goodWithDogs: string;
  goodWithCats: string;
  goodWithKids: string;
  purebred: string;
  specialNeeds: string;
  behavioralIssues: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  postcode: string;
  files: File[]; 
  petStory: string; // NEW
  images: string;   // For documents/images storage
  reason: string;
  durationToKeepPet: string;
}

const stepTitles = [
  "Pet Details",       // Step1
  "Health & Behavior", // Step2
  "Location",          // Step3
  "Pet's Story",       // Step4 (new)
  "Documents",         // Step5 (new)
  "Rehome Details",    // Step6
];

export default function PetRegistrationPage() {
  const router = useRouter();
  const { user, isLoaded, isSignedIn } = useUser();

  // New states for submission feedback
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionComplete, setSubmissionComplete] = useState(false);

  const methods = useForm<PetFormInputs>({
    defaultValues: {
      petName: "",
      age: 0,
      size: "",
      gender: "",
      breed: "",
      colors: "",
      shotsUpToDate: "",
      microchipped: "",
      houseTrained: "",
      goodWithDogs: "",
      goodWithCats: "",
      goodWithKids: "",
      purebred: "",
      specialNeeds: "",
      behavioralIssues: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      postcode: "",
      petStory: "",
      images: "",
      reason: "",
      durationToKeepPet: "",
    },
  });
  const { handleSubmit } = methods;

  // step = -1 -> Intro screen
  // step >= 0 -> multi-step form
  const [step, setStep] = useState<number>(-1);
  const totalSteps = stepTitles.length;

  // Terms acceptance state
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const onSubmit: SubmitHandler<PetFormInputs> = async (data) => {
    if (step === totalSteps - 1) {
      // Final step => perform final submission process
      setIsSubmitting(true);
      try {
        // 1) Upload files to GCP (simulate or implement your upload logic)
        const formData = new FormData();
        data.files.forEach((file) => {
          formData.append("files", file);
        });
        const uploadRes = await fetch("/api/upload-gcp", {
          method: "POST",
          body: formData,
        });
        if (!uploadRes.ok) {
          throw new Error("Failed to upload images to GCP.");
        }
        const uploadData = await uploadRes.json();
        const gcpUrls: string[] = uploadData.urls;
        // Convert the array to a string if needed, here we pass the array
        data.images = gcpUrls.join(", ");

        // 2) Create the pet record in your database
        const payload = { ...data, images: gcpUrls };
        const res = await fetch("/api/auth/pet-registration", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          setIsSubmitting(false);
          setSubmissionComplete(true);
          // Delay before redirecting to allow user to see completion message
          setTimeout(() => {
            router.push("/rehomer-dashboard");
          }, 2000);
        } else {
          const errData = await res.json();
          setIsSubmitting(false);
          alert(errData.error || "Error registering pet.");
        }
      } catch (err) {
        console.error("Submission error:", err);
        setIsSubmitting(false);
        alert("An unexpected error occurred.");
      }
    } else {
      // Not final step => advance to next step
      setStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep((prev) => prev - 1);
    } else {
      setStep(-1);
    }
  };

  if (!isLoaded || !isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl font-semibold">Loading...</p>
      </div>
    );
  }

  if (isSubmitting) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-700"></div>
        <p className="mt-4 text-xl font-semibold">Registering pet...</p>
      </div>
    );
  }

  if (submissionComplete) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-24 w-24 text-green-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <p className="mt-4 text-3xl font-bold text-green-600">Registration Completed!</p>
      </div>
    );
  }

  // Intro screen
  if (step === -1) {
    const userEmail = user?.emailAddresses[0]?.emailAddress || "";
    const userFirstName = user?.firstName || "";
    const userLastName = user?.lastName || "";
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-8">
          <h2 className="text-2xl font-bold text-center mb-4">Welcome!</h2>
          <div className="flex flex-col items-center mb-6">
            {user?.imageUrl && (
              <Image
                src={user.imageUrl}
                alt="User Avatar"
                className="w-16 h-16 rounded-full mb-2 object-cover"
              />
            )}
            <p className="text-gray-700">Email/Username: {userEmail}</p>
            <p className="text-gray-700">First name: {userFirstName}</p>
            <p className="text-gray-700">Last name: {userLastName}</p>
          </div>
          <div className="flex items-center gap-2 mb-6">
            <input
              type="checkbox"
              id="termsCheckbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="h-4 w-4"
            />
            <label htmlFor="termsCheckbox" className="text-sm text-gray-700">
              I have read and agree to the{" "}
              <a href="#" className="text-purple-600 underline">
                Terms
              </a>{" "}
              and{" "}
              <a href="#" className="text-purple-600 underline">
                Privacy Policy
              </a>
            </label>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            To apply for Rehome pet you need to complete some fields. Click Start.
          </p>
          <button
            disabled={!agreedToTerms}
            onClick={() => setStep(0)}
            className={`w-full py-3 rounded-md transition-colors ${
              agreedToTerms
                ? "bg-purple-600 text-white hover:bg-purple-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Start
          </button>
        </div>
      </div>
    );
  }

  // Multi-step form
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-6">
          Pet Registration for Rehoming
        </h1>

        {/* Stepper Progress */}
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            {stepTitles.map((title, idx) => (
              <div key={idx} className="flex-1">
                <div
                  className={`text-center text-sm font-semibold ${
                    idx === step ? "text-purple-700" : "text-gray-500"
                  }`}
                >
                  {title}
                </div>
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-300 rounded-full h-2">
            <div
              className="bg-purple-600 h-2 rounded-full"
              style={{ width: `${((step + 1) / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {step === 0 && <Step1 />}
            {step === 1 && <Step2 />}
            {step === 2 && <Step3 />}
            {step === 3 && <Step4 />}
            {step === 4 && <Step5 />}
            {step === 5 && <Step6 />}
            <div className="flex justify-between">
              {step > 0 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="py-2 px-4 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Back
                </button>
              )}
              <button
                type="submit"
                className="ml-auto py-2 px-4 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
              >
                {step === totalSteps - 1 ? "Submit" : "Next"}
              </button>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
