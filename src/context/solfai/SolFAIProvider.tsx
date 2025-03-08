"use client";
import React, { ReactNode, useEffect, useMemo, useState } from "react";
import { SolFAIContext } from "@/context/solfai/SolFAIContext";
import { useAnchorProvider } from "@/components/solana/solana-provider";
import { Idl, Program } from "@coral-xyz/anchor";
import SolFAIIdlJson from "@/public/json/solfai_manager.json";
import * as anchor from "@coral-xyz/anchor";

type Props = {
  children: ReactNode;
};

const SolFAIProvider = ({ children }: Props) => {
  const [state, setState] = useState<any>(null);
  const provider = useAnchorProvider();
  const program = useMemo(
    () => new Program(SolFAIIdlJson as Idl, provider),
    [provider]
  );

  const programPda = useMemo(() => {
    let [programStatePda, _] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("program_state")],
      program.programId
    );

    return programStatePda;
  }, [provider, program]);

  useEffect(() => {
    (async () => {
      setState(await (program.account as any).programState.fetch(programPda));
    })();
  }, []);

  const contextValue = useMemo(() => {
    return {
      provider,
      program,
      state,
      programPda,
    };
  }, [provider, program, programPda, state]);

  return (
    <SolFAIContext.Provider value={contextValue}>
      {children}
    </SolFAIContext.Provider>
  );
};

export default SolFAIProvider;
