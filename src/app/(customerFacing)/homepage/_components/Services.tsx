// components/Services.tsx

"use client";

import React from "react";
import importService from "../../../../../public/services/import.avif";
import distribution from "../../../../../public/services/distribution.avif";
import exportService from "../../../../../public/services/export.avif";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ServiceCard from "../../services/_components/ServiceCard";
import Image, { StaticImageData } from "next/image";

interface Service {
  id: number;
  title: string;
  description: string;
  image: StaticImageData;
  alt: string;
  link: string;
}

const servicesData: Service[] = [
  {
    id: 1,
    title: "Food Import",
    description:
      "Golden Waves is one of the leading import companies in nuts, pulses, cooking oils and gees, branded products (e.g. chocolates, soft drinks, cheeses, candies.. etc), coffee and spices industry plus animals foods.",
    image: importService,
    alt: "GSK Import Service",
    link: "/services/#import",
  },
  {
    id: 2,
    title: "Food Distribution",
    description:
      "Since we started, our outstanding Distribution Department has been working toward achieving the excellence level of services provided to our customers and clients.",
    image: distribution,
    alt: "GSK Distribution Service",
    link: "/services/#distribution",
  },
  {
    id: 3,
    title: "Food Export",
    description:
      "Golden Waves depends strongly on its professional and long experience in international trading.",
    image: exportService,
    alt: "GSK Export Service",
    link: "/services/#export",
  },
  // Add more services as needed
];

export default function Services() {
  return (
    <Card id="services" className="my-10">
      <CardHeader className="mx-auto text-center">
        <CardTitle className="text-5xl font-bold">Our Services</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicesData.map((service) => (
            <ServiceCard
              key={service.id}
              title={service.title}
              description={service.description}
              image={service.image}
              alt={service.alt}
              link={service.link}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
