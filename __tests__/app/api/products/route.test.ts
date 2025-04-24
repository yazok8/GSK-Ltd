import { NextResponse } from 'next/server';
// 1) Override the static .json before you ever call GET()
jest.spyOn(NextResponse, 'json').mockImplementation((body, init) => {
  return {
    status: init?.status ?? 200,
    json: async () => body,
  } as unknown as NextResponse;
});


// __tests__/app/api/products/route.test.ts
import { GET } from '@/app/api/products/route';
import type { NextRequest } from 'next/server';
import { getProducts } from '@/app/(customerFacing)/actions/products';

// 2) Mock exactly the module the route file uses
jest.mock(
  '@/app/(customerFacing)/actions/products',
  () => ({
    getProducts: jest.fn(),
  })
);

describe('Products API Route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return products successfully', async () => {
    const mockResult = {
      products: [
        {
          id: '1',
          name: 'Test Product',
          categoryId: '1',
          category: { id: '1', name: 'Test Category' },
        },
      ],
      currentPage: 1,
      totalPages: 1,
      total: 1,
      success: true,
    };

    // @ts-ignore
    (getProducts as jest.Mock).mockResolvedValue(mockResult);

    // 3) We only need `.url` in GET() so fake‐cast a minimal object
    const fakeRequest = {
      url:
        'http://localhost:3000/api/products?page=1&limit=10&categoryIds=1',
    } as unknown as NextRequest;

    const response = await GET(fakeRequest);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual(mockResult);
    expect(getProducts).toHaveBeenCalledWith({
      page: 1,
      limit: 10,
      categoryIds: '1',
      expandedId: null,
    });
  });

  it('should return 500 on controlled errors', async () => {
    (getProducts as jest.Mock).mockResolvedValue({
      success: false,
      error: 'Failed to fetch products',
      products: [],
      total: 0,
      currentPage: 1,
      totalPages: 0,
    });

    const fakeReq = { url: 'http://localhost/api/products' } as unknown as NextRequest;
    const response = await GET(fakeReq);

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: 'Failed to fetch products' });
  });

  it('should return 500 on unexpected exceptions', async () => {
    (getProducts as jest.Mock).mockRejectedValue(new Error('boom'));


    const fakeRequest = {
        url: 'http://localhost/api/products' ,
    } as unknown as NextRequest;

    const response = await GET(fakeRequest);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({ error: 'Internal Server Error' });
  });
});
