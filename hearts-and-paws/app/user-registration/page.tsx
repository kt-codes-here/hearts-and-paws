// app/user-registration/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import * as RadioGroup from "@radix-ui/react-radio-group";
import { Input } from "@/components/ui/input";

export default function UserRegistration() {
  const router = useRouter();
  const { user, isLoaded } = useUser();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [address, setAddress] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [contact, setContact] = useState("");

  // Prefill first and last name if available from Clerk
  useEffect(() => {
    if (isLoaded && user) {
      if (user.firstName) setFirstName(user.firstName);
      if (user.lastName) setLastName(user.lastName);
    }
  }, [isLoaded, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (role === null) {
      setError("Please select a role.");
      return;
    }
    if (!firstName.trim() || !lastName.trim()) {
      setError("Please provide both first name and last name.");
      return;
    }

    let requestBody: any = { role, firstName, lastName };

    if (role === 3) {
      if (!businessName.trim() || !address.trim() || !serviceType.trim() || !contact.trim()) {
        setError("Please fill in all service provider details.");
        return;
      }
  
      requestBody = {
        ...requestBody,
        businessName,
        address,
        serviceType,
        contact,
      };
    }

    
    const res = await fetch("/api/user-registration", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });
    if (res.ok) {
      // Redirect based on the numeric role
      if (role === 1) {
        router.push("/adopter-dashboard");
      } else if (role === 2) {
        router.push("/rehomer-dashboard");
      } else if (role === 3) {
        router.push("/service-provider-dashboard");
      }
    } else {
      setError("Error completing registration.");
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "2rem" }}>
      <h1 style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        Complete Your Registration
      </h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="firstName" style={{ display: "block", fontWeight: "bold" }}>
            First Name:
          </label>
          <input
            id="firstName"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            style={{
              display: "block",
              width: "100%",
              padding: "0.5rem",
              marginTop: "0.5rem",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="lastName" style={{ display: "block", fontWeight: "bold" }}>
            Last Name:
          </label>
          <input
            id="lastName"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            style={{
              display: "block",
              width: "100%",
              padding: "0.5rem",
              marginTop: "0.5rem",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
        </div>
        <div style={{ marginBottom: "1.5rem" }}>
          <p style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>Select Your Role:</p>
          <RadioGroup.Root
            value={role ? role.toString() : ""}
            onValueChange={(value) => setRole(parseInt(value))}
            style={{ display: "flex", gap: "1.5rem" }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <RadioGroup.Item
                value="1"
                id="role-1"
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  border: "1px solid #ccc",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <RadioGroup.Indicator
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    backgroundColor: "black",
                  }}
                />
              </RadioGroup.Item>
              <label htmlFor="role-1" style={{ marginLeft: "0.5rem" }}>
                Adopter
              </label>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <RadioGroup.Item
                value="2"
                id="role-2"
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  border: "1px solid #ccc",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <RadioGroup.Indicator
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    backgroundColor: "black",
                  }}
                />
              </RadioGroup.Item>
              <label htmlFor="role-2" style={{ marginLeft: "0.5rem" }}>
                Rehomer
              </label>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <RadioGroup.Item
                value="3"
                id="role-3"
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  border: "1px solid #ccc",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <RadioGroup.Indicator
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    backgroundColor: "black",
                  }}
                />
              </RadioGroup.Item>
              <label htmlFor="role-3" style={{ marginLeft: "0.5rem" }}>
                Service Provider
              </label>
            </div>
          </RadioGroup.Root>
        </div>
        {error && <p style={{ color: "red", marginBottom: "1rem" }}>{error}</p>}

        {role === 3 && (
          <>
            <div>
              <label>Business Name</label>
              <Input
              id="businessName"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Address</label>
              <Input
              id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Service Type</label>
              <Input
              id="serviceType"
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Contact Number</label>
              <Input
              id="contact"
                type="tel"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                required
              />
            </div>
          </>
        )}
        <button
          type="submit"
          style={{
            padding: "0.75rem 1.5rem",
            backgroundColor: "#6b46c1",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            width: "100%",
          }}
        >
          Complete Registration
        </button>
      </form>
    </div>
  );
}
