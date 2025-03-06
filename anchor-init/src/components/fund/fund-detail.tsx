"use client";

import { useState } from "react";

export default function FundraisingList() {
  const [isAllocationModalOpen, setIsAllocationModalOpen] = useState(false);
  return (
    <div>
      <div
        className="w-dvw pt-12 pb-5 text-black"
        style={{ 
          backgroundColor: "rgba(247, 139, 219, 1)",
        }}
      >
        <div className="px-8">
          <h1 className="text-4xl font-bold mb-2">$COOCIE</h1>
          <p className="mb-6">
            Use cookie.fun to find leading coins in Agents, Infra, and DeFAI
            sectors with growing mindshare. Sell if mindshare drops 20% from peak
            or below sector average.
          </p>

          <div className="flex gap-2">
            <div className="flex-1 bg-white p-4 rounded w-full">
              <p className="text-sm">Fundraising Status</p>
              <h2 className="text-4xl font-bold">198 / 200 SOL (99%)</h2>
            </div>
            <div className=" flex-1 bg-white rounded w-full md:w-64 ml-auto">
              <div className="flex justify-between items-center border-b border-y-black py-1 px-2">
                <p className="text-sm">SOL</p>
                <div className="flex flex-col items-end">
                  <p className="text-sm">you fund</p>
                  <p>0</p>
                </div>
              </div>
              <div className="flex justify-between items-center py-1 px-2">
                <p className="text-sm">COOCIE</p>
                <div className="flex flex-col items-end">
                  <p className="text-sm">you get</p>
                  <p>0.000</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <button
              className="bg-black text-white px-4 py-2 rounded text-sm"
              onClick={() => setIsAllocationModalOpen(true)}
            >
              ADD FUNDS
            </button>
          </div>
        </div>
      </div>

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
            {[...Array(12)].map((_, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="border border-gray-300 p-2 text-center">
                  {i + 1}
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  0xaa...3a4f
                </td>
                <td className="border border-gray-300 p-2 text-center">20%</td>
                <td className="border border-gray-300 p-2 text-center">10.0</td>
              </tr>
            ))}
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
                You have been committed 2 SOL to $COOCIE fund!
              </p>
              <div className="flex items-center mb-3">
                <span className="text-sm font-mono">
                  <b>Fund address:</b>
                  C4GwTnzkgYA2sSXEAH3yTzCWUunTzD23niXud8RjYTYM
                </span>
              </div>
              <div className="flex items-center mb-6">
                <span className="text-sm font-mono">
                  You will get $COOCIE as it meets the fundraising amount and
                  deployed on Raydium
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
