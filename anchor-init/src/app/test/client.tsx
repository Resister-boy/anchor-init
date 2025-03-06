"use client";
import { useSolFAI } from "@/shared/hooks/useSolFAI";
import { useMutation } from "@tanstack/react-query";
import React, { useMemo, useState } from "react";
import * as anchor from "@coral-xyz/anchor";

const TestClient = () => {
  const [fundList, setFundList] = useState<any[]>([]);
  const [userList, setUserList] = useState<any[]>([]);
  const [devnetToken, setDevnetToken] = useState<string>("");
  const [localnetToken, setLocalnetToken] = useState<string>("");
  const [vaultPda, setVaultPda] = useState<string>("");
  const [current, setCurrent] = useState<number | null>(null);
  const [ata, setAta] = useState<string | null>(null);
  const [currentMint, setCurrentMint] = useState<string | null>(null);

  const {
    provider,
    program,
    programPda,
    state,
    initializeConfig,
    initializeFund,
    fundToken,
    fetchAllVaults,
    fetchVault,
    fetchFund,
    mintToken,
    createToken,
    claimToken,
    getATA,
    swapToken,
  } = useSolFAI();

  console.log(state);

  const initConfigMutation = useMutation({
    mutationKey: ["initializeConfig"],
    mutationFn: initializeConfig,
    onSuccess: (data) => {
      console.log(data);
    },
  });

  const initFundMutation = useMutation({
    mutationKey: ["initializeFund"],
    mutationFn: initializeFund,
    onSuccess: (data) => {
      setVaultPda(data?.toBase58() ?? "");
      console.log(data?.toBase58());
    },
  });

  const mintTokenMutation = useMutation({
    mutationKey: ["mintToken"],
    mutationFn: mintToken,
    onSuccess: (data) => {
      setDevnetToken(data ?? "");
      console.log(data);
    },
  });

  const createTokenMutation = useMutation({
    mutationKey: ["createToken"],
    mutationFn: createToken,
    onSuccess: (data) => {
      setDevnetToken(data?.toBase58() ?? "");
      console.log(data?.toBase58());
    },
  });

  const fundTokenMutation = useMutation({
    mutationKey: ["fundToken", current],
    mutationFn: fundToken,
    onSuccess: (data) => {
      console.log(data);
    },
  });

  const fetchAllVaultsMutation = useMutation({
    mutationKey: ["fetchAllVaults"],
    mutationFn: fetchAllVaults,
    onSuccess: (data) => {
      setFundList(data);
      console.log(data);
    },
  });

  const claimTokenMutation = useMutation({
    mutationKey: ["claimToken", current, ata],
    mutationFn: claimToken,
    onSuccess: (data) => {
      console.log(data);
    },
  });

  const fetchATAMutation = useMutation({
    mutationKey: ["fetchATA", current],
    mutationFn: getATA,
    onSuccess: (data) => {
      console.log(data?.toBase58());
      if (data) setAta(data?.toBase58() ?? "");
    },
  });

  const fetchFundingUser = useMutation({
    mutationKey: ["fetchFundingUser", current],
    mutationFn: fetchFund,
    onSuccess: (data) => {
      setUserList(data);
      console.log(data);
    },
  });

  const swapTokenMutation = useMutation({
    mutationKey: ["swapToken", current],
    mutationFn: swapToken,
    onSuccess: (data) => {
      console.log(data);
    },
  });

  const currentVaultPda = useMemo(() => {
    if (program && current) {
      let [etfVaultPda, _] = anchor.web3.PublicKey.findProgramAddressSync(
        [
          Buffer.from("etf_token_vault"),
          new anchor.BN(current).toArrayLike(Buffer, "le", 8),
        ],
        program.programId
      );
      return etfVaultPda.toBase58();
    }
    return null;
  }, [current]);

  return (
    <main className="p-4 w-screen h-screen flex">
      <div className="w-1/2 flex flex-col space-y-6 items-start justify-start">
        <div className="p-4 w-screen flex flex-col space-y-2 items-start justify-start">
          <h3 className="font-semibold">Initialize Config</h3>
          <button
            className="w-44 py-2 rounded-md bg-blue-500 text-sm"
            onClick={() => initConfigMutation.mutate()}
          >
            Initialize Config
          </button>
        </div>
        <div className="p-4 w-screen flex flex-col space-y-2 items-start justify-start">
          <h3 className="font-semibold">Mint SPL Token(Devnet)</h3>
          <button
            className="w-44 py-2 rounded-md bg-blue-500 text-sm"
            onClick={() =>
              mintTokenMutation.mutate({
                name: "SolFAI",
                symbol: "SFAI",
                uri: "https://media.tenor.com/hmsGJDnv6nMAAAAM/rat-shower.gif",
              })
            }
          >
            Mint SPL Token(Devnet)
          </button>
        </div>
        <div className="p-4 w-screen flex flex-col space-y-2 items-start justify-start">
          <h3 className="font-semibold">Mint SPL Token(Localnet)</h3>
          <button
            className="w-44 py-2 rounded-md bg-blue-500 text-sm"
            onClick={() => createTokenMutation.mutate()}
          >
            Mint SPL Token(Localnet)
          </button>
          {devnetToken && <p>{devnetToken}</p>}
        </div>
        <div className="p-4 w-screen flex flex-col space-y-2 items-start justify-start">
          <h3 className="font-semibold">Initialize Fund</h3>
          <button
            className="w-44 py-2 rounded-md bg-blue-500 text-sm"
            onClick={() => {
              initFundMutation.mutate({
                mint: devnetToken,
                name: "SOLFAI",
                description: "Hello, World",
                amount: new anchor.BN(20_000_000_000),
              });
            }}
          >
            Initialize Fund
          </button>
          {vaultPda && <p>{vaultPda}</p>}
        </div>
        <div className="p-4 w-screen flex flex-col space-y-2 items-start justify-start">
          <h3 className="font-semibold">Fund Token</h3>
          <button
            className="w-44 py-2 rounded-md bg-blue-500 text-sm"
            onClick={() => {
              if (current) {
                fundTokenMutation.mutate({
                  vaultId: new anchor.BN(current),
                  amount: new anchor.BN(1_000_000),
                });
              }
            }}
          >
            Fund Token
          </button>
          {current && (
            <p>
              id: {current}, pda: {currentVaultPda}
            </p>
          )}
        </div>
        <div className="p-4 w-screen flex flex-col space-y-2 items-start justify-start">
          <h3 className="font-semibold">Claim Token</h3>
          <button
            className="w-44 py-2 rounded-md bg-blue-500 text-sm"
            onClick={() => {
              if (current && currentMint) {
                claimTokenMutation.mutate({
                  vaultId: new anchor.BN(current),
                  mint: currentMint,
                });
              }
            }}
          >
            Claim Token
          </button>
          {current && (
            <p>
              id: {current}, pda: {currentVaultPda}, mint: {currentMint}
            </p>
          )}
        </div>
        <div className="p-4 w-screen flex flex-col space-y-2 items-start justify-start">
          <h3 className="font-semibold">Swap Token</h3>
          <button
            className="w-44 py-2 rounded-md bg-blue-500 text-sm"
            onClick={() => {
              if (current && provider && currentMint) {
                swapTokenMutation.mutate({
                  vaultId: new anchor.BN(current),
                  user: provider?.publicKey.toBase58(),
                  mint: currentMint,
                });
              }
            }}
          >
            Swap Token
          </button>
          {current && (
            <p>
              id: {current}, pda: {currentVaultPda}, mint: {currentMint}
            </p>
          )}
        </div>
        <div className="p-4 w-screen flex flex-col space-y-2 items-start justify-start">
          <h3 className="font-semibold">Fetch ATA</h3>
          <button
            className="w-44 py-2 rounded-md bg-blue-500 text-sm"
            onClick={() => {
              if (currentMint && provider) {
                fetchATAMutation.mutate({
                  mint: currentMint,
                  user: provider?.publicKey.toBase58(),
                });
              }
            }}
          >
            Fetch ATA
          </button>
          {ata && <p>{ata}</p>}
        </div>
        <div className="p-4 w-screen flex flex-col space-y-2 items-start justify-start">
          <h3 className="font-semibold">Fetch All Vaults</h3>
          <button
            className="w-44 py-2 rounded-md bg-blue-500 text-sm"
            onClick={() => fetchAllVaultsMutation.mutate()}
          >
            Fetch All Vaults
          </button>
        </div>
        <div className="p-4 w-screen flex flex-col space-y-2 items-start justify-start">
          <h3 className="font-semibold">Fetch Funding User</h3>
          <button
            className="w-44 py-2 rounded-md bg-blue-500 text-sm"
            onClick={() => {
              if (current) {
                fetchFundingUser.mutate(new anchor.BN(current));
              }
            }}
          >
            Fetch Funding User
          </button>
          {current && (
            <p>
              id: {current}, pda: {currentVaultPda}
            </p>
          )}
        </div>
      </div>
      <div className="w-1/2 flex flex-col space-y-6 items-start justify-start">
        <div className="p-4 w-screen flex flex-col space-y-2 items-start justify-start">
          <h3 className="font-semibold">Fund List</h3>
          {fundList.map((fund, index) => {
            return (
              <div
                key={index}
                className="p-2 flex flex-col items-start justify-start border-2"
                onClick={() => {
                  setCurrent(fund.account.id.toNumber());
                  setCurrentMint(fund.account.etfTokenMint.toBase58());
                }}
              >
                <p>id: {fund.account.id.toNumber()}</p>
                <p>creator: {fund.account.creator.toBase58()}</p>
                <p>name: {fund.account.etfName}</p>
                <p>mint: {fund.account.etfTokenMint.toBase58()}</p>
                <p>goal: {fund.account.fundingGoal.toNumber()}</p>
                <p>current: {fund.account.fundedAmount.toNumber()}</p>
                <p>participants: {fund.account.fundingUserCount.toNumber()}</p>
                <p>minted amount: {fund.account.mintedAmount.toNumber()}</p>
                <p>
                  swaped sol amount: {fund.account.swappedSolAmount.toNumber()}
                </p>
                <p>status: {fund.account.status}</p>
              </div>
            );
          })}
        </div>
        <div className="p-4 w-screen flex flex-col space-y-2 items-start justify-start">
          <h3 className="font-semibold">User List</h3>
          {userList?.map((user, index) => {
            return (
              <div
                key={index}
                className="p-2 flex flex-col items-start justify-start border-2"
              >
                <p>user: {user.account.user.toBase58()}</p>
                <p>total: {user.account.totalAmount.toNumber()}</p>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
};

export default TestClient;
