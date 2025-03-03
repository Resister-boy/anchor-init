"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DashboardFeature() {
  const [prompt, setPrompt] = useState("");
  const [isFundraisingModalOpen, setIsFundraisingModalOpen] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    console.log("프롬프트 제출:", prompt);
    setPrompt("");
  };

  const handleAddFunds = () => {
    setIsFundraisingModalOpen(false);
    router.push("/fundraising");
  };

  return (
    <div className="relative min-h-screen pb-16 bg-white">
      {/* AiSHARES 타이틀 */}
      <div
        style={{
          backgroundColor: "rgba(123, 217, 56, 1)",
          paddingLeft: "40px",
          paddingRight: "40px",
          paddingTop: "60px",
          paddingBottom: "60px",
        }}
      >
        <div className="text-left">
          <div>
            <h1 className="text-5xl font-bold mb-4">AiSHARES LAUNCHER</h1>
            <p>
              Launch and monetize on your own AI-led ETF
              <br />
              by just prompting in the desired strategy.
            </p>
          </div>
        </div>
      </div>

      {/* 토큰 생성 메시지 */}
      <div className="p-4">
        <div className="mb-4">
          <div className="flex items-start">
            <div className="bg-yellow-300 text-black rounded-full w-6 h-6 flex items-center justify-center mr-2 flex-shrink-0">
              <span>A</span>
            </div>
            <div>
              <p className="text-sm">
                Create $COOCIE token and start fundraising?
              </p>
            </div>
          </div>
        </div>
        <div className="flex ml-8">
          <button
            className="bg-black text-white font-bold px-4 py-1 text-sm rounded mr-2"
            onClick={() => setIsFundraisingModalOpen(true)}
          >
            YES
          </button>
          <button className="border border-black font-bold px-4 py-1 text-sm rounded">
            START OVER
          </button>
        </div>
      </div>

      {/* 프롬프트 Input */}
      <div className="fixed bottom-0 left-0 right-0 bg-white">
        <div
          className="flex w-full"
          style={{
            paddingLeft: "60px",
            paddingRight: "60px",
            paddingTop: "40px",
            paddingBottom: "40px",
          }}
        >
          <form onSubmit={handleSubmit} className="flex w-full">
            <input
              type="text"
              placeholder="Prompt your strategy"
              className="w-full px-4 py-2 border border-gray-500 rounded-l-md focus:outline-none"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <button
              type="submit"
              className="bg-black text-white px-4 py-2 rounded-r-md uppercase font-semibold whitespace-nowrap"
            >
              Launch
            </button>
          </form>
        </div>
      </div>

      {/* 펀드레이징 모달 */}
      {isFundraisingModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-none shadow-lg max-w-screen-md w-full">
            <div className="flex justify-end px-4 py-2">
              <button
                className="text-black text-xl font-light hover:text-gray-700"
                onClick={() => setIsFundraisingModalOpen(false)}
              >
                ×
              </button>
            </div>
            <h2 className="text-2xl font-bold text-center">
              START FUNDRAISING
            </h2>
            <div className="p-6">
              <p className="text-base mb-4">
                Congratulations! $COOCIE has been successfully <b>TOKENIZED</b>{" "}
                with its own agent!
              </p>
              <div className="flex items-center mb-3">
                <span className="text-sm font-mono">
                  <b>CA:</b>C4GwTnzkgYA2sSXEAH3yTzCWUunTzD23niXud8RjYTYM
                </span>
              </div>
              <div className="flex items-center mb-6">
                <span className="text-sm font-mono">
                  <b>Start fundraising here:</b>
                  C4GwTnzkgYA2sSXEAH3yTzCWUunTzD23niXud8RjYTYM
                </span>
              </div>

              <div className="flex justify-center space-x-2">
                <button
                  className="bg-yellow-400 text-black px-6 py-2 rounded font-bold"
                  onClick={handleAddFunds}
                >
                  ADD FUNDS
                </button>
                <button
                  className="border border-black px-6 py-2 rounded"
                  onClick={() => setIsFundraisingModalOpen(false)}
                >
                  CLOSE
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
