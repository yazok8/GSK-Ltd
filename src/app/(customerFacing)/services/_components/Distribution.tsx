import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import React from "react";
import distribution from "../../../../../public/services/distribution.avif";

export default function Distribution() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-4xl">Distribution</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col lg:flex-row-reverse flex-wrap">
        {/* Image Container */}
        <div className="relative w-full lg:w-1/2 min-w-[900] aspect-w-16 aspect-h-9">
          <Image
            src={distribution}
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
            Since we started, our outstanding Distribution Department has been
            working toward achieving the excellence level of services provided
            to our customers and clients.
          </p>
          <br />
          <p>
            This approach reflects our high level of responsibility and
            credibility that we believe our clients deserve. Golden Waves is
            always ready to provide such services around the Middle East &
            beyond.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
