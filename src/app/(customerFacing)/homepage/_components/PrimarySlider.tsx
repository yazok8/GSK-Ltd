// src/app/(customerFacing)/components/Homepage/PrimarySlider.tsx

"use client";

import React, { useEffect, useState, useRef } from "react";
import { Category } from "@prisma/client";
import Image from "next/image";
import debounce from "lodash.debounce";

function PrimarySlider() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0); // Start at first slide
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const slideInterval = useRef<NodeJS.Timeout | null>(null);

  // Touch states for swipe
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Helper function to start the slide timer
  const startSlideTimer = () => {
    stopSlideTimer(); // Clear any existing interval
    slideInterval.current = setInterval(() => {
      goToNext();
    }, 10000); // Change slide every 3 seconds
    console.log("Slide timer started.");
  };

  // Helper function to stop the slide timer
  const stopSlideTimer = () => {
    if (slideInterval.current) {
      clearInterval(slideInterval.current);
      slideInterval.current = null;
      console.log("Slide timer stopped.");
    }
  };

  // Debounced navigation functions to prevent rapid state changes
  const goToPrevious = debounce(() => {
    setCurrentIndex((prev) => (prev === 0 ? categories.length - 1 : prev - 1));
    console.log("Navigated to previous slide.");
  }, 300); // Debounce duration aligns with any future needs

  const goToNext = debounce(() => {
    setCurrentIndex((prev) => (prev === categories.length - 1 ? 0 : prev + 1));
    console.log("Navigated to next slide.");
  }, 300);

  // Fetch categories once the component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("/api/categories");
        if (response.ok) {
          const data: Category[] = await response.json();
          console.log("Fetched categories from API:", data);
          if (data.length >= 1) {
            // Select desired slides dynamically based on available data
            const selectedCategories = selectSlides(data);
            if (selectedCategories.length > 0) {
              setCategories(selectedCategories);
              setCurrentIndex(0); // Start at first slide
              console.log("Slider data initialized with:", selectedCategories);
            } else {
              console.error("No valid categories selected for the slider.");
              setError("No categories available to display in the slider.");
            }
          } else {
            console.error("Fetched categories array is empty.");
            setError("No categories available to display in the slider.");
          }
        } else {
          console.error("Failed to fetch categories. Status:", response.status);
          setError("Failed to fetch categories.");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError("An error occurred while fetching categories.");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Function to select slides based on available data
  const selectSlides = (data: Category[]): Category[] => {
    const selectedSlides: Category[] = [];
    const desiredIndices = [0, 3, 6]; // 1st, 4th, and 7th slides

    desiredIndices.forEach((index) => {
      if (data[index]) {
        selectedSlides.push(data[index]);
      }
    });

    return selectedSlides;
  };

  // Auto-play functionality
  useEffect(() => {
    if (categories.length > 0) {
      startSlideTimer();
    }
    return () => {
      stopSlideTimer();
    };
  }, [categories]);

  // Swipe Handlers
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

  // Fallback UI for loading, error, and insufficient data
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-200">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-200">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-200">
        <p className="text-gray-500">No categories to display.</p>
      </div>
    );
  }

  const currentCategory = categories[currentIndex];

  return (
    <div className="relative w-full mx-auto bg-teal-50">
      {/* Slider Container */}
      <div
        className="
          overflow-hidden 
          relative 
          w-full md:w-2/3 lg:w-3/4 xl:w-3/4 
          h-full
          aspect-video
          ml-auto
        "
        onMouseEnter={stopSlideTimer}
        onMouseLeave={startSlideTimer}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Slides */}
        <div className="flex transition-none">
          {categories.map((cat, index) => (
            <div
              key={cat.id} // Use unique identifier
              className={`relative flex-shrink-0 aspect-video w-full ${
                index === currentIndex ? "block" : "hidden"
              } bg-slate-400`}
            >
              <Image
                src={`https://gsk-ltd.s3.us-east-2.amazonaws.com/${cat.image}`}
                alt={cat.name}
                fill
                style={{ objectFit: "cover" }}
                quality={80}
                className="object-cover"
                loading="lazy"
                placeholder="blur" // Enables blur-up effect
                blurDataURL="/placeholder.webp" // Path to the placeholder image in 'public'
                onError={(e) => {
                  e.currentTarget.src = "/fallback.png"; // Path to a fallback image in 'public'
                  console.error(
                    `Failed to load image for category ID ${cat.id}. Using fallback image.`
                  );
                }}
              />
            </div>
          ))}
        </div>

        {/* Dots Navigation */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {categories.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(index);
                startSlideTimer();
                console.log(`Navigated to slide ${index + 1} via dots.`);
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
        <div className="absolute left-20 xl:left-48 inset-0 flex items-center justify-start">
          <div className="bg-white bg-opacity-50 text-gray-900 p-6 rounded-lg">
            <h2 className="text-2xl font-bold">{currentCategory.name}</h2>
            <p className="mt-2">Explore more about {currentCategory.name}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default PrimarySlider;
