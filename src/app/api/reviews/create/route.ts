// app/api/reviews/create/route.ts

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const review_data = await req.json();
    console.log("reviewData", review_data);

    // SSL 인증서 검사 비활성화
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

    // Django 서버로 요청 보내기
    const res = await fetch("http://3.39.234.40/api/reviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(review_data),
    });

    console.log("res", res);

    if (!res.ok) {
      const errorText = await res.text();
      console.error("서버 응답 내용:", errorText);
      throw new Error("서버에 리뷰 전송 실패");
    }

    const json = await res.json();
    console.log(json);
    return NextResponse.json(json);
  } catch (error) {
    console.error("리뷰 전송 오류:", error);
    return NextResponse.error();
  }
}
