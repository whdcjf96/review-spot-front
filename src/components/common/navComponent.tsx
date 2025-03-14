"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Modal from "./modal";
import SignUpComponent from "../sign/signUpComponent";

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const [isWhiskiesDropdownOpen, setIsWhiskiesDropdownOpen] = useState(false);
  const [isMobileWhiskiesDropdownOpen, setIsMobileWhiskiesDropdownOpen] =
    useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const checkLoginStatus = async () => {
    try {
      const response = await fetch('/api/auth/check', {
        method: 'GET',
        credentials: 'include', // 쿠키 포함
      });

      const data = await response.json();
      setIsLoggedIn(data.isAuthenticated);
    } catch (error) {
      console.error('인증 상태 확인 중 오류 발생:', error);
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include', // 쿠키 포함
      });

      if (response.ok) {
        setIsLoggedIn(false);
        window.location.reload();
      }
    } catch (error) {
      console.error('로그아웃 중 오류 발생:', error);
    }
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleWhiskiesDropdown = () => {
    setIsWhiskiesDropdownOpen(!isWhiskiesDropdownOpen);
  };

  const toggleMobileWhiskiesDropdown = () => {
    setIsMobileWhiskiesDropdownOpen(!isMobileWhiskiesDropdownOpen);
  };

  const handleWhiskiesMouseEnter = () => {
    clearTimeout((window as any).companyDropdownTimeout);
    setIsWhiskiesDropdownOpen(true);
  };

  const handleWhiskiesMouseLeave = () => {
    (window as any).companyDropdownTimeout = setTimeout(() => {
      setIsWhiskiesDropdownOpen(false);
    }, 100);
  };

  return (
    <nav className="bg-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-blue-200 text-xl font-bold">
          리뷰스팟
        </Link>
        <div className="hidden md:flex space-x-4 items-center">
          <div
            className="relative"
            onMouseEnter={handleWhiskiesMouseEnter}
            onMouseLeave={handleWhiskiesMouseLeave}
          >
            <button
              onClick={toggleWhiskiesDropdown}
              className="text-black hover:text-gray-300 focus:outline-none"
            >
              Whiskies
            </button>
            <div
              className={`absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-md py-2 z-10 transition-all duration-300 ease-in-out transform origin-top ${
                isWhiskiesDropdownOpen
                  ? "max-h-screen opacity-100 scale-y-100"
                  : "max-h-0 opacity-0 scale-y-0"
              } overflow-hidden`}
            >
              <Link
                href="/products"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                상품
              </Link>
              <Link
                href="/reviews"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                리뷰
              </Link>
            </div>
          </div>

          <Link href="/#" className="text-black hover:text-gray-300">
            #
          </Link>

          <Link href="/#" className="text-black hover:text-gray-300">
            #
          </Link>
          <Link href="/#" className="text-black hover:text-gray-300">
            #
          </Link>
          
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="ml-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              로그아웃
            </button>
          ) : (
            <>
              <Link
                href="/login"
                className="ml-4 px-4 py-2 bg-blue-200 text-white rounded hover:bg-blue-300 transition-colors"
              >
                로그인
              </Link>
              <Link
                href="/signUp"
                className="ml-4 px-4 py-2 bg-blue-200 text-white rounded hover:bg-blue-300 transition-colors"
              >
                회원가입
              </Link>
            </>
          )}
        </div>
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="text-black hover:text-gray-300 focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              ></path>
            </svg>
          </button>
        </div>
      </div>
      <div
        className={`md:hidden flex flex-col space-y-2 mt-4 transition-all duration-300 ease-in-out transform ${
          isOpen ? "opacity-100 max-h-screen" : "opacity-0 max-h-0"
        } overflow-hidden`}
      >
        <div>
          <button
            onClick={toggleMobileWhiskiesDropdown}
            className="w-full text-left text-gray-700 hover:text-gray-900 focus:outline-none"
          >
            Whiskies
          </button>
          <div
            className={`pl-4 mt-2 transition-all duration-300 ease-in-out ${
              isMobileWhiskiesDropdownOpen
                ? "opacity-100 max-h-screen scale-y-100"
                : "opacity-0 max-h-0 scale-y-0"
            } overflow-hidden transform origin-top`}
          >
            <Link
              href="/products"
              className="block py-1 text-gray-700 hover:bg-gray-100"
            >
              상품
            </Link>
            <Link
              href="/reviews"
              className="block py-1 text-gray-700 hover:bg-gray-100"
            >
              리뷰
            </Link>
          </div>
        </div>

        <Link href="/#" className="text-gray-700 hover:text-gray-700">
          #
        </Link>
        <Link href="/#" className="text-gray-700 hover:text-gray-700">
          #
        </Link>
        <Link href="/#" className="text-gray-700 hover:text-gray-700">
          #
        </Link>
        
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="block py-2 text-red-500 hover:text-red-700"
          >
            로그아웃
          </button>
        ) : (
          <>
            <Link
              href="/login"
              className="block py-2 text-gray-700 hover:text-gray-900"
            >
              로그인
            </Link>
            <Link
              href="/signUp"
              className="block py-2 text-gray-700 hover:text-gray-900"
            >
              회원가입
            </Link>
          </>
        )}
      </div>

      {/* 회원가입 모달 */}
      <Modal isOpen={isSignUpModalOpen} onClose={() => setIsSignUpModalOpen(false)}>
        <SignUpComponent />
      </Modal>
    </nav>
  );
}
