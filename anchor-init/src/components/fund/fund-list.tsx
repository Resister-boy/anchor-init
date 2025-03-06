"use client";

import Link from "next/link";

export default function FundList() {
  const funds = [
    {
      id: 1,
      name: "AINSEM",
      status: "Launched",
      address: "7Uuz...Th4o",
      raised: "100%",
    },
    {
      id: 2,
      name: "MURAID",
      status: "Launched",
      address: "7Uuz...Th4o",
      raised: "100%",
    },
    {
      id: 3,
      name: "SIGMA",
      status: "Raising",
      address: "7Uuz...Th4o",
      raised: "25%",
    },
  ];

  return (
    <div>
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
            {funds.map((fund, _index) => (
              <tr key={fund.id}>
                <td className="p-2 text-center border border-gray-300">{fund.id}</td>
                <td className="p-2 text-center border border-gray-300">
                  <span 
                    className={`px-2 py-1 rounded text-xs ${
                      fund.status === "Launched" 
                        ? "bg-blue-400 text-black" 
                        : "bg-yellow-400 text-black"
                    }`}
                  >
                    {fund.status}
                  </span>
                </td>
                <td className="p-2 text-center border border-gray-300">
                  ${fund.name}
                </td>
                <td className="p-2 text-center border border-gray-300">
                  <div className="flex items-center justify-center">
                    {fund.address}
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-4 w-4 ml-1 cursor-pointer" 
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
                <td className="p-2 text-center border border-gray-300">
                  {fund.raised}
                </td>
                <td className="p-2 text-center border border-gray-300">
                  {fund.status === "Launched" ? (
                    <Link href={`/funds/${fund.id}`}>
                      <button className="bg-white border border-black text-black px-4 py-1 rounded">
                        CHECK ALLOCATION
                      </button>
                    </Link>
                  ) : (
                    <Link href={`/funds/${fund.id}`}>
                      <button className="bg-black text-white px-4 py-1 rounded">
                        ADD FUNDS
                      </button>
                    </Link>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
