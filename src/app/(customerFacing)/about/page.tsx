import { Card, CardContent } from "@/components/ui/card";
import React from "react";
import AboutImage from "../../../../public/about/about-bannerimage.jpeg";
import GSKLogo from "../../../../public/logo/new-logo.png";
import Image from "next/image";
import MissionVision from "./_components/MissonVison";

export default function AboutPage() {
  return (
    <Card className="relative w-full mx-auto bg-teal-50">
      {/* Main Section with Image and Text Overlay */}
      <CardContent
        className="
          p-0
          overflow-hidden 
          relative 
          w-full 
          h-[300px] md:h-[400px] lg:h-[700px]
        "
      >
        <div className="relative w-full h-full">
          {/* Image Container: 80% Width */}
          <div className="absolute right-0 top-0 w-full md:w-4/5 h-full">
            <Image
              src={AboutImage}
              alt="GSK Services"
              fill
              style={{ objectFit: "cover" }}
              className="rounded-lg"
              loading="lazy"
              placeholder="blur"
              blurDataURL="/placeholder.webp"
            />
          </div>

          {/* Text Overlay: Positioned Absolutely */}
          <div className="absolute left-5 md:left-10 lg:left-20 top-1/2 transform -translate-y-1/2 z-10 max-w-[50%] md:max-w-[30%]">
            <div className="bg-white bg-opacity-60 p-4 md:p-6 rounded-lg inline-block text-center">
              <h2 className="text-xl md:text-2xl font-extrabold">
                World&apos;s Top Food Trading Service
              </h2>
              <p className="mt-3 md:mt-5 text-lg">
                Delivering all types of food, formats, and innovations to help
                you craft the best Food service experience.
              </p>
            </div>
          </div>
        </div>
      </CardContent>

      {/* Secondary Section with Logo and Additional Text */}
      <section className="w-full h-1/2 bg-teal-500 flex items-center justify-center">
        <section className="max-w-[850px] flex flex-col items-center text-center px-4 md:px-0">
          <section className="relative w-64 h-32 md:w-48 md:h-48 lg:w-64 lg:h-64 mb-6 mt-10">
            <Image
              src={GSKLogo}
              alt="GSK Logo"
              fill
              style={{ objectFit: "contain" }}
              loading="lazy"
              className="rounded-full"
            />
          </section>
          <h2 className="text-white font-bold text-4xl mb-4">
            Bringing Innovation and Inspiration to the Table for Over 100 Years
          </h2>
          <p className="text-white text-2xl px-4 pb-20">
            You can count on GSK to provide quality products, excellent service,
            and customized attention to satisfy all your culinary and business
            needs.
          </p>
        </section>
      </section>

      {/* Mission and Vision Section */}
      <MissionVision />

      {/* Contact Section */}
      <div className="text-center mx-auto font-bold my-20 text-3xl">
        <p>
          We Know Food Best. Let GSK international Food Suppler be your trusted
          trading partner.
        </p>
        <br />
        <div className="flex flex-col items-center space-y-4 md:flex-row md:space-y-0 md:space-x-2 justify-center bg-teal-50">
          {/* Replace <p> with <span> for inline text */}
          <span>For general inquiries email:</span>
          <a
            className="underline"
            href="mailto:info@gsk.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <strong>info@gsk.com</strong>
          </a>
        </div>
        <br />
        <p>CONNECT WITH US!</p>
      </div>
    </Card>
  );
}
