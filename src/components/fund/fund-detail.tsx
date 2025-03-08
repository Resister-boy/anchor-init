"use client";

import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useSolFAI } from "@/shared/hooks/useSolFAI";
import { useParams } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";
import { BN } from "@coral-xyz/anchor";
import {
  SkeletonFundDetail,
  SkeletonRow2,
} from "@/components/ui/skeleton/skeleton-ui";
import { toast } from "react-hot-toast";

export default function FundDetail() {
  const [isAllocationModalOpen, setIsAllocationModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userList, setUserList] = useState<any[]>([]);
  const [fundInfo, setFundInfo] = useState<any>(null);
  const [solAmount, setSolAmount] = useState<number | null>(null);
  const [tokenAmount, setTokenAmount] = useState<number>(0);
  const {
    fetchAllVaults,
    fetchFund,
    fundToken,
    swapToken,
    provider,
    program,
    claimToken,
    getATA,
  } = useSolFAI();
  const wallet = useWallet();
  const params = useParams();
  const vaultId = params?.id as string;

  const fetchAllVaultsMutation = useMutation({
    mutationKey: ["fetchAllVaults"],
    mutationFn: fetchAllVaults,
    retry: 3,
    retryDelay: 3000,
    onSuccess: (data) => {
      if (data) {
        const fund = data.find(
          (item: any) => item.account.id.toNumber() === parseInt(vaultId)
        );
        if (fund) {
          console.log("fund ===>", fund);
          setFundInfo(fund);
        }
      }
    },
    onError: (error) => {
      console.error("Vault data error ===>", error);
      setIsLoading(false);
    },
  });

  const fetchFundingUser = useMutation({
    mutationKey: ["fetchFundingUser", vaultId],
    mutationFn: () => fetchFund(new BN(parseInt(vaultId))),
    retry: 3,
    retryDelay: 3000,
    onSuccess: (data) => {
      console.log("Raw funding user data:", data);
      if (data && Array.isArray(data) && data.length > 0) {
        const sortedData = [...data].sort(
          (a, b) =>
            b.account.totalAmount.toNumber() - a.account.totalAmount.toNumber()
        );
        console.log("Sorted funding user data:", sortedData);
        setUserList(sortedData);
      }
      setIsLoading(false);
    },
    onError: (error) => {
      console.error("Funding user error:", error);
      setIsLoading(false);
    },
  });

  const fetchATAMutation = useMutation({
    mutationKey: ["fetchATA", vaultId],
    mutationFn: () =>
      getATA({
        mint: fundInfo?.account?.etfTokenMint?.toBase58() ?? "",
        user: wallet.publicKey?.toBase58() ?? "",
      }),
    onSuccess: (data) => {
      console.log("ATA address:", data?.toBase58());
    },
  });

  const fundTokenMutation = useMutation({
    mutationKey: ["fundToken", vaultId],
    mutationFn: () =>
      fundToken({
        vaultId: new BN(parseInt(vaultId)),
        amount: new BN(solAmount ? solAmount * 1_000_000_000 : 0),
      }),
    onSuccess: (data) => {
      console.log("Fund token success:", data);
      setIsAllocationModalOpen(true);
      fetchAllVaultsMutation.mutate();
      fetchFundingUser.mutate();
      setSolAmount(null);
      setTokenAmount(0);
    },
    onError: (error) => {
      console.error("Fund token error:", error);
      setIsAllocationModalOpen(false);
      toast.error("Funding failed", {
        duration: 2000,
        position: "bottom-center",
      });
    },
  });

  const swapTokenMutation = useMutation({
    mutationKey: ["swapToken", vaultId],
    mutationFn: swapToken,
    onSuccess: (data) => {
      console.log("Swap success:", data);
      fetchAllVaultsMutation.mutate();
      fetchFundingUser.mutate();
      toast.success("Swap completed successfully", {
        duration: 2000,
        position: "top-center",
      });
    },
    onError: (error) => {
      console.error("Swap error:", error);
      toast.error("Swap failed", {
        duration: 2000,
        position: "top-center",
      });
    },
  });

  const claimTokenMutation = useMutation({
    mutationKey: ["claimToken", vaultId],
    mutationFn: async () => {
      const ataAddress = await fetchATAMutation.mutateAsync();
      if (!ataAddress) {
        throw new Error("ATA address not found");
      }

      return claimToken({
        vaultId: new BN(parseInt(vaultId)),
        mint: fundInfo?.account?.etfTokenMint?.toBase58() ?? "",
      });
    },
    onSuccess: (data) => {
      console.log("Claim success:", data);
      fetchAllVaultsMutation.mutate();
      fetchFundingUser.mutate();
      toast.success("Claim completed successfully", {
        duration: 2000,
        position: "top-center",
      });
    },
    onError: (error) => {
      console.error("Claim error:", error);
      toast.error("Claim failed", {
        duration: 2000,
        position: "top-center",
      });
    },
  });

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      if (provider && program && wallet.connected && vaultId) {
        setIsLoading(true);
        try {
          const vaultData = await fetchAllVaultsMutation.mutateAsync();
          console.log("Vault data fetched:", vaultData);
          if (isMounted) {
            const userData = await fetchFundingUser.mutateAsync();
            console.log("User data fetched:", userData);
          }
        } catch (error) {
          console.error("Data fetching error:", error);
        } finally {
          if (isMounted) {
            setIsLoading(false);
          }
        }
      }
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, [provider, program, wallet.connected, vaultId]);

  const fundedAmount =
    fundInfo?.account?.fundedAmount?.toNumber() / 1_000_000_000 || 0;
  const fundingGoal =
    fundInfo?.account?.fundingGoal?.toNumber() / 1_000_000_000 || 0;
  const fundingPercentage = fundedAmount / fundingGoal;

  const handleSolInput = (value: string) => {
    if (value === "") {
      setSolAmount(null);
      setTokenAmount(0);
      return;
    }

    if (value.includes(".")) {
      const [_integer, decimal] = value.split(".");
      if (decimal.length > 3) {
        return;
      }
    }

    const parsedAmount = parseFloat(value);
    if (isNaN(parsedAmount) || parsedAmount < 0 || parsedAmount > 20) {
      return;
    }
    setSolAmount(parsedAmount);

    console.log(solAmount);

    const calculatedTokens = fundingGoal
      ? (parsedAmount * 1_000_000_000) / fundingGoal
      : 0;
    setTokenAmount(calculatedTokens);
  };

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
        <SkeletonFundDetail />
      ) : (
        <div
          className="w-dvw pt-12 pb-12"
          style={{
            backgroundColor: "rgba(247, 139, 219, 1)",
          }}
        >
          <div className="px-8">
            <h1 className="text-5xl font-bold mb-4">
              ${fundInfo?.account?.etfName}
            </h1>
            <p className="text-2xl">{fundInfo?.account?.description}</p>

            <div className="mt-8 grid grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded">
                <p className="text-sm mb-1">Fundraising Status</p>
                <h2 className="text-3xl font-bold">
                  {`${fundedAmount} / ${fundingGoal}
                   SOL (${fundingPercentage * 100}%)`}
                </h2>
              </div>

              <div className="bg-white p-4 rounded">
                <p className="text-sm mb-1">Your Allocation</p>
                <h2 className="text-3xl font-bold">
                  {fundInfo?.account?.status === 2
                    ? `0 ${fundInfo?.account?.etfName} (0%)`
                    : `${fundInfo?.account?.mintedAmount.toNumber()} ${
                        fundInfo?.account?.etfName
                      } (${
                        (fundInfo?.account?.mintedAmount.toNumber() /
                          1_000_000_000) *
                        100
                      }%)`}
                </h2>
              </div>

              <div className="bg-white rounded">
                <div className="flex justify-between items-center border-b border-gray-200 p-3">
                  <div>
                    <p className="text-2xl text-black">SOL</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <p className="text-xs text-gray-500">you fund</p>
                    <input
                      type="number"
                      min="0"
                      max="20"
                      step="0.001"
                      value={solAmount === null ? "" : solAmount}
                      onChange={(e) => handleSolInput(e.target.value)}
                      placeholder="0"
                      className="text-right w-24 outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </div>
                </div>
                <div className="flex justify-between items-center p-3">
                  <div>
                    <p className="text-2xl text-black">
                      {fundInfo?.account?.etfName}
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <p className="text-xs text-gray-500">you get</p>
                    <p>{tokenAmount.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-4 space-x-2">
              {fundInfo?.account?.status === 1 ? (
                fundInfo?.account?.mintedAmount.toNumber() !== 0 ? (
                  <button
                    className="bg-black text-white px-6 py-2 rounded"
                    onClick={() => {
                      swapTokenMutation.mutate({
                        vaultId: new BN(parseInt(vaultId)),
                        user: wallet.publicKey?.toBase58() ?? "",
                        mint: fundInfo?.account?.etfTokenMint?.toBase58() ?? "",
                      });
                    }}
                  >
                    SWAP
                  </button>
                ) : (
                  <button
                    className="bg-black text-white px-6 py-2 rounded"
                    onClick={() => {
                      claimTokenMutation.mutate();
                    }}
                  >
                    CLAIM
                  </button>
                )
              ) : fundInfo?.account?.status === 2 ? (
                <button
                  className="bg-gray-300 text-gray-600 px-6 py-2 rounded cursor-not-allowed"
                  disabled
                >
                  ADD FUNDS
                </button>
              ) : (
                <button
                  className="bg-black text-white px-6 py-2 rounded"
                  onClick={() => {
                    if (!solAmount || solAmount <= 0) {
                      toast.error("Please enter SOL amount", {
                        duration: 2000,
                        position: "top-center",
                      });
                      return;
                    }
                    fundTokenMutation.mutate();
                  }}
                >
                  ADD FUNDS
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">TOP INVESTORS</h2>
        <table className="w-full border-collapse">
          <thead className="bg-black text-white">
            <tr>
              <th className="border border-gray-300 p-2 text-center">Rank</th>
              <th className="border border-gray-300 p-2 text-center">
                Address
              </th>
              <th className="border border-gray-300 p-2 text-center">Shares</th>
              <th className="border border-gray-300 p-2 text-center">Value</th>
            </tr>
          </thead>
          <tbody>
            {isLoading || fetchAllVaultsMutation.isPending ? (
              <>
                <SkeletonRow2 />
                <SkeletonRow2 />
                <SkeletonRow2 />
                <SkeletonRow2 />
                <SkeletonRow2 />
                <SkeletonRow2 />
                <SkeletonRow2 />
                <SkeletonRow2 />
              </>
            ) : (
              userList.map((user, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="border border-gray-300 p-2 text-center">
                    {index + 1}
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    <div
                      className="flex items-center justify-center cursor-pointer"
                      onClick={() =>
                        copyToClipboard(user.account.user.toBase58())
                      }
                    >
                      {`${user.account.user
                        .toBase58()
                        .substring(0, 4)}...${user.account.user
                        .toBase58()
                        .substring(user.account.user.toBase58().length - 4)}`}
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
                    </div>
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    {user.account.mintedAmount.toNumber().toLocaleString()}
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    {(
                      user.account.totalAmount.toNumber() / 1_000_000_000
                    ).toFixed(3)}{" "}
                    SOL
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isAllocationModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-none shadow-lg max-w-screen-md w-full">
            <div className="flex justify-end px-4 py-2">
              <button
                className="text-black text-xl font-light hover:text-gray-700"
                onClick={() => setIsAllocationModalOpen(false)}
              >
                ×
              </button>
            </div>
            <h2 className="text-3xl font-bold text-center">
              GOT YOUR ALLOCATION!
            </h2>
            <div className="p-6 flex flex-col items-center">
              <p className="text-base mb-4">
                You have been committed {solAmount} SOL to $
                {fundInfo?.account?.etfName} fund!
              </p>
              <div className="flex items-center mb-3">
                <span className="text-sm font-mono">
                  <b>Fund address:</b>{" "}
                  {fundInfo?.account?.etfTokenMint?.toBase58()}
                </span>
              </div>
              <div className="flex items-center mb-6">
                <span className="text-sm font-mono">
                  You will get ${fundInfo?.account?.etfName} as it meets the
                  fundraising amount and deployed on Raydium
                </span>
              </div>

              <button
                className="border border-black px-6 py-2 rounded font-bold"
                onClick={() => setIsAllocationModalOpen(false)}
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
