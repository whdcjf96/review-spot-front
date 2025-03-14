"use client";

// ReviewsListComponent.tsx
import { useState, useEffect } from "react";
import { ReviewItem, ReviewsListComponentProps } from "@/types/types";
import ReviewsItemComponent from "./reviewsItemComponent";
import Pagination from "../common/pagenationComponent";

export default function ReviewsListComponent({ items }: ReviewsListComponentProps) {
  const [reviews, setReviews] = useState<ReviewItem[]>(items || []);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(!items);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 10; // 한 페이지에 보여줄 리뷰 수

  const fetchReviews = async () => {
    // items가 제공된 경우 API 호출을 건너뜁니다
    if (items) {
      setReviews(items);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`/api/reviews?page=${currentPage}&display=${itemsPerPage}`);
      
      if (!response.ok) {
        throw new Error('리뷰를 불러오는데 실패했습니다.');
      }

      const data = await response.json();
      console.log('서버에서 받은 리뷰 데이터:', data);
      
      // 서버 응답 데이터를 ReviewItem 형식에 맞게 매핑
      if (data.data && Array.isArray(data.data)) {
        const mappedReviews = data.data.map((item: any) => ({
          id: item.review_id,
          nickname: item.nickname,
          avgScore: item.avg_score,
          noseScore: item.nose_score,
          palateScore: item.palate_score,
          finishScore: item.finish_score,
          content: item.content,
          createdAt: item.created_at,
          product: {
            product_id: item.product.product_id,
            product_name: item.product.product_name,
            img_path: item.product.img_path,
            alcohol: item.product.alcohol,
            capacity: item.product.capacity,
            area: item.product.area,
            category: item.product.category
          },
          aromaProfile: {
            labels: item.aroma_profile.labels,
            data: item.aroma_profile.data
          }
        }));
        
        console.log('매핑된 리뷰 데이터:', mappedReviews);
        setReviews(mappedReviews);
      } else {
        setReviews([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 에러가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // items가 제공되지 않은 경우에만 API를 호출합니다
    if (!items) {
      fetchReviews();
    }
  }, [currentPage, items]); // items를 의존성 배열에 추가

  // 페이지 이동 함수
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (isLoading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-sky-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex justify-center items-center text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col justify-center items-center mx-auto p-4">
      {reviews.length > 0 ? (
        <>
          <article className="w-full h-full flex flex-col justify-center items-center mx-auto p-4">
            {reviews.map((item) => (
              <ReviewsItemComponent key={item.id} item={item} />
            ))}
          </article>
          <Pagination
            itemsPerPage={itemsPerPage}
            totalItems={reviews.length}
            paginate={paginate}
            currentPage={currentPage}
          />
        </>
      ) : (
        <div className="text-center text-gray-500">
          <p>등록된 리뷰가 없습니다.</p>
        </div>
      )}
    </div>
  );
}
