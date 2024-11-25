import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import React from "react";
import distribution from "../../../../../public/services/distribution.avif";

export default function Distribution() {
  return (
    <Card id="distribution" className="shadow-non pt-10">
      <CardHeader>
        <CardTitle className="text-4xl">Distribution</CardTitle>
      </CardHeader>
      <CardContent className="clearfix">
        {/* Image Container */}
        <div className="lg:float-right lg:ml-6 lg:mb-4 w-full lg:w-3/5 mb-4">
          <Image
            src={distribution}
            alt="gsk-distribution"
            layout="responsive"
            width={300} 
            height={200}
            priority
            style={{ objectFit: 'cover' }}
          />
        </div>

        {/* Text Content */}
        <div className="text-xl">
          <p>
            Since we started, our outstanding Distribution Department has been
            working toward achieving the excellence level of services provided
            to our customers and clients.
          </p>
          <br />
          <p>
            This approach reflects our high level of responsibility and
            credibility that we believe our clients deserve. GSK is
            always ready to provide such services around the Middle East &
            beyond.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
