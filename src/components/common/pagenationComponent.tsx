"use client";

import { PaginationProps } from "@/types/types"; // 타입 임포트

export default function Pagination({
  itemsPerPage,
  totalItems,
  paginate, // 전달된 on_page_change를 paginate로 사용
  currentPage,
}: PaginationProps) {
  const pageNumbers = [];

  // 전체 아이템 수와 페이지당 아이템 수에 따라 페이지 수를 계산
  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <ul className="flex list-none">
        {pageNumbers.map((number) => (
          <li key={number} className="px-2">
            <button
              onClick={() => paginate(number)} // 페이지네이션 클릭 시 실행
              className={`${
                number === currentPage ? "text-blue-500" : "text-gray-500"
              } hover:text-blue-700`}
            >
              {number}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
