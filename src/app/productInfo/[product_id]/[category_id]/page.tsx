import ProductInfo from "@/components/products/productInfoComponent";
import ReviewsListComponent from "@/components/reviews/reviewsListComponent";
import ReviewCreateComponent from "@/components/reviews/reviewCreateComponent";
import Link from "next/link";

export default function Page({
  params,
}: {
  params: { product_id: number; category_id: number };
}) {
  return (
    <main className="container-xl">
      <section className="p-8 flex flex-col space-y-12">
        {/* 상품 정보 영역 */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-sky-700">상품 정보</h2>
          <article className="w-full h-full flex flex-col justify-center items-center mx-auto">
            <ProductInfo params={params} />
          </article>
        </div>

        {/* 구분선 */}
        <div className="w-full border-t-2 border-sky-200"></div>

        {/* 리뷰 영역 */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-sky-700">리뷰</h2>
           
          </div>
          <article className="w-full h-full flex flex-col justify-center items-center mx-auto">
            <ReviewsListComponent items={[]} />
          </article>
        </div>
      </section>
    </main>
  );
}
