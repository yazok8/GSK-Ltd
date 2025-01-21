// components/ui/pagination.tsx

"use client";

import React from "react";
import { Button } from "./button"; // Adjust the import path as needed

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <nav aria-label="Pagination">
      <ul className="inline-flex -space-x-px">
        {/* Previous Button */}
        <li>
          <Button
            variant="ghost"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Previous Page"
          >
            &laquo;
          </Button>
        </li>

        {/* Page Numbers */}
        {pageNumbers.map((number) => (
          <li key={number}>
            <Button
              onClick={() => onPageChange(number)}
              aria-label={`Page ${number}`}
            >
              {number}
            </Button>
          </li>
        ))}

        {/* Next Button */}
        <li>
          <Button
            variant="ghost"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="Next Page"
          >
            &raquo;
          </Button>
        </li>
      </ul>
    </nav>
  );
};
