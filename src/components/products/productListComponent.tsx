"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Pagination from "../common/pagenationComponent";
import { Product } from "@/types/types";

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("0");
  const [sort, setSort] = useState("created");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const fetchProducts = async () => {
    try {
      // 빈 값이 있는 경우 파라미터에서 제외
      const queryParams = new URLSearchParams();
      if (query) queryParams.append('query', query);
      if (category !== "0") queryParams.append('category_id', category);
      queryParams.append('sort', sort);
      queryParams.append('display', itemsPerPage.toString());
      queryParams.append('page_num', currentPage.toString());

      const response = await fetch(`/api/products?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const data = await response.json();
      setProducts(data.data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  // Pagination calculation
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = products
    ? products.slice(indexOfFirstItem, indexOfLastItem)
    : [];

  // Pagination function
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  useEffect(() => {
    fetchProducts();
  }, [query, category, sort, currentPage]);

  return (
    <div className="w-full flex flex-col">
      <div className="w-full flex justify-end gap-4 p-5">
        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border p-2 rounded"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="0">All Categories</option>
          <option value="2">맥주</option>
          <option value="3">소주</option>
          <option value="4">양주</option>
          <option value="5">와인</option>
          <option value="6">막걸리</option>
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="created">Sort by Created</option>
          <option value="product_id">Sort by name</option>
          {/* Add more sorting options as needed */}
        </select>
      </div>
      {currentItems && currentItems.length > 0 ? (
        <div className="grid grid-cols-3 w-full gap-5 p-5">
          {currentItems.map((product) => (
            <Link
              href={`/productInfo/${product.product_id}/${product.category.id}`}
              key={product.product_id}
            >
              <div className="h-full flex flex-row items-center border border-sky-500 rounded-lg overflow-hidden ease duration-300 hover:-translate-y-2 w-full">
                <div className="relative w-48 h-48 flex-shrink-0">
                  {product.img_path ? (
                    <Image
                      src={product.img_path}
                      alt={product.product_name}
                      layout="fill"
                      objectFit="cover"
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <svg
                        className="w-24 h-24 text-gray-400"
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
                <div className="w-full h-full py-5 flex flex-col justify-between items-start">
                  <div className="flex">
                    <p className="px-5 text-left text-2xl flex-grow">
                      {product.product_name}
                    </p>
                  </div>
                  <div className="flex">
                    <p className="px-5 text-left text-base flex-grow">
                      알코올 : {product.alcohol}
                    </p>
                    <p className="px-5 text-left text-base flex-grow">
                      category : {product.category.name}
                    </p>
                  </div>
                  <div className="flex">
                    <p className="px-5 text-left text-base flex-grow">
                      capacity : {product.capacity}
                    </p>
                    <p className="px-5 text-left text-base flex-grow">
                      지역 : {product.area}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="w-full">
          <p className="w-full h-full pt-12 flex justify-center items-center overflow-hidden ease duration-300">
            찾으시는 상품이 없습니다.
          </p>
        </div>
      )}
      <div className="w-full flex justify-center items-center">
        <Pagination
          itemsPerPage={itemsPerPage}
          totalItems={products ? products.length : 0}
          paginate={paginate}
          currentPage={currentPage}
        />
      </div>
    </div>
  );
}
