import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import services from "../../../../public/services/services.avif";
import Image from "next/image";

export default function AboutPage() {
  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>About US</CardTitle>
      </CardHeader>
      <CardContent className="max-w-screen text-lg flex justify-between border-b-none">
        <div>
        ​​The Founder of Golden Waves established this inherited business GSK since
        1930s in Palestine under the name of Shakeeb Khirfan Group & started to
        built a vast network of clients and a wide range of distribution
        channels worldwide. The comprehensive international trade company is
        part of Shakeeb Khirfan Group, one of the Middle East&apos;s earliest
        manufacturing and trading companies among the world.
        <br />
        Golden Waves for Trading and Investment as the international trade arm
        of Shakeeb Khirfan Group, Golden Waves is specialized in international
        wholesale and bulk trading of coffee, sesame, spices, herbs, grains &
        much more. Golden Waves combined international trade experience with
        knowledge of the global marketplace, in order to set up a strong base of
        clients and partners. Today, Golden Waves is one of most connected
        international traders in the Middle East & rest of the world.
        </div>
        <div
              className="relative flex-shrink-0 aspect-video"
            >
          <Image
            src={services}
            alt="gsk-food-services"
            width={700}
            height={500}
            quality={80}
            loading="lazy"
            style={{ objectFit: "cover" }}
          ></Image>
        </div>
      </CardContent>
    </Card>
  );
}
