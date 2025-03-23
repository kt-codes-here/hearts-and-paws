// app/rehomer-dashboard/pet-registration/steps/Step1.tsx
"use client";

import { useFormContext } from "react-hook-form";
import type { PetFormInputs } from "../page";

export default function Step2() {
 const {
    register,
    formState: { errors },
  } = useFormContext<PetFormInputs>();
  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">Location</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Address Line 1 */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Address Line 1 *
          </label>
          <input
            type="text"
            {...register("addressLine1", { required: "Address Line 1 is required" })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
          />
          {errors.addressLine1 && (
            <span className="text-red-500 text-xs">
              {errors.addressLine1.message}
            </span>
          )}
        </div>

        {/* Address Line 2 */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Address Line 2
          </label>
          <input
            type="text"
            {...register("addressLine2")}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
          />
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            City *
          </label>
          <input
            type="text"
            {...register("city", { required: "City is required" })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
          />
          {errors.city && (
            <span className="text-red-500 text-xs">{errors.city.message}</span>
          )}
        </div>

        {/* Postcode */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Postcode *
          </label>
          <input
            type="text"
            {...register("postcode", { required: "Postcode is required" })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
          />
          {errors.postcode && (
            <span className="text-red-500 text-xs">
              {errors.postcode.message}
            </span>
          )}
        </div>
      </div>
    </section>
  );
}
