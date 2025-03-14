import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        
        // 모든 쿼리 파라미터 추출
        const query = searchParams.get('query') || '';
        const display = searchParams.get('display') || '10';
        const category_id = searchParams.get('category_id') || '0';
        const sort = searchParams.get('sort') || 'created';
        const page = searchParams.get('page') || '1';  // page_num -> page로 변경

        // 쿼리 파라미터 구성
        const queryParams = new URLSearchParams();
        queryParams.append('query', query);
        queryParams.append('display', display);
        queryParams.append('category_id', category_id);
        queryParams.append('sort', sort);
        queryParams.append('page', page);

        const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/reviews?${queryParams.toString()}`;
        
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

            console.log('서버 응답 상태:', response.status);

            if (!response.ok) {
                console.error('리뷰 목록 조회 실패:', response.status, response.statusText);
                return NextResponse.json(
                    { message: '리뷰 목록을 불러오는데 실패했습니다.' },
                    { status: response.status }
                );
            }

            const data = await response.json();
            console.log('서버 응답 데이터 전체:', data);
            
            if (data.data && data.data.length > 0) {
                console.log('첫 번째 리뷰 데이터 상세:', JSON.stringify(data.data[0], null, 2));
            }

            console.log('서버 응답 데이터:', {
                success: data.success,
                message: data.message,
                totalCount: data.data?.length || 0
            });

            // 데이터 구조 변환
            if (data.success && data.data) {
                // 서버 응답 데이터를 클라이언트에서 사용하는 형식으로 변환
                const transformedData = {
                    success: data.success,
                    message: data.message,
                    data: data.data.map((item: any) => ({
                        review_id: item.review_id || 0,
                        nickname: item.nickname || '익명',
                        avg_score: item.avg_score || 0,
                        nose_score: item.nose_score || 0,
                        palate_score: item.palate_score || 0,
                        finish_score: item.finish_score || 0,
                        content: item.content || '',
                        created_at: item.created_at || '',
                        product: {
                            product_id: item.product?.id || 0,
                            product_name: item.product?.name || '알 수 없음',
                            img_path: item.product?.imgPath || '',
                            alcohol: item.product?.product_info?.alcohol || 0,
                            capacity: item.product?.product_info?.capacity || 0,
                            area: item.product?.product_info?.area || '알 수 없음',
                            category: { 
                                id: item.product?.category || 0, 
                                name: getCategoryName(item.product?.category) 
                            }
                        },
                        aroma_profile: {
                            labels: item.aroma_profile?.labels || [],
                            data: item.aroma_profile?.scores || []
                        }
                    }))
                };
                
                console.log('변환된 데이터 예시:', transformedData.data.length > 0 ? transformedData.data[0] : '데이터 없음');
                return NextResponse.json(transformedData);
            }

            return NextResponse.json(data);
        } catch (abortError: any) {
            clearTimeout(timeoutId);
            if (abortError.name === 'AbortError') {
                console.error('리뷰 목록 요청 타임아웃 (10초 초과)');
                return NextResponse.json(
                    { message: '서버 응답 시간이 초과되었습니다. 잠시 후 다시 시도해주세요.' },
                    { status: 504 }
                );
            }
            throw abortError; // 다른 에러는 외부 catch 블록으로 전달
        }
    } catch (error: any) {
        console.error('리뷰 목록 조회 중 오류 발생:', error);
        return NextResponse.json(
            { message: '리뷰 목록을 불러오는데 실패했습니다.', error: error.message },
            { status: 500 }
        );
    }
}

// 카테고리 ID를 이름으로 변환하는 함수
function getCategoryName(categoryId: number): string {
    const categories: Record<number, string> = {
        1: '싱글몰트',
        2: '블렌디드',
        3: '버번',
        4: '라이',
        5: '아이리시',
        6: '캐나디안'
    };
    
    return categories[categoryId] || '기타';
}

export async function POST(req: NextRequest) {
    try {
        const reviewData = await req.json();
        console.log('리뷰 생성 요청 데이터:', reviewData);

        // access_token 확인
        const accessToken = req.cookies.get('access_token')?.value;
        const refreshToken = req.cookies.get('refresh_token')?.value;

        if (!accessToken) {
            console.log('인증 토큰 없음');
            return NextResponse.json(
                { message: '로그인이 필요합니다.' },
                { status: 401 }
            );
        }

        // 필수 필드 검증
        const requiredFields = ['product_id', 'content', 'nose_score', 'palate_score', 'finish_score'];
        const missingFields = requiredFields.filter(field => !(field in reviewData));
        
        if (missingFields.length > 0) {
            console.log('필수 필드 누락:', missingFields);
            return NextResponse.json(
                { message: `필수 필드가 누락되었습니다: ${missingFields.join(', ')}` },
                { status: 400 }
            );
        }

        // 점수 범위 검증 (0-100)
        const scores = ['nose_score', 'palate_score', 'finish_score'];
        for (const score of scores) {
            if (reviewData[score] < 0 || reviewData[score] > 100) {
                console.log('잘못된 점수 범위:', score, reviewData[score]);
                return NextResponse.json(
                    { message: `${score}는 0에서 100 사이의 값이어야 합니다.` },
                    { status: 400 }
                );
            }
        }

        // 서버로 전송할 데이터 구성
        const serverRequestData: {
            product_id: number;
            content: string;
            nose_score: number;
            palate_score: number;
            finish_score: number;
            nickname: string;
            user_id?: number;
            aroma_profile: {
                labels: string[];
                scores: number[];
            };
        } = {
            product_id: reviewData.product_id,
            content: reviewData.content,
            nose_score: reviewData.nose_score,
            palate_score: reviewData.palate_score,
            finish_score: reviewData.finish_score,
            nickname: "리뷰어",  // 기본 닉네임
            aroma_profile: {
                labels: reviewData.aroma_labels || [],
                scores: reviewData.aroma_labels?.map((label: string) => reviewData.aroma_scores[label] || 0) || []
            }
        };

        console.log('서버로 전송할 데이터:', serverRequestData);

        // SSL 인증서 검사 비활성화 (개발 환경에서만 사용)
        if (process.env.NODE_ENV === 'development') {
            process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
        }

        // JWT 토큰에서 user_id와 username 추출
        const tokenParts = accessToken.split('.');
        if (tokenParts.length !== 3) {
            return NextResponse.json(
                { message: '유효하지 않은 토큰입니다.' },
                { status: 401 }
            );
        }

        try {
            const payload = JSON.parse(atob(tokenParts[1]));
            console.log('JWT 토큰 페이로드:', payload);
            
            if (!payload.user_id) {
                return NextResponse.json(
                    { message: '토큰에서 사용자 정보를 찾을 수 없습니다.' },
                    { status: 401 }
                );
            }
            
            // user_id 대신 username을 담아서 전송
            if (payload.username) {
                serverRequestData.user_id = payload.username;
            } else {
                serverRequestData.user_id = payload.user_id;
            }
            
            // username이 있으면 닉네임으로 설정
            if (payload.username) {
                serverRequestData.nickname = payload.username;
            }
            
            console.log('최종 요청 데이터:', serverRequestData);
        } catch (error) {
            console.error('토큰 디코딩 중 오류:', error);
            return NextResponse.json(
                { message: '토큰 처리 중 오류가 발생했습니다.' },
                { status: 401 }
            );
        }

        console.log(accessToken)
        // Django 서버로 요청 보내기
        console.log('Django 서버로 요청 전송:', `${process.env.NEXT_PUBLIC_API_BASE_URL}/reviews`);
        console.log('Authorization 토큰:', `Bearer ${accessToken}`);

        // 첫 번째 시도
        let response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/reviews`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            },
            body: JSON.stringify(serverRequestData),
        });

        let responseData = await response.json();

        // 토큰이 만료되었다면 갱신 시도
        if (response.status === 401 && refreshToken) {
            console.log('토큰 갱신 시도');
            const refreshResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/token/refresh`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    refresh_token: refreshToken
                }),
            });

            const refreshData = await refreshResponse.json();
            console.log('토큰 갱신 응답:', refreshData);

            if (refreshResponse.ok && refreshData.success) {
                const newAccessToken = refreshData.data.access_token;

                // 새로운 토큰으로 다시 시도
                response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/reviews`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${newAccessToken}`
                    },
                    body: JSON.stringify(serverRequestData),
                });

                responseData = await response.json();
                console.log('토큰 갱신 후 리뷰 생성 응답:', {
                    status: response.status,
                    data: responseData
                });
                
                if (response.ok && responseData.success) {
                    // 새 토큰을 응답 헤더에 포함
                    const headers = new Headers();
                    headers.append('Set-Cookie', `access_token=${newAccessToken}; Path=/; HttpOnly; SameSite=Strict`);
                    
                    return NextResponse.json(responseData, { 
                        status: 201,
                        headers: headers
                    });
                } else {
                    // 응답은 200이지만 실제로 실패한 경우
                    return NextResponse.json(
                        { message: responseData.message || '리뷰 생성에 실패했습니다.' },
                        { status: 400 }
                    );
                }
            } else {
                console.log('토큰 갱신 실패');
                return NextResponse.json(
                    { message: '세션이 만료되었습니다. 다시 로그인해주세요.' },
                    { status: 401 }
                );
            }
        }

        console.log('Django 서버 응답:', {
            status: response.status,
            data: responseData
        });

        if (!response.ok) {
            return NextResponse.json(
                { message: responseData.message || responseData.detail || '리뷰 생성에 실패했습니다.' },
                { status: response.status }
            );
        }

        // 응답이 성공이지만 success가 false인 경우
        if (!responseData.success) {
            return NextResponse.json(
                { message: responseData.message || '리뷰 생성에 실패했습니다.' },
                { status: 400 }
            );
        }

        return NextResponse.json(responseData, { status: 201 });

    } catch (error) {
        console.error('리뷰 생성 중 오류 발생:', error);
        return NextResponse.json(
            { message: '서버 내부 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
} 