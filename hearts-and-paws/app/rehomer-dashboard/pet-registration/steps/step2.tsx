"use client";

import { useFormContext } from "react-hook-form";
import type { PetFormInputs } from "../page";
import React from "react";

// For convenience, define a type for each health item
interface HealthRadioItem {
  name: keyof PetFormInputs; // e.g. "shotsUpToDate"
  label: string;
}

export default function Step2() {
  const {
    register,
    formState: { errors },
  } = useFormContext<PetFormInputs>();

  // Each field is typed as a string in PetFormInputs, e.g.:
  // shotsUpToDate?: "yes" | "no" | "unknown";
  // If your schema expects booleans, convert them on the server side.
  const healthItems: HealthRadioItem[] = [
    { name: "shotsUpToDate", label: "Shots Up To Date" },
    { name: "microchipped", label: "Microchipped" },
    { name: "houseTrained", label: "House Trained" },
    { name: "goodWithDogs", label: "Good With Dogs" },
    { name: "goodWithCats", label: "Good With Cats" },
    { name: "goodWithKids", label: "Good With Kids" },
    { name: "purebred", label: "Purebred" },
    { name: "specialNeeds", label: "Special Needs" },
    { name: "behavioralIssues", label: "Behavioral Issues" },
  ];

  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">Health & Behavior</h2>
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="py-2 px-4 text-left">Question</th>
            <th className="py-2 px-4 text-center">Yes</th>
            <th className="py-2 px-4 text-center">No</th>
            <th className="py-2 px-4 text-center">Unknown</th>
          </tr>
        </thead>
        <tbody>
          {healthItems.map((item) => {
            // Check if there's an error for this particular field
            const fieldError = errors[item.name];

            return (
              <React.Fragment key={item.name}>
                <tr className="border-b">
                  {/* Label / Question */}
                  <td className="py-2 px-4">{item.label}</td>

                  {/* Yes */}
                  <td className="py-2 px-4 text-center">
                    <input
                      type="radio"
                      value="yes"
                      {...register(item.name, {
                        required: "Please select an option",
                      })}
                    />
                  </td>

                  {/* No */}
                  <td className="py-2 px-4 text-center">
                    <input
                      type="radio"
                      value="no"
                      {...register(item.name, {
                        required: "Please select an option",
                      })}
                    />
                  </td>

                  {/* Unknown */}
                  <td className="py-2 px-4 text-center">
                    <input
                      type="radio"
                      value="unknown"
                      {...register(item.name, {
                        required: "Please select an option",
                      })}
                    />
                  </td>
                </tr>
                {/* Error Row (if any) */}
                {fieldError && (
                  <tr>
                    <td colSpan={4} className="text-red-500 text-xs py-1 px-4">
                      {fieldError.message as string}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}
