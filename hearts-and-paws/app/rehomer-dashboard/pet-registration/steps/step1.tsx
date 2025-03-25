// app/rehomer-dashboard/pet-registration/steps/Step1.tsx
"use client";

import { useFormContext } from "react-hook-form";
import type { PetFormInputs } from "../page";

export default function Step1() {
  const {
    register,
    formState: { errors },
  } = useFormContext<PetFormInputs>();

  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">Pet Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Pet Name *
          </label>
          <input
            type="text"
            {...register("petName", { required: "Pet name is required" })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
          />
          {errors.petName && (
            <span className="text-red-500 text-xs">{errors.petName.message}</span>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Pet Category *
          </label>
          <div className="mt-2 space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                {...register("category", { required: "Pet category is required" })}
                value="Dog"
                className="mr-2"
              />
              Dog
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                {...register("category", { required: "Pet category is required" })}
                value="Cat"
                className="mr-2"
              />
              Cat
            </label>
          </div>
          {errors.category && (
            <span className="text-red-500 text-xs">{errors.category.message}</span>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Age *
          </label>
          <input
            type="number"
            {...register("age", {
              required: "Age is required",
              valueAsNumber: true,
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
          />
          {errors.age && (
            <span className="text-red-500 text-xs">{errors.age.message}</span>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Size *
          </label>
          <select
            {...register("size", { required: "Size is required" })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
          >
            <option value="">Select size</option>
            <option value="Small">Small</option>
            <option value="Medium">Medium</option>
            <option value="Large">Large</option>
            <option value="Extra Large">Extra Large</option>
          </select>
          {errors.size && (
            <span className="text-red-500 text-xs">{errors.size.message}</span>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Gender *
          </label>
          <select
            {...register("gender", { required: "Gender is required" })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
          >
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Unknown">Unknown</option>
          </select>
          {errors.gender && (
            <span className="text-red-500 text-xs">{errors.gender.message}</span>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Breed *
          </label>
          <input
            type="text"
            {...register("breed", { required: "Breed is required" })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
          />
          {errors.breed && (
            <span className="text-red-500 text-xs">{errors.breed.message}</span>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Colors
          </label>
          <input
            type="text"
            {...register("colors")}
            placeholder="e.g., Brown, White"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
          />
        </div>
      </div>
    </section>
  );
}
