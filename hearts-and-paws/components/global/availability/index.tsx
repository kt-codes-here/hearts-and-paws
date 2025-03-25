import { useState } from "react";

const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];

export default function AvailabilitySelector() {
  const [availability, setAvailability] = useState([
    { day: "Monday", startTime: "09:00", endTime: "17:00" }
  ]);

  const handleAvailabilityChange = (
    index: number, // 'index' is of type number
    field: "day" | "startTime" | "endTime", // 'field' is a union of string literals
    value: string // 'value' is of type string
    ) => {
    const updatedAvailability = [...availability];
    updatedAvailability[index][field] = value;
    setAvailability(updatedAvailability);
  };

  const addAvailabilitySlot = () => {
    setAvailability([...availability, { day: "Monday", startTime: "", endTime: "" }]);
  };

  const removeAvailabilitySlot = (index : number) => {
    const updatedAvailability = availability.filter((_, i) => i !== index);
    setAvailability(updatedAvailability);
  };

  return (
    <div className="p-6 border rounded shadow-md  mt-8">
      <h2 className="text-2xl font-bold mb-4">Set Your Availability</h2>

      {availability.map((slot, index) => (
        <div key={index} className="flex items-center space-x-4 mb-2">
          <select
            value={slot.day}
            onChange={(e) => handleAvailabilityChange(index, "day", e.target.value)}
            className="border rounded px-2 py-1"
          >
            {daysOfWeek.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>

          <input
            type="time"
            value={slot.startTime}
            onChange={(e) => handleAvailabilityChange(index, "startTime", e.target.value)}
            className="border rounded px-2 py-1"
          />

          <input
            type="time"
            value={slot.endTime}
            onChange={(e) => handleAvailabilityChange(index, "endTime", e.target.value)}
            className="border rounded px-2 py-1"
          />

          <button
            onClick={() => removeAvailabilitySlot(index)}
            className="bg-red-600 text-white px-2 py-1 rounded"
          >
            Remove
          </button>
        </div>
      ))}

      <button
        onClick={addAvailabilitySlot}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Add Another Slot
      </button>

      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-2">Your Availability:</h3>
        {availability.length === 0 ? (
          <p>No availability set.</p>
        ) : (
          <ul className="list-disc pl-5 space-y-1">
            {availability.map((slot, index) => (
              <li key={index}>
                {slot.day}: {slot.startTime} - {slot.endTime}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
