import prisma from '@/lib/prisma';
import AdminContainer from '@/components/ui/AdminContainer';
import CategoryForm from '../../manage-categories/_components/CategoryForm'; 
import { Card, CardContent } from '@/components/ui/card';

interface EditCategoryPageProps {
  params: {
    id: string;
  };
}

export default async function EditCategoryPage({
  params: { id },
}: EditCategoryPageProps) {
  const category = await prisma.category.findUnique({ where: { id } });

  return (
    <>
      <Card>
        <AdminContainer />
        <CardContent>
          <CategoryForm category={category} />
        </CardContent>
      </Card>
    </>
  );
}
