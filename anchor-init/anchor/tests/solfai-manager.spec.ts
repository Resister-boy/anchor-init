import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import { Account, Keypair, SystemProgram, Connection, PublicKey } from '@solana/web3.js'
import { SolfaiManager } from '../target/types/solfai_manager'
import {
  getOrCreateAssociatedTokenAccount,
  createMint,
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  MintLayout,
  createAssociatedTokenAccountInstruction
} from "@solana/spl-token";

describe('solfai_manager', () => {

  // Connect to Solana Localnet
  const connection = new Connection("http://127.0.0.1:8899", "confirmed");

  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const payer = provider.wallet as anchor.Wallet

  const program = anchor.workspace.SolfaiManager as Program<SolfaiManager>

  let admin = anchor.web3.Keypair.generate()

  const etfCreator1Keypair = Keypair.generate()
  const fundingUser1Keypair = Keypair.generate()
  const fundingUser2Keypair = Keypair.generate()

  // Generate a new keypair for the mint (This is the mint account)
  const mint1ByCreator1 = Keypair.generate()
  const mint2ByCreator1 = Keypair.generate()


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

    // create mint account 
    const mintAddress = await createMint(
      connection,         // Solana Connection
      etfCreator1Keypair,      // Payer (pays the transaction fees)
      etfCreator1Keypair.publicKey, // Mint authority (who can mint tokens)
      null,
      6, // Decimals (e.g., 6 = 1,000,000 units per token)
      mint1ByCreator1,                // Keypair for the mint account
    );

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

    const tx = await program.methods
      .initializeEtfTokenVault(
        "COOCIE ETF",
        "COOCIE is a new ETF token on Solana",
        new anchor.BN(20_000_000_000), // funding goal: 20 SOL
      )
      .accounts({
        creator: etfCreator1Keypair.publicKey,
        etfVault: etfVaultPda,
        etfTokenMint: mintAddress,
      })
      .signers([etfCreator1Keypair])
      .rpc()

    console.log('tx: ', tx)

    const etfVault = await program.account.etfTokenVault.fetch(etfVaultPda);
    console.log('ETF TOKEN VAULT: ', etfVault)

    console.log('ETF MINT: ', mintAddress.toString())

    console.log('=======================================================',)
    // create mint account 
    const mint2Address = await createMint(
      connection,         // Solana Connection
      etfCreator1Keypair,      // Payer (pays the transaction fees)
      etfCreator1Keypair.publicKey, // Mint authority (who can mint tokens)
      null,
      6, // Decimals (e.g., 6 = 1,000,000 units per token)
      mint2ByCreator1,                // Keypair for the mint account
    );

    ETF_VAULT_ID = programState.etfTokenCount.add(new anchor.BN(2))

    let [etfVault2Pda, etfVault2Bump] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("etf_token_vault"), new anchor.BN(ETF_VAULT_ID).toArrayLike(Buffer, "le", 8)],
      program.programId
    );
    const tx2 = await program.methods
      .initializeEtfTokenVault(
        "COOCIE ETF 2",
        "COOCIE is a new ETF token on Solana 2",
        new anchor.BN(10_000_000_000), // funding goal: 10 SOL
      )
      .accounts({
        creator: etfCreator1Keypair.publicKey,
        etfVault: etfVault2Pda,
        etfTokenMint: mint2Address,
      })
      .signers([etfCreator1Keypair])
      .rpc()

    console.log('tx 2: ', tx2)

    const etfVault2 = await program.account.etfTokenVault.fetch(etfVault2Pda);
    console.log('ETF TOKEN VAULT 2: ', etfVault2)

    console.log('ETF MINT 2: ', mint2Address.toString())
  })

  it('Funding', async () => {
    await airdrop(program.provider.connection, fundingUser1Keypair.publicKey, 500_000_000_000);

    let ETF_VAULT_ID = new anchor.BN(1)

    let [etfVaultPda, etfVaultBump] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("etf_token_vault"), new anchor.BN(ETF_VAULT_ID).toArrayLike(Buffer, "le", 8)],
      program.programId
    );

    let tx = await program.methods
      .fundEtfToken(
        ETF_VAULT_ID,
        new anchor.BN(1_000_000_000), // 1 SOL
      )
      .accounts({
        user: fundingUser1Keypair.publicKey,
      })
      .signers([fundingUser1Keypair])
      .rpc({
        skipPreflight: true
      })
    console.log('funding user 1 tx: ', tx)

    await airdrop(program.provider.connection, fundingUser2Keypair.publicKey, 500_000_000_000);

    tx = await program.methods
      .fundEtfToken(
        ETF_VAULT_ID,
        new anchor.BN(19_000_000_000), // 19 SOL
      )
      .accounts({
        user: fundingUser2Keypair.publicKey,
      })
      .signers([fundingUser2Keypair])
      .rpc({
        skipPreflight: true
      })
    console.log('funding user 2 tx: ', tx)
  })

  it('Claim', async () => {
    let ETF_VAULT_ID = new anchor.BN(1)
    let [etfVaultPda, etfVaultBump] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("etf_token_vault"), new anchor.BN(ETF_VAULT_ID).toArrayLike(Buffer, "le", 8)],
      program.programId
    );
    
    let tx = await program.methods.claimEtfToken(
      ETF_VAULT_ID,
    )
      .accounts({
        user: fundingUser1Keypair.publicKey,
        mint: mint1ByCreator1.publicKey,
      })
      .signers([fundingUser1Keypair])
      .rpc({
        skipPreflight: false
      })
    console.log('claim user 1 tx: ', tx)
  })

  it('As a user, I can get all etf token vaults', async () => {
    const allVaults = await fetchAllEtfTokenVaults(program);
    console.log('ALL ETF VAULTS: ', allVaults)
  })

  it('As a user, I can get all user fundings', async () => {
    const metadata = await fetchAllUserFunding(program, 1);
    console.log('ALL ETF User Fundings: ', metadata)
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
  const allVaultAccounts = await program.account.etfTokenVault.all();

  return deserializeVaults(allVaultAccounts);
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

const deserializeVaults = (vaults: any[]): EtfTokenVault[] =>
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

export const fetchAllUserFunding = async (
  program: Program<SolfaiManager>,
  etfTokenVauldId: number,
) => {
  let userFundings = await program.account.userFunding.all();

  userFundings = userFundings.filter((userFunding) => {
    return userFunding.account.etfTokenVaultId.eq(new anchor.BN(etfTokenVauldId))
  })

  return deserializeUserFundings(userFundings);
}

interface UserFunding {
  etfTokenVaultId: number;
  user: string;
  totalAmount: number;
  lastUpdated: number;
}

const deserializeUserFundings = (arr: any[]): UserFunding[] =>
  arr.map((item: any) => ({
    etfTokenVaultId: item.account.etfTokenVaultId,
    user: item.account.user.toBase58(),
    totalAmount: item.account.totalAmount.toNumber(),
    lastUpdated: item.account.lastUpdated.toNumber() * 1000,
  }));