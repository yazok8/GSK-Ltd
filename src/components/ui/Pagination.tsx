// components/ui/Pagination.tsx

"use client";

import React from "react";
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string; // e.g., '/category/[id]' or '/products'
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  baseUrl,
}) => {
  const searchParams = useSearchParams();
  
  // Extract existing query parameters except 'page'
  const existingParams = new URLSearchParams(searchParams.toString());
  existingParams.delete('page');
  
  const buildUrl = (page: number) => {
    const params = new URLSearchParams(existingParams);
    params.set('page', page.toString());
    return `${baseUrl}?${params.toString()}`;
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPageLinks = 5; // Maximum number of page links to display
    let startPage = Math.max(1, currentPage - Math.floor(maxPageLinks / 2));
    let endPage = startPage + maxPageLinks - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxPageLinks + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers.map((number) => (
      <li key={number}>
        <Link 
          href={buildUrl(number)} 
          className={`mx-1 px-3 py-1 rounded ${number === currentPage ? ' text-teal-800' : ' hover:bg-gray-300'}`}
          aria-current={number === currentPage ? 'page' : undefined}
        >
          {number}
        </Link>
      </li>
    ));
  };

  return (
    <nav aria-label="Pagination">
      <ul className="inline-flex -space-x-px">
        {/* Previous Button */}
        <li>
          {currentPage > 1 ? (
            <Link 
              href={buildUrl(currentPage - 1)} 
              className="mx-2 px-4 py-2 rounded hover:bg-gray-300"
              aria-label="Previous Page"
            >
              &laquo;
            </Link>
          ) : (
            <span 
              className="mx-2 px-4 py-2 rounded cursor-not-allowed opacity-50"
              aria-disabled="true"
            >
              &laquo;
            </span>
          )}
        </li>

        {/* Page Numbers */}
        {renderPageNumbers()}

        {/* Next Button */}
        <li>
          {currentPage < totalPages ? (
            <Link 
              href={buildUrl(currentPage + 1)} 
              className="mx-2 px-4 py-2 rounded hover:bg-gray-300"
              aria-label="Next Page"
            >
              &raquo;
            </Link>
          ) : (
            <span 
              className="mx-2 px-4 py-2 rounded cursor-not-allowed opacity-50"
              aria-disabled="true"
            >
              &raquo;
            </span>
          )}
        </li>
      </ul>
    </nav>
  );
};
