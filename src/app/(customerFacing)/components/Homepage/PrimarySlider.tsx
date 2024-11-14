// src/app/(customerFacing)/components/Homepage/PrimarySlider.tsx

"use client";

import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { Category } from '@prisma/client';
import Image from 'next/image';

function PrimarySlider() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentIndex, setCurrentIndex] = useState(1); // Start at 1 due to prepended clone
  const [isTransitioning, setIsTransitioning] = useState(true);
  const slideInterval = useRef<NodeJS.Timeout | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const isResettingRef = useRef(false); // Track if a reset is happening

  // Touch states for swipe
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  useEffect(() => {
    // Fetch categories once the component mounts
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (response.ok) {
          const data: Category[] = await response.json();
          if (data.length > 0) {
            // Clone last and first slides
            const clonedData = [
              data[data.length - 1], // Clone of last slide
              ...data,
              data[0], // Clone of first slide
            ];
            setCategories(clonedData);
            setCurrentIndex(1); // Start at first real slide
          }
        } else {
          console.error('Failed to fetch categories');
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (categories.length > 0) {
      startSlideTimer();
    }
    return () => {
      stopSlideTimer();
    };
  }, [currentIndex, categories]);

  const startSlideTimer = () => {
    stopSlideTimer();
    slideInterval.current = setInterval(() => {
      goToNext();
    }, 3000); // Change slide every 3 seconds
  };

  const stopSlideTimer = () => {
    if (slideInterval.current) {
      clearInterval(slideInterval.current);
    }
  };

  const goToPrevious = () => {
    if (isTransitioning) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const goToNext = () => {
    if (isTransitioning) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleTransitionEnd = () => {
    if (currentIndex === 0) {
      // Jump to real last slide
      isResettingRef.current = true;
      setCurrentIndex(categories.length - 2);
    } else if (currentIndex === categories.length - 1) {
      // Jump to real first slide
      isResettingRef.current = true;
      setCurrentIndex(1);
    }
  };

  useLayoutEffect(() => {
    if (isResettingRef.current && sliderRef.current) {
      // Disable transition
      sliderRef.current.style.transition = 'none';
      sliderRef.current.style.transform = `translateX(-${currentIndex * 100}%)`;
      // Force reflow to apply the transform without transition
      void sliderRef.current.offsetWidth;
      // Re-enable transition
      sliderRef.current.style.transition = 'transform 0.7s ease-in-out';
      // Reset the flag
      isResettingRef.current = false;
    }
  }, [currentIndex]);

  const disableTransition = () => {
    if (sliderRef.current) {
      sliderRef.current.style.transition = 'none';
      sliderRef.current.style.transform = `translateX(-${currentIndex * 100}%)`;
      // Force reflow to apply the transform without transition
      void sliderRef.current.offsetWidth;
      // Re-enable transition
      sliderRef.current.style.transition = 'transform 0.7s ease-in-out';
    }
  };

  // Cleanup transition styles on mount
  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.style.transition = 'transform 0.7s ease-in-out';
    }
  }, [categories]);

  // Swipe Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) {
      // Swiped left
      goToNext();
    } else if (distance < -minSwipeDistance) {
      // Swiped right
      goToPrevious();
    }
    setTouchStart(null);
    setTouchEnd(null);
  };

  if (categories.length <= 2) {
    // Need at least one real slide plus two clones
    return <div>Loading...</div>;
  }

  const currentCategory = categories[currentIndex];

  return (
    <div className="relative w-full mx-auto bg-slate-100">
      {/* Slider Container */}
      <div
            className="
            overflow-hidden 
            relative 
            w-full md:w-2/3 lg:w-3/4 xl:w-3/4 
            h-[600px] 
            ml-auto
          "
        onMouseEnter={stopSlideTimer}
        onMouseLeave={startSlideTimer}
      >
        {/* Slides */}
        <div
          ref={sliderRef}
          className={`flex transition-transform duration-700 ease-in-out ${
            isTransitioning ? '' : 'transition-none'
          }`}
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          onTransitionEnd={handleTransitionEnd}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {categories.map((cat, index) => (
            <div key={index} className="relative flex-shrink-0 w-full h-[600px] bg-slate-400">
              <Image
                src={`https://gsk-ltd.s3.us-east-2.amazonaws.com/${cat.image}`}
                alt={cat.name}
                width={1200}
                height={600}
                objectFit="cover"
                quality={100}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        {/* <button
          onClick={() => {
            goToPrevious();
            startSlideTimer();
          }}
          aria-label="Previous Slide"
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 focus:outline-none z-10"
        >
          &#10094;
        </button>
        <button
          onClick={() => {
            goToNext();
            startSlideTimer();
          }}
          aria-label="Next Slide"
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 focus:outline-none z-10"
        >
          &#10095;
        </button> */}

        {/* Dots Navigation */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {categories.slice(1, categories.length - 1).map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(index + 1);
                startSlideTimer();
              }}
              className={`w-3 h-3 rounded-full ${
                currentIndex === index + 1 ? 'bg-gray-800' : 'bg-gray-400'
              } focus:outline-none`}
              aria-label={`Go to slide ${index + 1}`}
            ></button>
          ))}
        </div>
      </div>

      {/* Overlay Div */}
      <div className="absolute top-1/2 left-48 transform -translate-y-1/2 flex flex-col items-start justify-center bg-white bg-opacity-50 text-gray-900 p-4 text-center w-[200px] h-[500px]">
        <h2 className="text-2xl font-bold">{currentCategory.name}</h2>
        <p className="text-lg mt-2">Explore more about {currentCategory.name}</p>
      </div>
    </div>
  );
}

export default PrimarySlider;
