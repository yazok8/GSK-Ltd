import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import React from "react";
import exportService from "../../../../../public/services/export.avif";

export default function ExportService() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-4xl">Export</CardTitle>
      </CardHeader>
         <CardContent className="flex flex-col lg:flex-row-reverse flex-wrap">
        {/* Image Container */}
        <div className="relative w-full lg:w-1/2 aspect-w-16 aspect-h-9">
          <Image
            src={exportService}
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
            Golden Waves depends strongly on its professional and long
            experience in international trading.
          </p>
          <br />
          <p>
            Being one of the leading export companies in the region made Golden
            Waves focus more on acquiring and realizing bigger share in each
            market.as well as exceeding its horizons and expanding its channels
            to reach out to a bigger customers & clients base in different
            regions.
          </p>
          <br />
          <br />
          <p>
            Golden Waves has facilitated the international trading procedure to
            its foreign clients starting with raising their awareness about the
            international trade documents including LC (letter of credit),
            health certificate, Phytosanitary, certificate of origin and other
            documents.
          </p>
          <br />
          <br />
          In addition, the Company achieved a competitive advantage in the
          international market and gained more loyalty from its clients’ base by
          offering valuable and competitive prices that are achievable and
          attainable using its strong relationship with various shipping
          companies, who provide different kinds of transportation - whether by
          air, sea or land.
        </div>
      </CardContent>
    </Card>
  );
}
