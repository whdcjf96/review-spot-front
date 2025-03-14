"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Modal from "../common/modal";
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function SignUpComponent() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    user_id: "",
    name: "",
    password: "",
    passwordConfirm: "",
    termsAccepted: false
  });
  const [isIdChecked, setIsIdChecked] = useState(false);
  const [isCheckingId, setIsCheckingId] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    if (name === 'user_id') {
      setIsIdChecked(false); // 아이디 변경 시 중복 체크 상태 초기화
    }
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const checkDuplicateId = async () => {
    if (!formData.user_id) {
      toast.error("아이디를 입력해주세요.");
      return;
    }

    setIsCheckingId(true);
    try {
      const response = await fetch('/api/duplication-user-id', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: formData.user_id }),
      });

      const data = await response.json();

      if (data.data?.duplication_check_flag) {
        toast.error("이미 사용 중인 아이디입니다.");
        setIsIdChecked(false);
      } else {
        toast.success("사용 가능한 아이디입니다!");
        setIsIdChecked(true);
      }
    } catch (err) {
      toast.error("중복 확인 중 오류가 발생했습니다.");
      setIsIdChecked(false);
    } finally {
      setIsCheckingId(false);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const validateForm = () => {
    if (!formData.user_id || !formData.name || !formData.password) {
      toast.error("모든 필수 항목을 입력해주세요.");
      return false;
    }

    if (!isIdChecked) {
      toast.error("아이디 중복 확인이 필요합니다.");
      return false;
    }

    if (formData.password.length < 8) {
      toast.error("비밀번호는 8자 이상이어야 합니다.");
      return false;
    }

    if (formData.password !== formData.passwordConfirm) {
      toast.error("비밀번호가 일치하지 않습니다.");
      return false;
    }

    if (!formData.termsAccepted) {
      toast.error("이용약관에 동의해주세요.");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const loadingToast = toast.loading('회원가입 처리 중...');

    try {
      const response = await fetch('/api/sign-up', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: formData.user_id,
          name: formData.name,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || '회원가입에 실패했습니다.', {
          id: loadingToast,
        });
        return;
      }

      toast.success('회원가입이 완료되었습니다!', {
        id: loadingToast,
      });
      
      setTimeout(() => {
        router.push('/login');
      }, 1500);

    } catch (err) {
      toast.error(err instanceof Error ? err.message : '회원가입 중 오류가 발생했습니다.', {
        id: loadingToast,
      });
    }
  };

  return (
    <div className="h-full px-52 flex justify-center items-start bg-gray-100">
      <Toaster position="top-center" reverseOrder={false} />
      {/* Left Side: Simple Sentences */}
      <div className="w-1/2 h-full space-y-2 px-28 py-32 bg-blue-200 text-white flex flex-col justify-start items-start">
        <h2 className="text-3xl font-bold">리뷰스팟에 오신 것을 환영합니다</h2>
        <p className="text-xl">회원가입하고 다양한 리뷰를 만나보세요</p>
        <p className="text-xl">간편한 회원가입으로 시작하기</p>
        <div className="w-full pt-12 flex justify-center items-center">
          <Image src="/beerRemove.png" alt="설명" width={500} height={300} />
        </div>
      </div>

      {/* Right Side: Signup Form */}
      <div className="w-1/2 h-full p-8 bg-white">
        <div className="space-y-6 px-14 py-20">
          {/* User ID Field */}
          <div>
            <label
              htmlFor="user_id"
              className="block text-gray-700 after:content-['*'] after:inline after:text-[#f9572e]"
            >
              아이디
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                id="user_id"
                name="user_id"
                value={formData.user_id}
                onChange={handleChange}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="사용하실 아이디를 입력해주세요"
              />
              <button
                onClick={checkDuplicateId}
                disabled={isCheckingId}
                className={`px-4 py-2 rounded-md text-white transition
                  ${isIdChecked 
                    ? 'bg-green-500 hover:bg-green-600' 
                    : 'bg-blue-200 hover:bg-blue-400'}`}
              >
                {isCheckingId ? '확인중...' : isIdChecked ? '확인완료' : '중복확인'}
              </button>
            </div>
          </div>
          {/* Name Field */}
          <div>
            <label
              htmlFor="name"
              className="block text-gray-700 after:content-['*'] after:inline after:text-[#f9572e]"
            >
              이름
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="이름을 입력해주세요"
            />
          </div>
          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-gray-700 after:content-['*'] after:inline after:text-[#f9572e]"
            >
              비밀번호
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="비밀번호를 입력해주세요 (8자 이상)"
            />
          </div>
          {/* Password Confirm Field */}
          <div>
            <label
              htmlFor="passwordConfirm"
              className="block text-gray-700 after:content-['*'] after:inline after:text-[#f9572e]"
            >
              비밀번호 확인
            </label>
            <input
              type="password"
              id="passwordConfirm"
              name="passwordConfirm"
              value={formData.passwordConfirm}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="비밀번호를 다시 입력해주세요"
            />
          </div>
          <div>
            <label htmlFor="terms" className="block text-gray-700">
              <input 
                type="checkbox" 
                name="termsAccepted"
                id="termsCheck"
                checked={formData.termsAccepted}
                onChange={handleChange}
              />
              <span> Review-Spot의 </span>
              <button
                className="text-blue-500 underline hover:text-blue-800 after:content-['*'] after:inline after:text-[#f9572e]"
                onClick={openModal}
              >
                이용약관
              </button>
              <span>에 동의합니다</span>
            </label>
          </div>
          {/* Sign Up Button */}
          <div>
            <button
              type="button"
              onClick={handleSubmit}
              className="w-full bg-blue-200 text-white px-4 py-2 rounded-md hover:bg-blue-400 transition"
            >
              회원가입
            </button>
          </div>
          <div className="text-center mt-4">
            <p className="text-gray-600">
              이미 계정이 있으신가요?{" "}
              <Link href="/login" className="text-blue-500 hover:text-blue-700">
                로그인하기
              </Link>
            </p>
          </div>
          <Modal isOpen={isModalOpen} onClose={closeModal}>
            <h2 className="text-2xl font-bold mb-4">
              Review-Spot 이용약관
            </h2>
            <p className="mb-4">내용이 들어가야 함</p>
            <button
              className="float-right bg-gray-500 text-white py-2 px-4 rounded"
              onClick={closeModal}
            >
              닫기
            </button>
          </Modal>
        </div>
      </div>
    </div>
  );
}
