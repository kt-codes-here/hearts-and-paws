"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface UserData {
  id: string;
  role: number;
  email: string;
  // ...other fields
}

interface UserContextType {
  userData: UserData | null;
  setUserDatas: (user: UserData | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [userData, setUserDatas] = useState<UserData | null>(null);
  return (
    <UserContext.Provider value={{ userData, setUserDatas }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
}
