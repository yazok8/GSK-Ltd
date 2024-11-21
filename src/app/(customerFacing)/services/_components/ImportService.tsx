import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import React from "react";
import importService from "../../../../../public/services/import.avif";

export default function ImportService() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-4xl">Import</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col lg:flex-row-reverse flex-wrap">
        {/* Image Container */}
        <div className="relative w-full lg:w-1/2 aspect-w-16 aspect-h-9">
          <Image
            src={importService}
            alt="gsk-distribution"
            width={900} // specify desired width
            height={500} // specify desired height
            style={{ objectFit: "fill" }}
            priority
          />
        </div>

        {/* Text Content */}
        <div className="w-full lg:w-1/2 p-3">
          <p>
            Golden Waves is one of the leading import companies in nuts, pulses,
            cooking oils and gees, branded products (e.g. chocolates, soft
            drinks, cheeses, candies.. etc), coffee and spices industry plus
            animals foods.
          </p>
          <br />
          <p>
            As the world is witnessing a huge trends of trading, Golden Waves
            expanded its headquarter to include a dedicated logistics department
            responsible of checking all the received shipment to our premises,
            and making sure that they meet the most efficient and effective
            standards.
          </p>
          <br />
          <br />
          <p>
            Throughout its trip that started more than 80 years ago, Golden
            Waves maintained a trustworthy and strong relationship with its
            suppliers. When dealing with its suppliers, The Company used the CAD
            System (cash against documents) and FOB system (free on board)
            bases. Also, to facilitate the international trading process for our
            suppliers, the Company send a letter of credit to be used by its
            suppliers.
          </p>
          <br />
          <br />
          On another level, while Golden Waves continues to seek competitive
          prices offered by its suppliers, the Company never discarded the high
          quality of the items shipped.
        </div>
      </CardContent>
    </Card>
  );
}
