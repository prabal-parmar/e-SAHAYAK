import React, { createContext, ReactNode, useContext, useState } from "react";

interface EMPLOYER {
    username: string;
    org_name: string;
    email: string;
    location: string;
    contact_number: string;
}

interface EmployerContextType {
    employer: EMPLOYER | null;
    setEmployer: React.Dispatch<React.SetStateAction<EMPLOYER | null>>;
}

const EmployerContext = createContext<EmployerContextType | undefined>(undefined);

export const EmployerProvider = ({ children }: { children: ReactNode }) => {
    const [employer, setEmployer] = useState<EMPLOYER | null>(null);

    return (
    <EmployerContext.Provider value={{ employer, setEmployer }}>
      {children}
    </EmployerContext.Provider>
  )
}

export const useEmployer = () => {
  const context = useContext(EmployerContext);
  if (!context) {
    throw new Error("useEmployer must be used for Employer only");
  }
  return context;
};