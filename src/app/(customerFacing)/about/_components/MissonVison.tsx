import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import vision from "../../../../../public/about/vision.jpg";
import mission from "../../../../../public/about/mission.jpg";
import Image from "next/image";

export default function MissonVison() {
  return (
    <div>
      <Card className=" bg-teal-50 text-teal-500">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl text-start font-extrabold">OUR VISION</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col-reverse lg:flex-row justify-between text-2xl">
          <div>
            To be the foremost global trading partner, recognized for our
            excellence in sourcing and delivering premium products, while
            fostering sustainable growth and enduring relationships worldwide.
          </div>
          <div className="relative flex-shrink-0 aspect-video pb-5 lg:pb-0">
        <Image
                src={vision}
                alt="gsk-vision"
                width={500}
                height={260}
                className="w-full h-full object-cover"
                loading="lazy"
                placeholder="blur"
                blurDataURL="/placeholder.webp"
        
              />
        </div>
        </CardContent>
      </Card>
      <Card className=" bg-teal-50 text-teal-500">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl text-start font-extrabold">OUR MISSION</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col-reverse lg:flex-row justify-between text-2xl">
          <div>
          <ul className="list-item">
            <li>
              <strong>Excellence in Quality:</strong> Deliver superior products
              that consistently meet and exceed our clients’ expectations.
            </li>
            <li>
              <strong>Global Expansion:</strong> Continuously broaden our
              international network to provide seamless trading solutions across
              diverse markets.
            </li>
            <li>
              <strong>Customer Focus:</strong> Cultivate lasting partnerships by
              deeply understanding and addressing the unique needs of our
              clients.
            </li>
            <li>
              <strong>Integrity and Transparency:</strong> Uphold the highest
              ethical standards in all our business practices, ensuring trust
              and reliability.
            </li>
            <li>
              <strong>Sustainable Practices:</strong> Promote and implement
              sustainable trade practices that benefit our communities and
              protect the environment.
            </li>
          </ul>
          </div>
          <div className="relative flex-shrink-0 aspect-video pb-5 lg:pb-0">
        <Image
                src={mission}
                alt="gsk-vision"
                width={500}
                height={300}
                className="w-full h-full object-cover"
                loading="lazy"
                placeholder="blur"
                blurDataURL="/placeholder.webp"
        
              />
        </div>
        </CardContent>
      </Card>
    </div>
  );
}
