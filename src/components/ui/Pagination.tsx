import React from "react";
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  baseUrl,
}) => {
  const searchParams = useSearchParams();
  const existingParams = new URLSearchParams(searchParams.toString());
  existingParams.delete('page');
  
  const buildUrl = (page: number) => {
    const params = new URLSearchParams(existingParams);
    params.set('page', page.toString());
    return `${baseUrl}?${params.toString()}`;
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPageLinks = 5;
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
      <li key={number} className="inline-block">
        <Link 
          href={buildUrl(number)} 
          className={`flex items-center justify-center w-10 h-10 mx-1 rounded-full
            ${number === currentPage 
              ? ' text-teal-800' 
              : ' text-teal-800 hover:bg-gray-200'}`}
          aria-current={number === currentPage ? 'page' : undefined}
        >
          {number}
        </Link>
      </li>
    ));
  };

  return (
    <nav aria-label="Pagination" className="flex justify-center items-center my-8">
      <ul className="flex items-center space-x-1">
        <li className="inline-block">
          {currentPage > 1 ? (
            <Link 
              href={buildUrl(currentPage - 1)} 
              className="flex items-center justify-center w-10 h-10 rounded-full text-gray-700 hover:bg-gray-200"
              aria-label="Previous Page"
            >
              &laquo;
            </Link>
          ) : (
            <span 
              className="flex items-center justify-center w-10 h-10 rounded-full text-gray-400 cursor-not-allowed"
              aria-disabled="true"
            >
              &laquo;
            </span>
          )}
        </li>

        {renderPageNumbers()}

        <li className="inline-block">
          {currentPage < totalPages ? (
            <Link 
              href={buildUrl(currentPage + 1)} 
              className="flex items-center justify-center w-10 h-10 rounded-full text-gray-700 hover:bg-gray-200"
              aria-label="Next Page"
            >
              &raquo;
            </Link>
          ) : (
            <span 
              className="flex items-center justify-center w-10 h-10 rounded-full text-gray-400 cursor-not-allowed"
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