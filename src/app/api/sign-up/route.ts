import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const userData = await req.json();
        console.log('회원가입 요청 데이터:', userData);

        // 필수 필드 검증
        const requiredFields = ['user_id', 'name', 'password'];
        const missingFields = requiredFields.filter(field => !(field in userData));
        
        if (missingFields.length > 0) {
            return NextResponse.json(
                { error: `필수 필드가 누락되었습니다: ${missingFields.join(', ')}` },
                { status: 400 }
            );
        }

        // 비밀번호 유효성 검사 (예: 최소 8자 이상)
        if (userData.password.length < 8) {
            return NextResponse.json(
                { error: '비밀번호는 최소 8자 이상이어야 합니다.' },
                { status: 400 }
            );
        }

        // Django 서버로 요청 보내기
        const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/sign-up`;
        console.log('요청 URL:', apiUrl);

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id: userData.user_id,
                name: userData.name,
                password: userData.password,
            }),
        });

        console.log('Django 서버 응답 상태:', response.status);
        const responseData = await response.json().catch(() => null);
        console.log('Django 서버 응답 데이터:', responseData);

        if (!response.ok) {
            const errorMessage = responseData?.message || responseData?.error || '회원가입에 실패했습니다.';
            console.error('회원가입 실패:', errorMessage);
            
            return NextResponse.json(
                { error: errorMessage },
                { status: response.status }
            );
        }

        return NextResponse.json(responseData, { status: 201 });

    } catch (error) {
        console.error('회원가입 중 오류 발생:', error);
        return NextResponse.json(
            { error: '서버 내부 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
} 