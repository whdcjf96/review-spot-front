"use client";

import ReviewCreateComponent from "@/components/reviews/reviewCreateComponent";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function ReviewCreatePage({ params }: { params: { id: string } }) {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/check', {
          method: 'GET',
          credentials: 'include',
        });
        const data = await response.json();

        if (!data.isAuthenticated) {
          toast.error('로그인이 필요한 서비스입니다.');
          setTimeout(() => {
            router.replace('/login');
          }, 1500);
        }
      } catch (error) {
        console.error('인증 상태 확인 중 오류 발생:', error);
        toast.error('인증 상태 확인 중 오류가 발생했습니다.');
      }
    };

    checkAuth();
  }, [router]);

  return (
    <main className="container-xl">
      <section className="p-8 flex flex-col space-y-20">
        <ReviewCreateComponent productId={parseInt(params.id, 10)} />
      </section>
    </main>
  );
}
