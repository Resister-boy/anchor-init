// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import SolfaiManagerIDL from '../target/idl/solfai_manager.json'
import type { SolfaiManager } from '../target/types/solfai_manager'

// Re-export the generated IDL and type
export { SolfaiManager, SolfaiManagerIDL }

// The programId is imported from the program IDL.
export const SOLFAIMANAGER_PROGRAM_ID_PROGRAM_ID = new PublicKey(SolfaiManagerIDL.address)

// This is a helper function to get the SolfaiManager Anchor program.
export function getSolfaiManagerProgram(provider: AnchorProvider, address?: PublicKey) {
  return new Program({ ...SolfaiManagerIDL, address: address ? address.toBase58() : SolfaiManagerIDL.address } as SolfaiManager, provider)
}

// This is a helper function to get the program ID for the SolfaiManager program depending on the cluster.
export function getSolfaiManagerProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
      // This is the program ID for the SolfaiManager program on devnet and testnet.
      return new PublicKey('BhJaivSr483tJ2PqodLwZvE85hyRaUUWssqZyYhbqfFX')
    case 'mainnet-beta':
    default:
      return SOLFAIMANAGER_PROGRAM_ID_PROGRAM_ID
  }
}
