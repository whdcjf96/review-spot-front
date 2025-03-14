export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";


export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const category_id = searchParams.get('category_id');
        
        if (!params.id || !category_id) {
            return NextResponse.json(
                { error: 'Product ID and Category ID are required' },
                { status: 400 }
            );
        }

        // 환경 변수가 없을 경우 기본값 설정
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
        const apiUrl = `${apiBaseUrl}/products/detail?product_id=${params.id}&category_id=${category_id}`;

        console.log('API URL for product detail:', apiUrl); // URL 로깅 추가

        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch product details. Status: ${response.status}`);
        }

        const data = await response.json();
        
        return NextResponse.json(data);

    } catch (error) {
        console.error('Error occurred while fetching product details:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
