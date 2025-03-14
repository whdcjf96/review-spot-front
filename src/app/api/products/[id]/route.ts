"use server"

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

        const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/products/detail?product_id=${params.id}&category_id=${category_id}`;

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
