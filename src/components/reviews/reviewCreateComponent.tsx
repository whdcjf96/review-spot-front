"use client";

import { useState, useEffect } from "react";
import { ReviewItem, Product, ReviewFormData } from "@/types/types";
import RadarChart from "../charts/radarChart";
import { useSearchParams, useRouter } from "next/navigation";
import toast, { Toaster } from 'react-hot-toast';

interface ReviewCreateComponentProps {
  productId?: number;
}

// 제품 옵션 데이터 (id와 name만 포함)
const productOptions: { id: number; name: string }[] = [
  {
    id: 1,
    name: "스프링뱅크 10",
  },
  {
    id: 2,
    name: "와일드터키 레어브리드",
  },
];

const fruitAromas = [
  "라임",
  "레몬",
  "자몽",
  "귤",
  "오렌지 껍질",
  "구아바",
  "멜론",
  "망고",
  "파인애플",
  "바나나",
  "배",
  "풋사과",
  "사과",
  "복숭아",
  "체리",
  "자두",
  "딸기",
  "블랙 커런트",
  "블랙베리",
  "건자두",
  "무화과",
  "살구",
];

const flowerAromas = [
  "오렌지 꽃",
  "장미",
  "히스",
  "제라늄",
  "라벤더",
  "제비꽃",
];

const grassAromas = [
  "갓 깍은 잔디",
  "양치류",
  "민트",
  "유칼립투스",
  "향나무",
  "블랙 커런트 잎",
  "월계수",
  "건초",
];

const grainAromas = [
  "감자",
  "맥아",
  "쿠키",
  "옥수수",
  "토스트",
  "초콜렛",
  "커피",
  "감초",
  "빵",
  "소시지",
  "미트 소스",
  "흑설탕",
];

const esterAromas = [
  "물고기",
  "요오드",
  "해초",
  "해산물",
  "부싯돌",
  "석유",
  "고무",
  "타르",
  "베이컨",
  "올드 붕대",
  "약향",
  "나무 이끼",
  "흙 냄새",
  "이탄",
  "연기",
];

const oakAromas = [
  "캐러멜",
  "꿀",
  "바닐라",
  "코코넛",
  "아몬드",
  "헤이즐넛",
  "호두",
  "떡갈나무",
  "백단목",
  "백향목",
  "솔향",
  "아니스",
  "생강",
  "후추",
  "육두구",
  "고수 씨앗",
  "정향",
  "계피",
  "체리",
  "마데이라",
  "셰리",
  "포트",
  "페드로 히메네즈",
];

