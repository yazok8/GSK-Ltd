"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface Tab {
  label: string;
  path: string;
}

interface AdminNavContextType {
  tabs: Tab[];
  addTab: (tab: Tab) => void;
  removeTab: (path: string) => void;
}

const AdminNavContext = createContext<AdminNavContextType | undefined>(undefined);

export const AdminNavProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tabs, setTabs] = useState<Tab[]>([]);

  const addTab = (tab: Tab) => {
    setTabs((prevTabs) => {
      // Prevent duplicate tabs
      if (prevTabs.find((t) => t.path === tab.path)) return prevTabs;
      return [...prevTabs, tab];
    });
  };

  const removeTab = (path: string) => {
    setTabs((prevTabs) => prevTabs.filter((tab) => tab.path !== path));
  };

  return (
    <AdminNavContext.Provider value={{ tabs, addTab, removeTab }}>
      {children}
    </AdminNavContext.Provider>
  );
};

export const useAdminNav = () => {
  const context = useContext(AdminNavContext);
  if (!context) {
    throw new Error("useAdminNav must be used within an AdminNavProvider");
  }
  return context;
};
