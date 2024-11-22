import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import React from "react";
import exportService from "../../../../../public/services/export.avif";

export default function ExportService() {
  return (
    <Card id="export" className="pt-5">
      <CardHeader>
        <CardTitle className="text-4xl">Export</CardTitle>
      </CardHeader>
      <CardContent className="clearfix">
        {/* Image Container */}
        <div className="lg:float-right lg:ml-6 lg:mb-4 w-full lg:w-3/5 mb-4">
          <Image
            src={exportService}
            alt="gsk-distribution"
            layout="responsive"
            width={300} 
            height={200}
            objectFit="cover"
            priority
          />
        </div>

        {/* Text Content */}
        <div className="text-xl">
          <p>
            GSK depends strongly on its professional and long
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
          <p>
            GSK has facilitated the international trading procedure to
            its foreign clients starting with raising their awareness about the
            international trade documents including LC (letter of credit),
            health certificate, Phytosanitary, certificate of origin and other
            documents.
          </p>
          <br />
          <p>
          In addition, the Company achieved a competitive advantage in the
          international market and gained more loyalty from its clients’ base by
          offering valuable and competitive prices that are achievable and
          attainable using its strong relationship with various shipping
          companies, who provide different kinds of transportation - whether by
          air, sea or land.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
