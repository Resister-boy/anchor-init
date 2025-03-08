"use client";

import { useChatContext } from "@/context/chat/ChatContext";
import { useRouter } from "next/navigation";
import { useCallback, useState, useEffect } from "react";
import CommonChat from "@/components/chat/common-chat/common-chat-feature";
import InitChat from "@/components/chat/init-chat/init-chat-feature";
import { ChatProgressType } from "@/shared/types/data/chat";
import { useSolFAI } from "@/shared/hooks/useSolFAI";
import { useMutation } from "@tanstack/react-query";
import * as anchor from "@coral-xyz/anchor";
import { SkeletonDashboard } from "@/components/ui/skeleton/skeleton-ui";

export default function DashboardFeature() {
  const {
    input,
    setInput,
    commonConversations,
    fundConversations,
    recent,
    fundRecent,
    status,
    metadata,
    setRecent,
    setFundRecent,
    setCommonConversations,
    setFundConversations,
  } = useChatContext();
  const [mint, setMint] = useState("");
  const [vault, setVault] = useState("");
  const { state, program, mintToken, initializeFund } = useSolFAI();
  const [isFundraisingModalOpen, setIsFundraisingModalOpen] = useState(false);
  const router = useRouter();
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    console.log("프롬프트 제출:", input);
    if (status === ChatProgressType.fundraise) {
      fundRecent && setFundConversations((prev) => [...prev, fundRecent]);
      setFundRecent({
        value: input,
        json: "",
        timestamp: new Date().toISOString(),
        type: "user",
        progress: ChatProgressType.fundraise,
      });
    } else {
      recent && setCommonConversations((prev) => [...prev, recent]);
      setRecent({
        value: input,
        timestamp: new Date().toISOString(),
        type: "user",
        progress: ChatProgressType.common,
      });
    }

    setInput("");
  };

  const handleAddFunds = () => {
    setIsFundraisingModalOpen(false);
    const vaultId = state.etfTokenCount.add(new anchor.BN(1)).toNumber();
    router.push(`/fund/detail/${vaultId}`);
  };

  const initFundMutation = useMutation({
    mutationKey: ["initializeFund"],
    mutationFn: initializeFund,
    onSuccess: (data) => {
      setVault(data?.toBase58() ?? "");
      setIsFundraisingModalOpen(true);
    },
  });

  const mintTokenMutation = useMutation({
    mutationKey: ["mintToken"],
    mutationFn: mintToken,
    onSuccess: (data) => {
      setMint(data ?? "");
      if (metadata && data) {
        initFundMutation.mutate({
          mint: data,
          name: metadata?.name,
          description: metadata?.description,
          amount: new anchor.BN(5_000_000_000),
        });
      }
    },
  });

  const handleFundrasing = useCallback(() => {
    if (status === ChatProgressType.done && metadata) {
      console.log(status, metadata);
      mintTokenMutation.mutate({
        name: metadata.name,
        symbol: metadata.symbol,
        uri: metadata.uri,
      });
    }
  }, [metadata]);

  return (
    <>
      {initialLoading ? (
        <SkeletonDashboard />
      ) : (
        <div className="relative min-h-screen pb-16 bg-white mb-24 overflow-hidden">
          {/* AiSHARES 타이틀 */}
          <div
            className="w-screen"
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
          <div className="mt-4">
            <InitChat text="Please enter your trading strategy." />
            {commonConversations.map((c, index) => {
              return (
                <CommonChat
                  key={index}
                  value={c.value}
                  timestamp={c.timestamp}
                  type={c.type}
                  progress={c.progress}
                />
              );
            })}
            {status <= ChatProgressType.confirm && recent && (
              <CommonChat
                value={recent.value}
                timestamp={recent.timestamp}
                type={recent.type}
                progress={recent.progress}
              />
            )}
          </div>
          {status >= ChatProgressType.fundraise && (
            <div className="mt-4 border-t-2 pt-4">
              <InitChat text="Enter the metadata for the ETF Token. name, symbol, and uri are required." />
              {fundConversations.map((c, index) => {
                return (
                  <CommonChat
                    key={index}
                    value={c.value}
                    timestamp={c.timestamp}
                    type={c.type}
                    progress={c.progress}
                    handler={() => handleFundrasing()}
                  />
                );
              })}
              {status >= ChatProgressType.fundraise && fundRecent && (
                <CommonChat
                  value={fundRecent.value}
                  timestamp={fundRecent.timestamp}
                  type={fundRecent.type}
                  progress={fundRecent.progress}
                  handler={() => handleFundrasing()}
                />
              )}
            </div>
          )}

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
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
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
                    Congratulations! ${metadata?.symbol} has been successfully{" "}
                    <b>TOKENIZED</b> with its own agent!
                  </p>
                  <div className="flex items-center mb-3">
                    <span className="text-sm font-mono">
                      <b>CA:</b>
                      {mint}
                    </span>
                  </div>
                  <div className="flex items-center mb-6">
                    <span className="text-sm font-mono">
                      <b>Start fundraising here:</b>
                      {vault}
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
      )}
    </>
  );
}
