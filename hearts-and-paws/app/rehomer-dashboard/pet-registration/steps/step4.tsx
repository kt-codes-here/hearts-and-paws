// app/rehomer-dashboard/pet-registration/steps/Step4.tsx
"use client";

import { useFormContext } from "react-hook-form";
import type { PetFormInputs } from "../page";

export default function Step4() {
  const { register } = useFormContext<PetFormInputs>();

  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">Pet's Story</h2>
      <p className="text-sm text-gray-600 mb-4">
        Share anything about your pet. (Your pet profile will be visible to the public. 
        For your safety, do not include any personal details or contact information.) 
        You can include:
      </p>
      <ul className="list-disc list-inside text-sm text-gray-600 mb-4 space-y-1">
        <li>How long you've had them, where you got them from, and why you need to rehome</li>
        <li>Your pet’s favorite activities</li>
        <li>Details about their personality, preferences, and habits</li>
        <li>Any special training or background info</li>
      </ul>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Pet Story
      </label>
      <textarea
        {...register("petStory")}
        rows={6}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
        placeholder="Type here..."
      />
    </section>
  );
}
