import prisma from '@/lib/prisma';
import CategoryForm from '../../manage-categories/_components/CategoryForm'; 
import { Card, CardContent } from '@/components/ui/card';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';

interface EditCategoryPageProps {
  params: {
    id: string;
  };
}

export default async function EditCategoryPage({
  params: { id },
}: EditCategoryPageProps) {

  const session = await getServerSession(authOptions);

  if (!session || session.user?.role === "VIEW_ONLY") {
    return <p className="text-center mt-10">You do not have permission to add or edit products.</p>;
  }


  const category = await prisma.category.findUnique({ where: { id } });

  return (
    <>
      <Card>
        <CardContent>
          <CategoryForm category={category} />
        </CardContent>
      </Card>
    </>
  );
}
