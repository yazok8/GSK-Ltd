import React from 'react'
import { prisma } from '@/lib/prisma'
import Image from 'next/image'

export default async function PartnersSections() {
  const partners = await prisma.partner.findMany()

  return (
    <div className="mx-auto text-center px-4 mt-9">
      <h1 className="text-4xl mb-4">Our Partners</h1>
      <p className="max-w-[48rem] mx-auto text-lg">
        GSK Ltd is dedicated to providing quality products, superior service, and bespoke attention to satisfy all your culinary and commercial needs.
      </p>
      <div className="flex flex-wrap justify-center items-center gap-2 md:gap-6 mt-2 mb-8 max-w-[900px] mx-auto">
        {partners.map((partner) => (
          <div key={partner.id} className="flex-shrink-0 w-32 md:w-48 lg:w-52 p-2">
            <Image
              src={`https://gsk-ltd.s3.us-east-2.amazonaws.com/${partner.logo}`}
              alt={partner.name}
              width={200}
              height={200}
              style={{ objectFit: 'contain' }}
              className="w-full h-auto"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  )
}