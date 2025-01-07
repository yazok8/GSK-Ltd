import prisma from '@/lib/prisma';
import { Card, CardContent } from '@/components/ui/card';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import PartnerForm from '../../_components/PartnerForm';

interface EditPartnerPageProps {
  params: {
    id: string;
  };
}

export default async function EditPartnerPage({
  params: { id },
}: EditPartnerPageProps) {

  const session = await getServerSession(authOptions);

  if (!session || session.user?.role === "VIEW_ONLY") {
    return <p className="text-center mt-10">You do not have permission to add or edit products.</p>;
  }


  const partner = await prisma.partner.findUnique({ where: { id } });

  return (
    <>
      <Card>
        <CardContent>
          <PartnerForm partner={partner} />
        </CardContent>
      </Card>
    </>
  );
}
