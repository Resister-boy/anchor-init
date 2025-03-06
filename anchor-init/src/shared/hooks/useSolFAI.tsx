import { SolFAIContext } from "@/context/solfai/SolFAIContext";
import BN from "bn.js";
import { useCallback, useContext } from "react";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { mplToolbox } from "@metaplex-foundation/mpl-toolbox";
import { generateSigner } from "@metaplex-foundation/umi";
import { createFungible } from "@metaplex-foundation/mpl-token-metadata";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { Keypair, PublicKey } from "@solana/web3.js";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createMint,
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import * as anchor from "@coral-xyz/anchor";

export const useSolFAI = () => {
  const { provider, program, programPda, state } = useContext(SolFAIContext);

  const initializeConfig = useCallback(async () => {
    try {
      if (provider && program) {
        const tx = await program.methods
          .initializeConfig()
          .accounts({
            admin: provider.publicKey,
          })
          .rpc();

        return tx;
      }
      return null;
    } catch (error) {
      console.error(error);
      return null;
    }
  }, [provider, program]);

  const initializeFund = useCallback(
    async ({
      mint,
      name,
      description,
      amount,
    }: {
      mint: string;
      name: string;
      description: string;
      amount: BN;
    }) => {
      try {
        if (provider && program) {
          const vaultId = state.etfTokenCount.add(new BN(1));

          let [etfVaultPda, _] = anchor.web3.PublicKey.findProgramAddressSync(
            [
              Buffer.from("etf_token_vault"),
              new anchor.BN(vaultId).toArrayLike(Buffer, "le", 8),
            ],
            program.programId
          );

          let [vaultPda, vaultPdaBump] =
            anchor.web3.PublicKey.findProgramAddressSync(
              [
                Buffer.from("vault"),
                new anchor.BN(vaultId).toArrayLike(Buffer, "le", 8),
              ],
              program.programId
            );

          const tx = await program.methods
            .initializeEtfTokenVault(name, description, amount)
            .accounts({
              creator: provider.publicKey,
              etfVault: etfVaultPda,
              etfTokenMint: new PublicKey(mint),
              vault: vaultPda,
            })
            .rpc();

          return etfVaultPda;
        }
        return null;
      } catch (error) {
        console.error(error);
        return null;
      }
    },
    [provider, program]
  );

  const fundToken = useCallback(
    async ({ vaultId, amount }: { vaultId: BN; amount: BN }) => {
      try {
        if (provider && program) {
          const tx = await program.methods
            .fundEtfToken(vaultId, amount)
            .accounts({
              user: provider.publicKey,
            })
            .rpc({
              skipPreflight: true,
            });

          return tx;
        }
        return null;
      } catch (error) {
        console.log(error);
        return null;
      }
    },
    [provider, program]
  );

  const fetchAllVaults = useCallback(async () => {
    try {
      if (provider && program) {
        const vaults = await (program.account as any).etfTokenVault.all();
        console.log(vaults);
        return vaults;
      }
      return null;
    } catch (error) {
      console.error(error);
      return null;
    }
  }, [provider, program]);

  const fetchVault = useCallback(
    async (vaultId: BN) => {
      try {
        if (provider && program) {
          const vaults = await (program.account as any).etfTokenVault.all();

          return vaults.find((vault: any) => vault.account.id.eq(vaultId));
        }
        return null;
      } catch (error) {
        console.error(error);
        return null;
      }
    },
    [provider, program]
  );

  const fetchFund = useCallback(
    async (vaultId: BN) => {
      try {
        if (provider && program) {
          const users = await (program.account as any).userFunding.all();

          return users.filter((user: any) => {
            return user.account.etfTokenVaultId.eq(vaultId);
          });
        }
        return null;
      } catch (error) {
        console.error(error);
        return null;
      }
    },
    [program, program]
  );

  const mintToken = useCallback(
    async ({
      name,
      symbol,
      uri,
    }: {
      name: string;
      symbol: string;
      uri: string;
    }) => {
      try {
        if (provider) {
          const umi = createUmi(provider.connection).use(mplToolbox());
          umi.use(walletAdapterIdentity(provider.wallet));
          const mint = generateSigner(umi);

          const txLayout = createFungible(umi, {
            name,
            symbol,
            uri,
            decimals: 6,
            mint,
            sellerFeeBasisPoints: {
              basisPoints: BigInt(0),
              identifier: "%",
              decimals: 2,
            },
          });

          await txLayout.sendAndConfirm(umi, {
            confirm: { commitment: "processed" },
          });

          return mint.publicKey;
        }
        return null;
      } catch (error) {
        console.error(error);
        return null;
      }
    },
    [program, provider]
  );

  const createToken = useCallback(async () => {
    try {
      if (provider) {
        const signer = Keypair.generate();
        await provider.connection.confirmTransaction(
          await provider.connection.requestAirdrop(
            signer.publicKey,
            500_000_000_000
          ),
          "confirmed"
        );
        const mint = Keypair.generate();

        const token = await createMint(
          provider.connection,
          signer,
          provider.wallet.publicKey,
          null,
          6,
          mint
        );

        return token;
      }
      return null;
    } catch (error) {
      console.error(error);
      return null;
    }
  }, [program, provider]);

  const swapToken = useCallback(
    async ({
      vaultId,
      user,
      mint,
    }: {
      vaultId: BN;
      user: string;
      mint: string;
    }) => {
      try {
        if (provider && program) {
          const tx = await program.methods
            .swapEtfTokenForSol(vaultId)
            .accounts({
              user: new PublicKey(user),
              mint: new PublicKey(mint),
            })
            .rpc({ skipPreflight: true });

          return tx;
        }
        return null;
      } catch (error) {
        console.error(error);
        return null;
      }
    },
    [program, provider]
  );

  const claimToken = useCallback(
    async ({ vaultId, mint }: { vaultId: BN; mint: string }) => {
      try {
        if (provider && program) {
          const tx = await program.methods
            .claimEtfToken(vaultId)
            .accounts({
              user: provider.publicKey,
              mint: new PublicKey(mint),
            })
            .rpc({ skipPreflight: true });

          return tx;
        }
        return null;
      } catch (error) {
        console.error(error);
        return null;
      }
    },
    [program, provider]
  );

  const getATA = useCallback(
    async ({ mint, user }: { mint: string; user: string }) => {
      try {
        const mintAddress = new PublicKey(mint);
        const userAddress = new PublicKey(user);

        const tokenAddress = await getAssociatedTokenAddress(
          mintAddress,
          userAddress,
          false,
          TOKEN_PROGRAM_ID,
          ASSOCIATED_TOKEN_PROGRAM_ID
        );

        return tokenAddress;
      } catch (error) {
        console.error(error);
        return null;
      }
    },
    []
  );

  return {
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
    claimToken,
    createToken,
    swapToken,
    getATA,
  };
};
