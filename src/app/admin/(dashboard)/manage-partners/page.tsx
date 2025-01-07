import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import React from 'react'
import PartnersTable from './_components/PartnersTable';
import { prisma } from '@/lib/prisma';

export default async function ManagePartners() {
     const partners = await prisma.partner.findMany({
        orderBy: { name: "asc" },
      });
    
    
  return (
    <Card>
        <CardHeader>
            <CardTitle>Manage Partners</CardTitle>
        </CardHeader>
        <CardContent>
            <Link href="/admin/manage-partners/add-partner" className='my-5'>Add A New Partner</Link>
            <div>
                <PartnersTable partners={partners} />
            </div>
        </CardContent>
    </Card>
  )
}