export default function ReviewCreateComponent({ productId }: ReviewCreateComponentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productName = searchParams.get('product_name') || '제품을 선택하세요';
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [selectedAromaLabels, setSelectedAromaLabels] = useState<string[]>([]);

  const [review, setReview] = useState<ReviewFormData>({
    nose_score: 0,
    palate_score: 0,
    finish_score: 0,
    content: "",
    aroma_labels: [],
    aroma_scores: {},
  });

  const calculateAverageScore = () => {
    const { nose_score, palate_score, finish_score } = review;
    return ((nose_score + palate_score + finish_score) / 3).toFixed(1);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setReview((prevReview) => ({
      ...prevReview,
      [name]: value,
    }));
  };

  const handleProductChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedProductId = parseInt(e.target.value, 10);

    setReview((prevReview) => ({
      ...prevReview,
      product_id: selectedProductId,
    }));
  };

  const handleScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setReview((prevReview) => ({
      ...prevReview,
      [name]: parseInt(value, 10),
    }));
  };

  const handleAromaScoreChange = (label: string, value: number) => {
    setReview(prev => ({
      ...prev,
      aroma_scores: {
        ...prev.aroma_scores,
        [label]: value
      }
    }));
  };

  const handleAromaCheckboxChange = (label: string, checked: boolean) => {
    if (checked) {
      if (selectedAromaLabels.length >= 10) {
        alert("최대 10개의 아로마만 선택할 수 있습니다.");
        return;
      }
      setSelectedAromaLabels(prev => [...prev, label]);
      // 새로운 아로마가 선택되면 초기 점수를 50으로 설정
      handleAromaScoreChange(label, 50);
    } else {
      setSelectedAromaLabels(prev => prev.filter(l => l !== label));
      // 아로마가 제거되면 점수도 제거
      setReview(prev => {
        const newAromaScores = { ...prev.aroma_scores };
        delete newAromaScores[label];
        return { ...prev, aroma_scores: newAromaScores };
      });
    }
  };

  const radarChartData = {
    labels: selectedAromaLabels,
    datasets: [
      {
        label: "Aroma Profile",
        data: selectedAromaLabels.map(label => review.aroma_scores[label] || 0),
        backgroundColor: "rgba(34, 202, 236, .2)",
        borderColor: "rgba(34, 202, 236, 1)",
        pointBackgroundColor: "rgba(34, 202, 236, 1)",
      },
    ],
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const confirmMessage = `다음 내용으로 리뷰를 작성하시겠습니까?\n\n상품: ${productName}\n평균 점수: ${calculateAverageScore()}\n선택된 아로마: ${selectedAromaLabels.length}개`;

    if (!window.confirm(confirmMessage)) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          product_id: productId,
          nose_score: review.nose_score,
          palate_score: review.palate_score,
          finish_score: review.finish_score,
          content: review.content,
          aroma_labels: selectedAromaLabels,
          aroma_scores: review.aroma_scores,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          toast.error('로그인이 필요하거나 인증이 만료되었습니다.');
          // setTimeout(() => {
          //   router.replace('/login');
          // }, 1500);
          return;
        }
        const errorMessage = data.message || data.detail || '리뷰 작성 중 오류가 발생했습니다.';
        setSubmitError(errorMessage);
        toast.error(errorMessage);
        return;
      }

      toast.success('리뷰가 성공적으로 작성되었습니다!');
      setTimeout(() => {
        router.push(`/productInfo/${productId}/4`);
      }, 1500);

    } catch (error) {
      console.error('리뷰 작성 중 오류:', error);
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
      setSubmitError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto">
      <Toaster position="top-center" />
      <h1 className="text-2xl font-bold mb-4">리뷰 작성</h1>
      {submitError && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {submitError}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            제품명
          </label>
          {productId ? (
            <div className="mt-1 p-2 w-full border rounded bg-gray-50">
              {decodeURIComponent(productName)}
            </div>
          ) : (
            <select
              name="product_id"
              value={review.product_id || 0}
              onChange={handleProductChange}
              className="mt-1 p-2 w-full border rounded"
              required
            >
              <option value={0} disabled>
                제품을 선택하세요
              </option>
              {productOptions.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            노즈 점수
          </label>
          <input
            type="number"
            name="nose_score"
            value={review.nose_score || 0}
            onChange={handleScoreChange}
            className="mt-1 p-2 w-full border rounded"
            required
            min={0}
            max={100}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            팔레트 점수
          </label>
          <input
            type="number"
            name="palate_score"
            value={review.palate_score || 0}
            onChange={handleScoreChange}
            className="mt-1 p-2 w-full border rounded"
            required
            min={0}
            max={100}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            피니시 점수
          </label>
          <input
            type="number"
            name="finish_score"
            value={review.finish_score || 0}
            onChange={handleScoreChange}
            className="mt-1 p-2 w-full border rounded"
            required
            min={0}
            max={100}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            리뷰 내용
          </label>
          <textarea
            name="content"
            value={review.content || ""}
            onChange={handleChange}
            className="mt-1 p-2 w-full border rounded"
            rows={4}
            required
          />
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">아로마 선택</h2>
          <h3 className="text-sm font-semibold mb-2">과일향</h3>
          {fruitAromas.map((aroma) => (
            <div key={aroma} className="mb-4">
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  value={aroma}
                  checked={selectedAromaLabels.includes(aroma)}
                  onChange={(e) => handleAromaCheckboxChange(aroma, e.target.checked)}
                  className="form-checkbox mr-2"
                />
                <span className="mr-4">{aroma}</span>
              </div>
              {selectedAromaLabels.includes(aroma) && (
                <div className="ml-6">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={review.aroma_scores[aroma] || 0}
                    onChange={(e) => handleAromaScoreChange(aroma, parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>약함</span>
                    <span>강함</span>
                  </div>
                </div>
              )}
            </div>
          ))}
          <hr />
          <h3 className="text-sm font-semibold mb-2">꽃향</h3>
          {flowerAromas.map((aroma) => (
            <div key={aroma} className="mb-4">
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  value={aroma}
                  checked={selectedAromaLabels.includes(aroma)}
                  onChange={(e) => handleAromaCheckboxChange(aroma, e.target.checked)}
                  className="form-checkbox mr-2"
                />
                <span className="mr-4">{aroma}</span>
              </div>
              {selectedAromaLabels.includes(aroma) && (
                <div className="ml-6">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={review.aroma_scores[aroma] || 0}
                    onChange={(e) => handleAromaScoreChange(aroma, parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>약함</span>
                    <span>강함</span>
                  </div>
                </div>
              )}
            </div>
          ))}
          <hr />
          <h3 className="text-sm font-semibold mb-2">풀향</h3>
          {grassAromas.map((aroma) => (
            <div key={aroma} className="mb-4">
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  value={aroma}
                  checked={selectedAromaLabels.includes(aroma)}
                  onChange={(e) => handleAromaCheckboxChange(aroma, e.target.checked)}
                  className="form-checkbox mr-2"
                />
                <span className="mr-4">{aroma}</span>
              </div>
              {selectedAromaLabels.includes(aroma) && (
                <div className="ml-6">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={review.aroma_scores[aroma] || 0}
                    onChange={(e) => handleAromaScoreChange(aroma, parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>약함</span>
                    <span>강함</span>
                  </div>
                </div>
              )}
            </div>
          ))}
          <hr />
          <h3 className="text-sm font-semibold mb-2">이탄향</h3>
          {esterAromas.map((aroma) => (
            <div key={aroma} className="mb-4">
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  value={aroma}
                  checked={selectedAromaLabels.includes(aroma)}
                  onChange={(e) => handleAromaCheckboxChange(aroma, e.target.checked)}
                  className="form-checkbox mr-2"
                />
                <span className="mr-4">{aroma}</span>
              </div>
              {selectedAromaLabels.includes(aroma) && (
                <div className="ml-6">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={review.aroma_scores[aroma] || 0}
                    onChange={(e) => handleAromaScoreChange(aroma, parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>약함</span>
                    <span>강함</span>
                  </div>
                </div>
              )}
            </div>
          ))}
          <hr />
          <h3 className="text-sm font-semibold mb-2">곡물향</h3>
          {grainAromas.map((aroma) => (
            <div key={aroma} className="mb-4">
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  value={aroma}
                  checked={selectedAromaLabels.includes(aroma)}
                  onChange={(e) => handleAromaCheckboxChange(aroma, e.target.checked)}
                  className="form-checkbox mr-2"
                />
                <span className="mr-4">{aroma}</span>
              </div>
              {selectedAromaLabels.includes(aroma) && (
                <div className="ml-6">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={review.aroma_scores[aroma] || 0}
                    onChange={(e) => handleAromaScoreChange(aroma, parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>약함</span>
                    <span>강함</span>
                  </div>
                </div>
              )}
            </div>
          ))}
          <hr />
          <h3 className="text-sm font-semibold mb-2">오크향</h3>
          {oakAromas.map((aroma) => (
            <div key={aroma} className="mb-4">
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  value={aroma}
                  checked={selectedAromaLabels.includes(aroma)}
                  onChange={(e) => handleAromaCheckboxChange(aroma, e.target.checked)}
                  className="form-checkbox mr-2"
                />
                <span className="mr-4">{aroma}</span>
              </div>
              {selectedAromaLabels.includes(aroma) && (
                <div className="ml-6">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={review.aroma_scores[aroma] || 0}
                    onChange={(e) => handleAromaScoreChange(aroma, parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>약함</span>
                    <span>강함</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full p-2 rounded mt-4 ${
            isSubmitting
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          {isSubmitting ? '제출 중...' : '리뷰 제출'}
        </button>
      </form>

      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-2">아로마 프로필 미리보기</h2>
        <RadarChart data={radarChartData} />
      </div>
    </div>
  );
}
