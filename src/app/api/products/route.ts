
import { getProducts } from '@/app/(customerFacing)/actions/products';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const categoryIds = searchParams.get('categoryIds');
    const expandedId = searchParams.get('expandedId');

    const result = await getProducts({
      page, 
      limit, 
      categoryIds, 
      expandedId
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Internal Server Error' },
        { status: 500 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in product route:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}