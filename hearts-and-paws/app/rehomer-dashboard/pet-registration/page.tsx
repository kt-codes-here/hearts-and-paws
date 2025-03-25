// app/rehomer-dashboard/pet-registration/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Step1 from "./steps/step1";  // Pet Details
import Step2 from "./steps/step2";  // Health & Behavior
import Step3 from "./steps/step3";  // Location
import Step4 from "./steps/step4";  // Pet's Story (new)
import Step5 from "./steps/step5";  // Documents/Images (new)
import Step6 from "./steps/step6";  // Rehome Details (old step5)

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
  images: string;   // Reuse for documents
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
  
  // Add debugging for component mounting
  useEffect(() => {
    console.log('Pet Registration Page Mounted');
  }, []);

  // Add authentication check
  useEffect(() => {
    console.log('Auth State:', { isLoaded, isSignedIn });
    if (isLoaded) {
      if (!isSignedIn) {
        console.log('User not signed in, redirecting...');
        router.push('/');
      }
    }
  }, [isLoaded, isSignedIn, router]);

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
      petStory: "",   // new
      images: "",     // for docs
      reason: "",
      durationToKeepPet: "",
    },
  });
  const { handleSubmit } = methods;

  // step = -1 -> Intro screen
  // step >= 0 -> multi-step form
  const [step, setStep] = useState<number>(-1);
  const totalSteps = stepTitles.length;

  // Terms
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const onSubmit: SubmitHandler<PetFormInputs> = async (data) => {
    if (step === totalSteps - 1) {
      // Final step => do everything, including GCP upload
      const { files } = data;
  
      // Enforce min 1 file
      if (!files || files.length < 1) {
        alert("Please upload at least 1 image.");
        return;
      }
  
      try {
        // 1) Upload the files to GCP (client -> server)
        //    We'll send them to an API route, e.g. /api/upload-gcp
        const formData = new FormData();
        files.forEach((file) => {
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
        const gcpUrls = uploadData.urls; // array of public URLs
  
        // 2) Convert the array to a comma-separated string or keep as array
        const imageString = gcpUrls.join(", ");
        data.images = imageString;
  
        // 3) Now proceed to create the pet in DB
        const payload = { ...data, images: gcpUrls }; 
        // or if your DB expects images as an array, pass the array
        // or if your DB expects images as a string, pass imageString
  
        const res = await fetch("/api/auth/pet-registration", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
  
        if (res.ok) {
          router.push("/rehomer-dashboard");
        } else {
          const errData = await res.json();
          alert(errData.error || "Error registering pet.");
        }
      } catch (err) {
        console.error("Submission error:", err);
        alert("An unexpected error occurred.");
      }
    } else {
      // Not final step => just go to the next step
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
              <img
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
            {step === 0 && <Step1 />}  {/* Pet Details */}
            {step === 1 && <Step2 />}  {/* Health & Behavior */}
            {step === 2 && <Step3 />}  {/* Location */}
            {step === 3 && <Step4 />}  {/* Pet's Story (new) */}
            {step === 4 && <Step5 />}  {/* Documents (new) */}
            {step === 5 && <Step6 />}  {/* Rehome Details */}

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
