"use client";
import React, { createContext, useContext } from "react";
// app/student/AuthProvider.jsx

const AppContext = createContext();

export function useAuth() {
  return useContext(AppContext);
}

export default function AuthProvider({ children, accountId }) {
  return (
    <AppContext.Provider value={{ accountId }}>{children}</AppContext.Provider>
  );
}
