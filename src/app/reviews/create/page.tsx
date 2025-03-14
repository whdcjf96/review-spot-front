import ReviewCreateComponent from "@/components/reviews/reviewCreateComponent";
import { Suspense } from "react";

export default function Page() {
  return (
    <main className="container-xl">
      <section className="p-8 flex flex-col space-y-20">
        <Suspense fallback={<div className="w-full text-center p-10">리뷰 작성 폼 로딩 중...</div>}>
          <ReviewCreateComponent />
        </Suspense>
      </section>
    </main>
  );
}
