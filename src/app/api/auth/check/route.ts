import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        // access_token 쿠키 확인
        const accessToken = req.cookies.get('access_token')?.value;
        const refreshToken = req.cookies.get('refresh_token')?.value;

        // 두 토큰 중 하나라도 있으면 로그인 상태로 간주
        const isAuthenticated = !!(accessToken || refreshToken);

        return NextResponse.json({ isAuthenticated });

    } catch (error) {
        console.error('인증 상태 확인 중 오류 발생:', error);
        return NextResponse.json({ isAuthenticated: false });
    }
} 