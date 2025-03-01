// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import AnchorinitIDL from '../target/idl/anchorinit.json'
import type { Anchorinit } from '../target/types/anchorinit'

// Re-export the generated IDL and type
export { Anchorinit, AnchorinitIDL }

// The programId is imported from the program IDL.
export const ANCHORINIT_PROGRAM_ID = new PublicKey(AnchorinitIDL.address)

// This is a helper function to get the Anchorinit Anchor program.
export function getAnchorinitProgram(provider: AnchorProvider, address?: PublicKey) {
  return new Program({ ...AnchorinitIDL, address: address ? address.toBase58() : AnchorinitIDL.address } as Anchorinit, provider)
}

// This is a helper function to get the program ID for the Anchorinit program depending on the cluster.
export function getAnchorinitProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
      // This is the program ID for the Anchorinit program on devnet and testnet.
      return new PublicKey('coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF')
    case 'mainnet-beta':
    default:
      return ANCHORINIT_PROGRAM_ID
  }
}
