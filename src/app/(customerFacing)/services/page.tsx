import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import Distribution from "./_components/Distribution";
import ImportService from "./_components/ImportService";
import ExportService from "./_components/ExportService";

export default function ServicesPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="underline text-4xl">About Our Services</CardTitle>
      </CardHeader>
      <CardContent>
        Golden Waves is a leading import & export company in the nuts, pulses,
        coffee, spices industry in addition to a wide range of wholesale
        products. The Company imports top quality products from Europe, Turkey,
        Brazil, India, Indonesia, Vietnam, China, USA, Canada and other
        countries. ​<br />
        <br />
        Golden Waves also export to many countries like Libya, morocco, Iraq,
        Jordan, Egypt, UAE, Yemen, USA & Canada.
        <br />
        Offering all clients valuable and competitive quality & prices that are
        achievable and using different kinds of transportations - whether by
        air, sea or land.
        <br />
        <br />
        Our company is now internationally recognized due to the strong
        commitment teams toward accurate material supply and superior products.
        Our dedicated teams work continuously on building new relationships with
        established or emerging producers and dealers from all around the world,
        providing them with services that reflect our solid business strategy,
        decades of experience, and professionalism. ​<br />
        <br />
        Since the establishment, the Distribution Teams at Golden Waves has
        worked hard to provide the best services to our customers & clients,
        reflecting a high level of responsibility & credibility that we believe
        our clients deserve!
      </CardContent>
      <ImportService/>
      <ExportService/>
      <Distribution/>
    </Card>
  );
}
