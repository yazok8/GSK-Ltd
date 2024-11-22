// src/app/(customerFacing)/homepage/_components/PrimarySlider.tsx

"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { Category } from "@prisma/client";
import Image from "next/image";

interface PrimarySliderProps {
  categories: Category[];
}

function PrimarySlider({ categories }: PrimarySliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const slideInterval = useRef<NodeJS.Timeout | null>(null);

  // Function to select slides based on available data
  const selectSlides = (data: Category[]): Category[] => {
    if (data.length === 0) return [];
    const numberOfSlides = Math.min(5, data.length);
    return data.slice(0, numberOfSlides);
  };

  const selectedCategories = selectSlides(categories);

  // Auto-play functionality
  const stopSlideTimer = useCallback(() => {
    if (slideInterval.current) {
      clearInterval(slideInterval.current);
      slideInterval.current = null;
      console.log("Slide timer stopped.");
    }
  }, []);

  const startSlideTimer = useCallback(() => {
    stopSlideTimer(); // Clear any existing interval
    slideInterval.current = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === selectedCategories.length - 1 ? 0 : prev + 1
      );
      console.log("Auto-play to next slide.");
    }, 10000); // Change slide every 10 seconds
    console.log("Slide timer started.");
  }, [selectedCategories.length, stopSlideTimer]);

  useEffect(() => {
    if (selectedCategories.length > 0) {
      startSlideTimer();
    }
    return () => {
      stopSlideTimer();
    };
  }, [selectedCategories, startSlideTimer, stopSlideTimer]);

  // Navigation functions
  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) =>
      prev === 0 ? selectedCategories.length - 1 : prev - 1
    );
    console.log("Navigated to previous slide.");
  }, [selectedCategories.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) =>
      prev === selectedCategories.length - 1 ? 0 : prev + 1
    );
    console.log("Navigated to next slide.");
  }, [selectedCategories.length]);

  // Swipe Handlers
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
    console.log(
      "Touch start detected at position:",
      e.targetTouches[0].clientX
    );
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
    console.log("Touch move detected at position:", e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart === null || touchEnd === null) return;
    const distance = touchStart - touchEnd;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) {
      // Swiped left
      goToNext();
      console.log("Swipe detected: Left");
    } else if (distance < -minSwipeDistance) {
      // Swiped right
      goToPrevious();
      console.log("Swipe detected: Right");
    }
    setTouchStart(null);
    setTouchEnd(null);
  };

  // Fallback UI for insufficient data
  if (selectedCategories.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-200">
        <p className="text-gray-500">No categories to display.</p>
      </div>
    );
  }

  const currentCategory = selectedCategories[currentIndex];

  return (
    <div className="relative w-full mx-auto bg-teal-50">
      {/* Slider Container */}
      <div
        className="
          overflow-hidden 
          relative 
          w-full md:w-2/3 lg:w-3/4 xl:w-3/4 
          h-[300px] md:h-[400px] lg:h-[700px]
          ml-auto
        "
        onMouseEnter={stopSlideTimer}
        onMouseLeave={startSlideTimer}
      >
        {/* Slides */}
        <div
          className="flex transition-transform duration-500 ease-in-out h-full"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {selectedCategories.map((cat) => (
            <div
              key={cat.id}
              className="relative flex-shrink-0 w-full h-full bg-slate-400"
            >
              <Image
                src={`https://gsk-ltd.s3.us-east-2.amazonaws.com/${cat.image}`}
                alt={cat.name}
                width={1920}
                height={1080}
                className="w-full h-full object-cover"
                loading="lazy"
                placeholder="blur"
                blurDataURL="/placeholder.webp"
                onError={(e) => {
                  e.currentTarget.src = "/fallback.png";
                  console.error(
                    `Failed to load image for category ID ${cat.id}. Using fallback image.`
                  );
                }}
              />
            </div>
          ))}
        </div>

        {/* Dots Navigation */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
          {selectedCategories.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                console.log(`Dot ${index + 1} clicked`);
                setCurrentIndex(index);
                startSlideTimer();
              }}
              className={`w-3 h-3 rounded-full ${
                currentIndex === index ? "bg-gray-800" : "bg-gray-400"
              } focus:outline-none`}
              aria-label={`Go to slide ${index + 1}`}
            ></button>
          ))}
        </div>
      </div>
      {currentCategory && (
        <div className="absolute left-4 md:left-20 xl:left-48 inset-y-0 flex items-center">
          <div className="bg-white bg-opacity-50 text-gray-900 p-6 rounded-lg">
            <h2 className="text-2xl font-bold">{currentCategory.name}</h2>
            <p className="mt-2 text-lg">Explore more about {currentCategory.name}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default PrimarySlider;
