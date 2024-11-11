// src/context/AdminNavContext.tsx

"use client";

import React, { createContext, useContext, useState } from 'react';

interface Tab {
  path: string;
  label: string;
}

interface AdminNavContextProps {
  tabs: Tab[];
  addTab: (tab: Tab) => void;
  removeTab: (path: string) => void;
}

const AdminNavContext = createContext<AdminNavContextProps | undefined>(undefined);

export const useAdminNav = () => {
  const context = useContext(AdminNavContext);
  if (!context) {
    throw new Error('useAdminNav must be used within an AdminNavProvider');
  }
  return context;
};

export const AdminNavProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tabs, setTabs] = useState<Tab[]>([]); // Corrected type

  const addTab = (tab: Tab) => {
    setTabs((prevTabs) => {
      if (!prevTabs.find((t) => t.path === tab.path)) {
        return [...prevTabs, tab];
      }
      return prevTabs;
    });
  };

  const removeTab = (path: string) => {
    setTabs((prevTabs) => prevTabs.filter((t) => t.path !== path));
  };

  return (
    <AdminNavContext.Provider value={{ tabs, addTab, removeTab }}>
      {children}
    </AdminNavContext.Provider>
  );
};
