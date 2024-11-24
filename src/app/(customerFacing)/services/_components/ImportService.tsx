import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import React from "react";
import importService from "../../../../../public/services/import.avif";

export default function ImportService() {
  return (
    <Card id="import" className="pt-10">
      <CardHeader>
        <CardTitle className="text-4xl">Import</CardTitle>
      </CardHeader>
      <CardContent className="clearfix">
        {/* Image Container */}
        <div className="lg:float-right lg:ml-6 lg:mb-4 w-full lg:w-3/5 mb-4">
          <Image
            src={importService}
            alt="GSK Import Service"
            layout="responsive" // For Next.js 12 and below
            width={300} // Set based on your design
            height={200} // Maintain aspect ratio (e.g., 3:2)
            objectFit="cover" // Adjust as needed ('cover' or 'contain')
            priority
          />
        </div>

        {/* Text Content */}
        <div className="text-xl">
          <p>
            GSK is one of the leading import companies in nuts, pulses,
            cooking oils and gees, branded products (e.g., chocolates, soft
            drinks, cheeses, candies, etc.), coffee and spices industry plus
            animal foods.
          </p>
          <br />
          <p>
            As the world is witnessing huge trends in trading, GSK
            expanded its headquarters to include a dedicated logistics department
            responsible for checking all received shipments to our premises,
            ensuring they meet the most efficient and effective standards.
          </p>
          <br />
          <p>
            Throughout its journey that started more than 80 years ago, Golden
            Waves has maintained a trustworthy and strong relationship with its
            suppliers. When dealing with suppliers, the Company used the CAD
            System (cash against documents) and FOB system (free on board)
            bases. Additionally, to facilitate the international trading process
            for our suppliers, the Company sends a letter of credit to be used by
            its suppliers.
          </p>
          <br />
          <p>
            On another level, while GSK continues to seek competitive
            prices offered by its suppliers, the Company never compromises on the
            high quality of the items shipped.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
