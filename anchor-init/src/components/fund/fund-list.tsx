"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useSolFAI } from "@/shared/hooks/useSolFAI";
import { useMutation } from "@tanstack/react-query";
import { useWallet } from "@solana/wallet-adapter-react";
import { toast } from "react-hot-toast";
import { SkeletonRow1 } from "../ui/skeleton/skeleton-ui";
import { SkeletonFundList } from "../ui/skeleton/skeleton-ui";

export default function FundList() {
  const [fundList, setFundList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { fetchAllVaults, provider, program } = useSolFAI();
  const wallet = useWallet();

  const fetchAllVaultsMutation = useMutation({
    mutationKey: ["fetchAllVaults"],
    mutationFn: fetchAllVaults,
    onSuccess: (data) => {
      if (data) {
        const sortedData = [...data].sort(
          (a, b) => a.account.id.toNumber() - b.account.id.toNumber()
        );
        console.log("Vault sortedData ===>", sortedData);
        setFundList(sortedData);
      }
      setIsLoading(false);
    },
    onError: (error) => {
      console.error("Vault data error ===>", error);
      setIsLoading(false);
    },
  });

  useEffect(() => {
    if (provider && program && wallet.connected) {
      fetchAllVaultsMutation.mutate();
    }
  }, [provider, program, wallet.connected]);

  const copyToClipboard = async (address: string) => {
    try {
      await navigator.clipboard.writeText(address);
      toast.success("Address Copied", {
        duration: 2000,
        position: "top-center",
        style: {
          background: "#333",
          color: "#fff",
        },
      });
    } catch (err) {
      toast.error("Failed to copy address", {
        duration: 2000,
        position: "bottom-center",
      });
    }
  };

  return (
    <div>
      {isLoading || fetchAllVaultsMutation.isPending ? (
        <SkeletonFundList />
      ) : (
        <div
          className="w-dvw pt-12 pb-12"
          style={{
            backgroundColor: "rgba(123, 217, 56, 1)",
          }}
        >
          <div className="text-left px-8">
            <div>
              <h1 className="text-5xl font-bold mb-4">FUND YOUR AiSHARES</h1>
              <p className="text-2xl">
                Launch and monetize on your own AI-led ETF
                <br />
                by just prompting in the desired strategy.
              </p>
            </div>
          </div>
        </div>
      )}
      <div className="p-4">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-black text-white">
            <tr>
              <th className="p-2 text-center">#</th>
              <th className="p-2 text-center">Status</th>
              <th className="p-2 text-center">Token</th>
              <th className="p-2 text-center">Address</th>
              <th className="p-2 text-center">Raised</th>
              <th className="p-2 text-center"></th>
            </tr>
          </thead>
          <tbody>
            {isLoading || fetchAllVaultsMutation.isPending ? (
              <>
                <SkeletonRow1 />
                <SkeletonRow1 />
                <SkeletonRow1 />
                <SkeletonRow1 />
                <SkeletonRow1 />
                <SkeletonRow1 />
                <SkeletonRow1 />
                <SkeletonRow1 />
              </>
            ) : fundList && fundList.length > 0 ? (
              fundList.map((fund, index) => (
                <tr key={index}>
                  <td className="p-2 text-center border border-gray-300">
                    {fund.account?.id?.toNumber()}
                  </td>
                  <td className="p-2 text-center border border-gray-300">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        fund.account?.status === 1
                          ? "bg-blue-400 text-black"
                          : "bg-yellow-400 text-black"
                      }`}
                    >
                      {fund.account?.status === 1 ? "Launched" : "Raising"}
                    </span>
                  </td>
                  <td className="p-2 text-center border border-gray-300">
                    ${fund.account?.etfName || "Unknown"}
                  </td>
                  <td className="p-2 text-center border border-gray-300">
                    <div
                      className="flex items-center justify-center cursor-pointer"
                      onClick={() =>
                        copyToClipboard(fund.account.etfTokenMint.toBase58())
                      }
                    >
                      {fund.account?.etfTokenMint ? (
                        <>
                          {`${fund.account.etfTokenMint
                            .toBase58()
                            .substring(0, 4)}...${fund.account.etfTokenMint
                            .toBase58()
                            .substring(
                              fund.account.etfTokenMint.toBase58().length - 4
                            )}`}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 ml-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                          </svg>
                        </>
                      ) : (
                        "Unknown"
                      )}
                    </div>
                  </td>
                  <td className="p-2 text-center border border-gray-300">
                    {fund.account?.fundingGoal && fund.account?.fundedAmount
                      ? `${
                          (fund.account.fundedAmount.toNumber() /
                            fund.account.fundingGoal.toNumber()) *
                          100
                        }%`
                      : "0%"}
                  </td>
                  <td className="p-2 text-center border border-gray-300">
                    {fund.account?.status === 1 ? (
                      <Link
                        href={`/fund/detail/${fund.account?.id?.toNumber()}`}
                      >
                        <button className="bg-white border border-black text-black px-4 py-1 rounded">
                          CHECK ALLOCATION
                        </button>
                      </Link>
                    ) : (
                      <Link
                        href={`/fund/detail/${fund.account?.id?.toNumber()}`}
                      >
                        <button className="bg-black text-white px-4 py-1 rounded">
                          ADD FUNDS
                        </button>
                      </Link>
                    )}
                  </td>
                </tr>
              ))
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
