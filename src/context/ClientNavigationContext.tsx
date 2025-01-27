"use client";

// Import necessary React hooks and types
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Category } from '@prisma/client';

// Define the shape of the context's value
interface NavigationContextProps {
  categories: Category[];
  fetchCategories: () => void;
}

// Create the NavigationContext with an undefined default value
const NavigationContext = createContext<NavigationContextProps | undefined>(undefined);

/**
 * NavigationProvider component that wraps its children with NavigationContext.
 * It manages the state and fetching of categories from the API.
 */
export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State to hold the list of categories
  const [categories, setCategories] = useState<Category[]>([]);

  /**
   * Fetches categories from the '/api/categories' endpoint and updates the state.
   */
  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data: Category[] = await response.json();
        setCategories(data);
      } else {
        console.error('Failed to fetch categories');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // useEffect to fetch categories when the provider mounts
  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    // Provide the categories and fetchCategories function to child components
    <NavigationContext.Provider value={{ categories, fetchCategories }}>
      {children}
    </NavigationContext.Provider>
  );
};

/**
 * Custom hook to consume the NavigationContext.
 * Throws an error if used outside of a NavigationProvider.
 */
export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};
