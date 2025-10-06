import React, { createContext, ReactNode, useContext, useState } from "react";

type GenderKey = "M" | "F" | "O";

interface WORKER {
  firstName: string;
  lastName: string;
  username: string;
  contactNumber: string;
  gender: GenderKey;
  skill: string;
  address: string;
}

interface WorkerContextType {
    worker: WORKER | null;
    setWorker: React.Dispatch<React.SetStateAction<WORKER | null>>;
}

const WorkerContext = createContext<WorkerContextType | undefined>(undefined);

export const WorkerProvider = ({ children }: { children: ReactNode }) => {
    const [worker, setWorker] = useState<WORKER | null>(null);

    return (
    <WorkerContext.Provider value={{ worker, setWorker }}>
      {children}
    </WorkerContext.Provider>
  )
}

export const useWorker = () => {
  const context = useContext(WorkerContext);
  if (!context) {
    throw new Error("WORKER must be used for worker only");
  }
  return context;
};