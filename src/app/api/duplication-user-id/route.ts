import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { user_id } = await req.json();

        if (!user_id) {
            return NextResponse.json(
                { error: '아이디를 입력해주세요.' },
                { status: 400 }
            );
        }

        // Django 서버로 중복 확인 요청
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/duplication-user-id`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_id }),
        });

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error('아이디 중복 확인 중 오류 발생:', error);
        return NextResponse.json(
            { error: '서버 내부 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
} 