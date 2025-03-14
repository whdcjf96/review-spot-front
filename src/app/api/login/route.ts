import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const userData = await req.json();
        console.log('로그인 요청 데이터:', userData);

        // 필수 필드 검증
        const requiredFields = ['username', 'password'];
        const missingFields = requiredFields.filter(field => !(field in userData));
        
        if (missingFields.length > 0) {
            console.log('필수 필드 누락:', missingFields);
            return NextResponse.json(
                { error: `필수 필드가 누락되었습니다: ${missingFields.join(', ')}` },
                { status: 400 }
            );
        }

        // Django 서버로 로그인 요청
        const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/login`;
        console.log('Django 서버 요청 URL:', apiUrl);

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: userData.username,
                password: userData.password
            }),
        });

        console.log('Django 서버 응답 상태:', response.status);
        const data = await response.json();
        console.log('Django 서버 응답 데이터:', data);

        if (!response.ok) {
            console.log('로그인 실패:', data);
            // 로그인 실패 시 에러 메시지 반환
            return NextResponse.json(
                { error: data.message || '로그인에 실패했습니다.' },
                { status: response.status }
            );
        }

        // 로그인 성공 시 토큰을 쿠키에 저장
        const headers = new Headers();
        if (data.data?.access_token) {
            console.log('액세스 토큰 저장');
            headers.append('Set-Cookie', `access_token=${data.data.access_token}; Path=/; HttpOnly; SameSite=Strict`);
        }
        if (data.data?.refresh_token) {
            console.log('리프레시 토큰 저장');
            headers.append('Set-Cookie', `refresh_token=${data.data.refresh_token}; Path=/; HttpOnly; SameSite=Strict`);
        }

        console.log('로그인 성공');
        return NextResponse.json(
            { success: true, message: "로그인 성공" },
            { status: 200, headers }
        );

    } catch (error) {
        console.error('로그인 중 오류 발생:', error);
        return NextResponse.json(
            { error: '서버 내부 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
} 