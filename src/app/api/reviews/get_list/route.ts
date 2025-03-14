import { NextRequest, NextResponse } from "next/server";

// TLS 인증서 경고 무시 (개발 환경에서만 사용)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

export async function GET(req: NextRequest) {
  try {
    // Extract page and limit from the query parameters
    const { searchParams } = req.nextUrl;  // req.nextUrl 사용
    const page = parseInt(searchParams.get("pageNum") || "1", 10);
    const limit = parseInt(searchParams.get("display") || "10", 10);

    // Make a request to the Django server with page and limit as query parameters
    const res = await fetch(
      `http://3.39.234.40/api/reviews?page_num=${page}&display=${limit}`
    );

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Server response:", errorText);
      throw new Error("Failed to fetch reviews from the server");
    }

    const json = await res.json();

    const response = NextResponse.json(json);
    return response;
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.error();
  }
}
