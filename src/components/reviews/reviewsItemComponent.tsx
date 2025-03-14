// ReviewsItemComponent.tsx
"use client";

import Image from "next/image";
import BarChart from "../charts/barChart";
import RadarChart from "../charts/radarChart";
import { ReviewsItemComponentProps } from "@/types/types";
import Link from "next/link";

export default function ReviewsItemComponent({
  item,
}: ReviewsItemComponentProps) {
  // 기본값 설정으로 undefined 방지
  const {
    nickname = "익명",
    avgScore = 0,
    noseScore = 0,
    palateScore = 0,
    finishScore = 0,
    content = "",
    createdAt = "",
    product = {
      product_id: 0,
      product_name: "알 수 없음",
      img_path: "",
      alcohol: 0,
      capacity: 0,
      area: "알 수 없음",
      category: { id: 0, name: "알 수 없음" }
    },
    aromaProfile,
  } = item || {};

  // 소수점 2자리까지만 표시
  const formattedAvgScore = typeof avgScore === 'number' ? avgScore.toFixed(2) : '0.00';

  // 제품 정보 안전하게 접근
  const productInfo = {
    product_id: product?.product_id || 0,
    product_name: product?.product_name || "알 수 없음",
    img_path: product?.img_path || "",
    alcohol: product?.alcohol || 0,
    capacity: product?.capacity || 0,
    area: product?.area || "알 수 없음",
    category: {
      id: product?.category?.id || 0,
      name: product?.category?.name || "알 수 없음"
    }
  };

  // 이미지 경로 확인
  const hasValidImage = productInfo.img_path && productInfo.img_path.trim() !== "";

  // aroma_profile이 비어있는지 확인
  const hasAromaProfile = aromaProfile && 
    Object.keys(aromaProfile).length > 0 && 
    aromaProfile.labels && 
    aromaProfile.labels.length > 0;

  // Stacked Bar 차트 데이터
  const barChartData = {
    labels: ["Nose", "Palate", "Finish"], // 축 라벨들
    datasets: [
      {
        label: "Score", // 차트의 레이블
        data: [noseScore, palateScore, finishScore], // 각 축에 대한 데이터
        backgroundColor: [
          "rgba(255, 99, 132, 0.5)",
          "rgba(54, 162, 235, 0.5)",
          "rgba(75, 192, 192, 0.5)",
        ], // 각 막대의 배경 색상
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(75, 192, 192, 1)",
        ], // 각 막대의 테두리 색상
        borderWidth: 1, // 차트 테두리 두께
      },
    ],
  };

  // 레이더 차트 데이터는 aromaProfile로부터 직접 가져옵니다.
  const radarChartData = hasAromaProfile ? {
    labels: aromaProfile.labels,
    datasets: [
      {
        label: `${productInfo.product_name} Aroma Profile`,
        data: aromaProfile.data,

        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        pointBackgroundColor: "rgba(54, 162, 235, 1)",
      },
    ],
  } : null;

  return (
    <div className="w-full bg-white rounded-lg shadow-md overflow-hidden mb-6 hover:shadow-lg transition-shadow duration-300">
      <div className="flex flex-col md:flex-row">
        {/* 왼쪽 영역 */}
        <div className="md:w-3/4 p-6">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-800">{`${nickname}님이 ${productInfo.product_name}에 대해서 ${formattedAvgScore}점을 주었습니다.`}</h2>
            <p className="text-sm text-gray-500 mt-1">{createdAt}</p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-3/5">
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-gray-700 whitespace-pre-line">{content}</p>
              </div>
            </div>
            
            <div className="md:w-2/5 flex flex-col gap-4">
              <div className="bg-white p-2 rounded-md">
                <BarChart data={barChartData} max={100} />
              </div>
              
              {hasAromaProfile && radarChartData && (
                <div className="bg-white p-2 rounded-md">
                  <RadarChart data={radarChartData} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 오른쪽 영역 */}
        <Link href={`/productInfo/${productInfo.product_id}/${productInfo.category.id}`} className="md:w-1/4 bg-gray-50 flex flex-col items-center justify-center p-4 border-l border-gray-200">
          <div className="mb-4">
            {hasValidImage ? (
              <Image
                src={productInfo.img_path}
                alt={productInfo.product_name}
                width={200}
                height={200}
                className="object-contain"
              />
            ) : (
              <div className="w-[200px] h-[200px] flex flex-col justify-center items-center bg-gray-100 text-gray-500 border border-gray-300 rounded-md">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="60" 
                  height="60" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                  <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
                <p className="mt-3 font-medium text-sm">{productInfo.product_name}</p>
                <p className="text-xs mt-1">이미지 없음</p>
              </div>
            )}
          </div>
          
          <div className="w-full">
            <div className="grid grid-cols-1 gap-2">
              <div className="flex justify-between items-center py-1 border-b border-gray-200">
                <span className="text-gray-600 font-medium">Alcohol:</span>
                <span className="text-gray-800">{productInfo.alcohol}%</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-gray-200">
                <span className="text-gray-600 font-medium">Capacity:</span>
                <span className="text-gray-800">{productInfo.capacity}ml</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-gray-200">
                <span className="text-gray-600 font-medium">Area:</span>
                <span className="text-gray-800">{productInfo.area}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-gray-600 font-medium">Category:</span>
                <span className="text-gray-800">{productInfo.category.name}</span>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
