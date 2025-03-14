import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        // 쿠키 삭제를 위한 헤더 설정
        const headers = new Headers();
        headers.append('Set-Cookie', 'access_token=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0');
        headers.append('Set-Cookie', 'refresh_token=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0');

        return NextResponse.json(
            { success: true, message: "로그아웃 성공" },
            { status: 200, headers }
        );

    } catch (error) {
        console.error('로그아웃 중 오류 발생:', error);
        return NextResponse.json(
            { error: '서버 내부 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
} 