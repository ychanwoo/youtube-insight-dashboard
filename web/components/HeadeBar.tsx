"use client";

import { useState } from "react";
import Image from "next/image";
import logo from "../public/images/ReflectTube_logo.png";

type Props = {
  url: string;
};

export default function HeaderBar({ url }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);

  const handleNavigateTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleViewVideo = () => {
    if (!url) {
      setShowVideoModal(true);
      return;
    } else {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  const handleCloseVideoModal = () => {
    setShowVideoModal(false);
  };

  return (
    <>
      <header className="sticky top-0 border-b border-neutral-200 bg-neutral-50 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Left */}
          <div className="flex items-center pl-10">
            <Image
              src={logo}
              alt="logo-image"
              width={666}
              height={126}
              className="h-8 w-auto"
            />

            <p className="text-xs text-neutral-500 ml-2 mt-3">
              YouTube Insight & Analytics Platform
            </p>
          </div>

          {/* Right */}
          <div className="flex items-center gap-3">
            <button
              className="hidden rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-black hover:border-red-500 hover:bg-red-500 hover:text-white md:block"
              onClick={handleNavigateTop}
            >
              Analyze Now
            </button>

            <button
              onClick={() => setIsOpen(true)}
              className="rounded-full border border-neutral-300 p-2 hover:bg-neutral-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-85 bg-black/30 transition-opacity ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* 사이드바 */}
      <div
        className={`fixed right-0 top-0 z-90 h-full w-70 bg-white shadow-2xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col p-6">
          {/* 상단 */}
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-bold">Menu</h2>
            <button onClick={() => setIsOpen(false)}>✕</button>
          </div>

          {/* 메뉴 리스트 */}
          <div className="flex flex-col gap-4 text-sm">
            {/* About */}
            <div className="flex items-center gap-3 text-neutral-700 hover:text-black cursor-pointer">
              <span>ℹ️</span>
              About
            </div>

            {/* Contact */}
            <div className="flex items-center gap-3 text-neutral-700 hover:text-black cursor-pointer">
              <span>📧</span>
              Contact
            </div>

            <div className="my-4 h-px bg-neutral-200" />

            {/* Terms */}
            <div className="flex items-center gap-3 text-neutral-700 hover:text-black cursor-pointer">
              <span>📄</span>
              Terms of Service
            </div>

            {/* Privacy */}
            <div className="flex items-center gap-3 text-neutral-700 hover:text-black cursor-pointer">
              <span>🔒</span>
              Privacy Policy
            </div>
          </div>

          {/* 하단 */}
          <div className="mt-auto">
            <button
              onClick={handleViewVideo}
              className="w-full rounded-2xl bg-red-600 py-3 text-white font-semibold hover:bg-red-500"
            >
              View Video
            </button>
          </div>
        </div>
      </div>
      {showVideoModal && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl">
            <div className="relative top-7 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                💬
              </div>
              <div>
                <h2 className="text-lg font-bold text-black">입력 필요</h2>
                <p className="text-sm text-neutral-500">
                  먼저 영상을 분석해주세요.
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={handleCloseVideoModal}
                className="rounded-2xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
