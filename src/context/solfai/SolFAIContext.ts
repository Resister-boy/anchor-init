import { Context, createContext } from "react";
import { AnchorProvider, Idl, Program } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";

export type SolFAIContextShape = {
  provider: AnchorProvider | null;
  program: Program<Idl> | null;
  state: any | null;
  programPda: PublicKey | null;
};

const defaultValue: SolFAIContextShape = {
  provider: null,
  program: null,
  state: {},
  programPda: null,
};

export const SolFAIContext: Context<SolFAIContextShape> =
  createContext<SolFAIContextShape>(defaultValue);
