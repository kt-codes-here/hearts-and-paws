// app/rehomer-dashboard/pet-registration/steps/Step5.tsx
"use client";

import React from "react";
import { useFormContext, useWatch } from "react-hook-form";
import type { PetFormInputs } from "../page";

export default function Step5() {
  const { setValue, register } = useFormContext<PetFormInputs>();
  // Watch the current files array in the form; default to an empty array.
  const files = useWatch({ name: "files" }) || [];

  // Handle user selecting files
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selected = Array.from(e.target.files);

    // If adding these would exceed 4 total, show alert and reset input
    if (files.length + selected.length > 4) {
      alert("You can upload a maximum of 4 images.");
      e.target.value = "";
      return;
    }

    // Store them in the form field "files"
    setValue("files", [...files, ...selected], { shouldValidate: true });
    e.target.value = ""; // Reset file input so user can re-select if needed
  };

  // Remove a file at the given index
  const removeFile = (index: number) => {
    // Optional: revoke the object URL if needed: URL.revokeObjectURL(...)
    const updated = files.filter((_: any, i: number) => i !== index);
    setValue("files", updated, { shouldValidate: true });
  };

  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">Documents / Images</h2>
      <p className="text-sm text-gray-600 mb-4">
        These documents won't be visible to the public and will only be shared with the adopter once the Rehome process is complete.
      </p>

      {/* File input */}
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Select up to 4 images:
      </label>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileChange}
        className="mb-4"
      />

      {/* Show image previews with remove button */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        {[...Array(4)].map((_, index) => {
          const file = files[index];
          return (
            <div
              key={index}
              className="relative border-2 border-dashed border-gray-300 rounded-lg h-40 flex items-center justify-center text-gray-400"
            >
              {file ? (
                <>
                  <img
                    src={URL.createObjectURL(file)}
                    alt="Image preview"
                    className="object-cover w-full h-full"
                  />
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                  >
                    ×
                  </button>
                </>
              ) : (
                <span className="text-sm">+ Add Image {index + 1}</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Hidden input for final image URLs (set during final submit) */}
      <input type="hidden" {...register("images")} />
    </section>
  );
}
