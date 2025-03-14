"use server"

export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        
        // 쿼리 파라미터 추출
        const query = searchParams.get('query');
        const display = searchParams.get('display');
        const category_id = searchParams.get('category_id');
        const sort = searchParams.get('sort');
        const page_num = searchParams.get('page_num');

        // 쿼리 파라미터 구성
        const queryParams = new URLSearchParams();
        if (query) queryParams.append('query', query);
        if (display) queryParams.append('display', display);
        if (category_id) queryParams.append('category_id', category_id);
        if (sort) queryParams.append('sort', sort);
        if (page_num) queryParams.append('page_num', page_num);

        // 환경 변수가 없을 경우 기본값 설정
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
        const apiUrl = `${apiBaseUrl}/products/?${queryParams.toString()}`;

        console.log('API URL:', apiUrl); // URL 로깅 추가

        // AbortController를 사용하여 타임아웃 설정
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10초 타임아웃

        try {
            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                signal: controller.signal
            });

            clearTimeout(timeoutId); // 요청이 완료되면 타임아웃 취소

            if (!response.ok) {
                throw new Error(`Failed to fetch products. Status: ${response.status}`);
            }

            const data = await response.json();
            console.log(data);
            
            return NextResponse.json(data);
        } catch (abortError: any) {
            clearTimeout(timeoutId);
            if (abortError.name === 'AbortError') {
                console.error('Request timed out after 10 seconds');
                return NextResponse.json(
                    { error: 'Request timed out. The server took too long to respond.' },
                    { status: 504 }
                );
            }
            throw abortError; // 다른 에러는 외부 catch 블록으로 전달
        }
    } catch (error: any) {
        console.error('Error occurred while fetching products:', error);
        return NextResponse.json(
            { error: 'Internal Server Error', message: error.message },
            { status: 500 }
        );
    }
}
