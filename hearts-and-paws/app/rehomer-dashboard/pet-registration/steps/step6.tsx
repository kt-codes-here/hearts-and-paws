// app/rehomer-dashboard/pet-registration/steps/Step6.tsx
"use client";

import { useFormContext } from "react-hook-form";
import type { PetFormInputs } from "../page";

export default function Step6() {
  const {
    register,
    formState: { errors },
  } = useFormContext<PetFormInputs>();

  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">Rehome Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Reason for Rehoming *
          </label>
          <textarea
            {...register("reason", { required: "Reason is required" })}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
            placeholder="Why are you rehoming your pet?"
          />
          {errors.reason && (
            <span className="text-red-500 text-xs">
              {errors.reason.message}
            </span>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Duration to Keep Pet *
          </label>
          <select
            {...register("durationToKeepPet", {
              required: "Duration is required",
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
          >
            <option value="">Select duration</option>
            <option value="Immediately">Immediately</option>
            <option value="Less than 1 week">Less than 1 week</option>
            <option value="1-4 weeks">1-4 weeks</option>
            <option value="More than 4 weeks">More than 4 weeks</option>
          </select>
          {errors.durationToKeepPet && (
            <span className="text-red-500 text-xs">
              {errors.durationToKeepPet.message}
            </span>
          )}
        </div>
      </div>
    </section>
  );
}
