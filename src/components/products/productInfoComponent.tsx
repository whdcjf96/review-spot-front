"use client";
import type { ProductInfo } from "@/types/types";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ProductInfo({
  params,
}: {
  params: { product_id: number; category_id: number };
}) {
  const [productInfo, setProductInfo] = useState<ProductInfo>({
    product_id: 0,
    img_path: "",
    product_name: "",
    category: {
      id: 0,
      name: "",
      created: "",
      updated: "",
    },
    capacity: 0,
    alcohol: 0,
    area: "",
    distillery: "",
    bottler: "",
    bottling_serie: "",
    bottled: "",
    cask_type: "",
  });

  const getProductDetail = async () => {
    try {
      const response = await fetch(`/api/products/${params.product_id}?category_id=${params.category_id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch product details');
      }

      const data = await response.json();
      setProductInfo(data.data);
    } catch (error) {
      console.error("Failed to fetch product details:", error);
    }
  };

  useEffect(() => {
    getProductDetail();
  }, [params.product_id, params.category_id]);

  return (
    <div className="w-full p-5">
      <div
        key={productInfo.product_id}
        className="w-full flex items-center p-5 border border-sky-500 rounded-lg"
      >
        <div className="w-3/5 flex flex-col">
          <div className="w-full">
            <p className="px-5 py-1 text-left text-4xl flex-grow border-b-2">
              {productInfo.product_name}
            </p>
          </div>
          <div className="w-full flex justify-start">
            {/* 상품 이미지 영역 */}
            <div className="relative w-2/5 h-80 my-3 flex-shrink-0 overflow-hidden">
              {productInfo.img_path ? (
                <Image
                  src={productInfo.img_path}
                  alt={productInfo.product_name}
                  className="py-5 border"
                  layout="fill"
                  objectFit="contain"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center border">
                  <svg
                    className="w-32 h-32 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              )}
            </div>
            {/* 상품 정보 영역 */}
            <div className="w-3/5 py-2 flex flex-col">
              <div className="w-full flex">
                <p className="w-48 px-5 text-base text-start">Whiskybase ID</p>
                <p className="w-80 px-5 text-base text-start font-bold">
                  {productInfo.product_id}
                </p>
              </div>
              <div className="w-full flex">
                <p className="w-48 px-5 text-base text-start">Category</p>
                <p className="w-80 px-5 text-base text-start font-bold">
                  {productInfo.category.name}
                </p>
              </div>
              <div className="w-full flex">
                <p className="w-48 px-5 text-base text-start">Distillery</p>
                <p className="w-80 px-5 text-base text-start font-bold">
                  {productInfo.distillery}
                </p>
              </div>
              <div className="w-full flex">
                <p className="w-48 px-5 text-base text-start">Bottler</p>
                <p className="w-80 px-5 text-base text-start font-bold">
                  {productInfo.bottler}
                </p>
              </div>
              <div className="w-full flex">
                <p className="w-48 px-5 text-base text-start">Bottling serie</p>
                <p className="w-80 px-5 text-base text-start font-bold">
                  {productInfo.bottling_serie}
                </p>
              </div>
              <div className="w-full flex">
                <p className="w-48 px-5 text-base text-start">Bottled</p>
                <p className="w-80 px-5 text-base text-start font-bold">
                  {productInfo.bottled}
                </p>
              </div>
              <div className="w-full flex">
                <p className="w-48 px-5 text-base text-start">Cask Type</p>
                <p className="w-80 px-5 text-base text-start font-bold">
                  {productInfo.cask_type}
                </p>
              </div>
              {/* <div className="w-full flex">
                <p className="w-48 px-5 text-base text-start">Strength</p>
                <p className="w-80 px-5 text-base text-start font-bold">
                  {productInfo.strength}
                </p>
              </div>
              <div className="w-full flex">
                <p className="w-48 px-5 text-base text-start">Size</p>
                <p className="w-80 px-5 text-base text-start font-bold">
                  {productInfo.size}
                </p>
              </div>
              <div className="w-full flex">
                <p className="w-48 px-5 text-base text-start">Label</p>
                <p className="w-80 px-5 text-base text-start font-bold">
                  {productInfo.label}
                </p>
              </div>
              <div className="w-full flex">
                <p className="w-48 px-5 text-base text-start">Added on</p>
                <p className="w-80 px-5 text-base text-start font-bold">
                  {productInfo.addedOn}
                </p>
              </div> */}
            </div>
          </div>
        </div>
        {/* 상품 리뷰리스트 영역 */}
        {/* <div className="w-2/5 h-full bg-sky-500">test</div> */}
      </div>
      <div className="w-full mt-3 text-end space-x-4">
        <Link
          href={"/"}
          className="p-3 text-black border border-sky-500 hover:text-white hover:bg-sky-500 rounded"
        >
          목록가기
        </Link>
        <Link
          href={`/reviews/create/${productInfo.product_id}?product_name=${encodeURIComponent(productInfo.product_name)}`}
          className="p-3 text-white bg-sky-500 hover:bg-sky-600 rounded"
        >
          리뷰 작성하기
        </Link>
      </div>
    </div>
  );
}
