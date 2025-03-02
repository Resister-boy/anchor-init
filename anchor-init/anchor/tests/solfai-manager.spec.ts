import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import { Keypair, SystemProgram } from '@solana/web3.js'
import { SolfaiManager } from '../target/types/solfai_manager'

describe('solfai_manager', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const payer = provider.wallet as anchor.Wallet

  const program = anchor.workspace.SolfaiManager as Program<SolfaiManager>

  let admin = anchor.web3.Keypair.generate()

  const etfCreator1Keypair = Keypair.generate()
  const etfCreator2Keypair = Keypair.generate()

  it('As an Admin, I can initialize Program Config', async () => {
    await airdrop(program.provider.connection, admin.publicKey, 500_000_000_000);

    const tx = await program.methods
      .initializeConfig()
      .accounts({
        admin: admin.publicKey,
      })
      .signers([admin])
      .rpc()

    console.log('tx: ', tx)

    let [programStatePda, _] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("program_state")],
      program.programId
    );
    const programState = await program.account.programState.fetch(programStatePda);
    console.log('PROGRAM STATE: ', programState)
  })

  it('As a creator, I can initialize an etf token vault', async () => {
    await airdrop(program.provider.connection, etfCreator1Keypair.publicKey, 500_000_000_000);

    let [programStatePda, programStateBump] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("program_state")],
      program.programId
    );

    const programState = await program.account.programState.fetch(programStatePda);
    let ETF_VAULT_ID = programState.etfTokenCount.add(new anchor.BN(1))

    let [etfVaultPda, etfVaultBump] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("etf_token_vault"), new anchor.BN(ETF_VAULT_ID).toArrayLike(Buffer, "le", 8)],
      program.programId
    );

    let [mint, mintBump] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("etf_token_mint"), new anchor.BN(ETF_VAULT_ID).toArrayLike(Buffer, "le", 8)],
      program.programId
    );

    const tx = await program.methods
      .initializeEtfTokenVault(
        "$COOCIE",
        "COOCIE is a new ETF token on Solana",
        new anchor.BN(20_000_000_000), // 20 SOL
      )
      .accounts({
        creator: etfCreator1Keypair.publicKey,
        etfVault: etfVaultPda,
        etfTokenMint: mint,
      })
      .signers([etfCreator1Keypair])
      .rpc()

    console.log('tx: ', tx)

    const etfVault = await program.account.etfTokenVault.fetch(etfVaultPda);
    console.log('ETF TOKEN VAULT: ', etfVault)

    console.log('ETF MINT: ', mint.toString())
  })


  // it('As a user, I can get program state', async () => {
  //   let [programStatePda, _] = anchor.web3.PublicKey.findProgramAddressSync(
  //     [Buffer.from("program_state")],
  //     program.programId
  //   );
  //   const programState = await program.account.programState.fetch(programStatePda);
  //   console.log('PROGRAM STATE: ', programState)
  // })

  it('As a user, I can get all etf token vaults', async () => {
    const allVaults = await fetchAllEtfTokenVaults(program);
    console.log('ALL ETF VAULTS: ', allVaults)
  })
})

export async function airdrop(
  connection: any,
  address: any,
  amount = 500_000_000_000 // 500 SOL
) {
  await connection.confirmTransaction(
    await connection.requestAirdrop(address, amount),
    'confirmed'
  );
}

export const fetchAllEtfTokenVaults = async (
  program: Program<SolfaiManager>,
) => {
  let [programStatePda, programStateBump] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("program_state")],
    program.programId
  );

  const programState = await program.account.programState.fetch(programStatePda);
  console.log('PROGRAM STATE: ', programState)

  const allVaultAccounts = await program.account.etfTokenVault.all();

  return serializedVaults(allVaultAccounts);
}

interface EtfTokenVault {
  id: number;
  creator: string;
  etfName: string;
  etfMint: string;
  description: string;
  fundedAmount: number;
  fundingGoal: number;
  fundingStartTime: number;
  fundingUserCount: number;
  status: number;
}

const serializedVaults = (vaults: any[]): EtfTokenVault[] =>
  vaults.map((v: any) => ({
    id: v.account.id.toNumber(),
    creator: v.account.creator.toBase58(),
    etfName: v.account.etfName,
    etfMint: v.account.etfTokenMint.toBase58(),
    description: v.account.description,
    fundedAmount: v.account.fundedAmount.toNumber(),
    fundingGoal: v.account.fundingGoal.toNumber(),
    fundingStartTime: v.account.fundingStartTime,
    fundingUserCount: v.account.fundingUserCount.toNumber(),
    status: v.account.status,
  }));
