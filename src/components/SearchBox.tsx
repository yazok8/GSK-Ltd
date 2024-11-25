"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { FaSearch } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Loader2 } from "lucide-react";

// Define the structure for search results from the API
interface SearchResult {
  id: string;
  name: string;
  type: "category" | "product";
  price?: number; // Optional price field for products
}

export default function SearchBox() {
  // State management for search functionality
  const [isOpen, setIsOpen] = useState(false);        
  const [query, setQuery] = useState("");             
  const [results, setResults] = useState<SearchResult[]>([]); 
  const [isLoading, setIsLoading] = useState(false);  
  const router = useRouter();
  
  // Ref for handling clicks outside the search component
  const commandRef = useRef<HTMLDivElement>(null);

  // Handle clicks outside the search component to close the dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (commandRef.current && !commandRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch search results with debouncing
  useEffect(() => {
    const fetchResults = async () => {
      // Don't search if query is empty
      if (!query) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (response.ok) {
          const data = await response.json();
          setResults(data);
        }
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce search requests by 300ms to prevent excessive API calls
    const timeoutId = setTimeout(fetchResults, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  // Handle selection of a search result
  const handleSelect = (result: SearchResult) => {
    setIsOpen(false);
    // Navigate to appropriate page based on result type
    if (result.type === "category") {
      router.push(`/category/${result.id}`);
    } else {
      router.push(`/products/${result.id}`);
    }
  };

  return (
    <div className="relative w-full lg:w-96" ref={commandRef}>
      {/* Search Input Field */}
      <div className="relative">
        <Input
          placeholder="Search products and categories..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onClick={() => setIsOpen(true)}
          className="w-full bg-white pr-10"
        />
        {/* Search Icon */}
        <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (
        <Command className="absolute top-full mt-1 w-full z-50 bg-white rounded-lg shadow-lg border">
          <CommandList>
            {/* Loading State */}
            {isLoading ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
              </div>
            ) : (
              <>
                {/* Empty State */}
                <CommandEmpty>No results found.</CommandEmpty>
                {results.length > 0 && (
                  <>
                    {/* Categories Section */}
                    <CommandGroup heading="Categories">
                      {results
                        .filter((result) => result.type === "category")
                        .map((result) => (
                          <CommandItem
                            key={result.id}
                            onSelect={() => handleSelect(result)}
                            className="cursor-pointer"
                          >
                            <span>{result.name}</span>
                          </CommandItem>
                        ))}
                    </CommandGroup>
                    {/* Products Section */}
                    <CommandGroup heading="Products">
                      {results
                        .filter((result) => result.type === "product")
                        .map((result) => (
                          <CommandItem
                            key={result.id}
                            onSelect={() => handleSelect(result)}
                            className="cursor-pointer"
                          >
                            <div className="flex justify-between w-full">
                              <span>{result.name}</span>
                              {result.price && (
                                <span className="text-sm text-gray-500">
                                  ${result.price.toFixed(2)}
                                </span>
                              )}
                            </div>
                          </CommandItem>
                        ))}
                    </CommandGroup>
                  </>
                )}
              </>
            )}
          </CommandList>
        </Command>
      )}
    </div>
  );
}