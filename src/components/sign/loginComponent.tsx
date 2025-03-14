"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';

export default function LoginComponent() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.username || !formData.password) {
      toast.error("아이디와 비밀번호를 모두 입력해주세요.");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const loadingToast = toast.loading('로그인 중...');

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || data.error || '로그인에 실패했습니다.', {
          id: loadingToast,
        });
        return;
      }

      toast.success('로그인 성공!', {
        id: loadingToast,
      });

      // 로그인 성공 시 메인 페이지로 이동
      setTimeout(() => {
        router.push('/');
      }, 1000);

    } catch (err) {
      toast.error('로그인 중 오류가 발생했습니다.', {
        id: loadingToast,
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="h-full px-52 flex justify-center items-start bg-gray-100">
      <Toaster position="top-center" reverseOrder={false} />
      {/* Left Side: Simple Sentences */}
      <div className="w-1/2 h-full space-y-2 px-28 py-32 bg-blue-200 text-white flex flex-col justify-start items-start">
        <h2 className="text-3xl font-bold">다시 만나서 반가워요!</h2>
        <p className="text-xl">리뷰스팟에 오신 것을 환영합니다</p>
        <p className="text-xl">로그인하고 다양한 리뷰를 만나보세요</p>
        <div className="w-full pt-12 flex justify-center items-center">
          <Image src="/beerRemove.png" alt="설명" width={500} height={300} />
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="w-1/2 h-full p-8 bg-white">
        <div className="space-y-6 px-14 py-20">
          {/* Username Field */}
          <div>
            <label
              htmlFor="username"
              className="block text-gray-700"
            >
              아이디
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="아이디를 입력하세요"
            />
          </div>
          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-gray-700"
            >
              비밀번호
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="비밀번호를 입력하세요"
            />
          </div>
          {/* Login Button */}
          <div>
            <button
              type="button"
              onClick={handleSubmit}
              className="w-full bg-blue-200 text-white px-4 py-2 rounded-md hover:bg-blue-400 transition"
            >
              로그인
            </button>
          </div>
          <div className="text-center mt-4">
            <p className="text-gray-600">
              아직 계정이 없으신가요?{" "}
              <Link href="/signUp" className="text-blue-500 hover:text-blue-700">
                회원가입하기
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 