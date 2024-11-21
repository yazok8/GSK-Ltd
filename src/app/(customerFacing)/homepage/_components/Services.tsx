import Image from "next/image";
import React from "react";
import distribution from "../../../../../public/services/distribution.avif";
import importService from "../../../../../public/services/import.avif";
import exportService from "../../../../../public/services/export.avif";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Services() {
  return (
    <Card id="#serices">
      <CardHeader className="mx-auto text-center">
        <CardTitle className="text-5xl">Our Services</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center space-x-8">
        <div>
          <div className="">
            <Image
              src={importService}
              width={500}
              height={500}
              alt="gsk-import"
            />
          </div>
          <h1 className="text-xl font-bold">Food Import</h1>
          <div className="line-clamp-2 text-lg max-w-[500px]">
            Golden Waves is one of the leading import companies in nuts, pulses,
            cooking oils and gees, branded products (e.g. chocolates, soft
            drinks, cheeses, candies.. etc), coffee and spices industry plus
            animals foods.
          </div>
          <Link
            href="/services"
            className="text-lg font-bold border-b-4 border-b-blue-500 text-blue-800"
          >
            Learn More
          </Link>
        </div>
        <div>
          <div className="">
            <Image
              src={distribution}
              width={500}
              height={500}
              alt="gsk-distribution"
            />
          </div>
          <h1 className="text-xl font-bold">Food Distribution</h1>
          <div className="line-clamp-2 text-lg max-w-[500px]">
            Since we started, our outstanding Distribution Department has been
            working toward achieving the excellence level of services provided
            to our customers and clients.
          </div>
          <Link
            href="/services"
            className="text-lg font-bold border-b-4 border-b-blue-500 text-blue-800"
          >
            Learn More
          </Link>
        </div>
        <div>
          <div className="">
            <Image
              src={exportService}
              width={500}
              height={500}
              alt="gsk-export"
            />
          </div>
          <h1 className="text-xl font-bold">Food Export</h1>
          <div className="line-clamp-2 text-lg max-w-[500px]">
            Golden Waves depends strongly on its professional and long
            experience in international trading. ​
          </div>
          <Link
            href="/services"
            className="text-lg font-bold border-b-4 border-b-blue-500 text-blue-800"
          >
            Learn More
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
