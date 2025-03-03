import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import { Account, Keypair, SystemProgram } from '@solana/web3.js'
import { SolfaiManager } from '../target/types/solfai_manager'

describe('solfai_manager', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const payer = provider.wallet as anchor.Wallet

  const program = anchor.workspace.SolfaiManager as Program<SolfaiManager>

  let admin = anchor.web3.Keypair.generate()

  const etfCreator1Keypair = Keypair.generate()
  const fundingUser1Keypair = Keypair.generate()
  const fundingUser2Keypair = Keypair.generate()

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
        "COOCIE ETF",
        "COOCIE",
        "https://old.captaincompliance.com/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2Fdabdcq5u%2Fproduction%2Fec6ca5585814616098ef197f2215567cfb5bf52d-2000x1200.png&w=1920&q=75",
        "COOCIE is a new ETF token on Solana",
        new anchor.BN(20_000_000_000), // funding goal: 20 SOL
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

  it('Funding', async () => {
    await airdrop(program.provider.connection, fundingUser1Keypair.publicKey, 500_000_000_000);

    let ETF_VAULT_ID = new anchor.BN(1)

    let [etfVaultPda, etfVaultBump] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("etf_token_vault"), new anchor.BN(ETF_VAULT_ID).toArrayLike(Buffer, "le", 8)],
      program.programId
    );

    let [mint, mintBump] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("etf_token_mint"), new anchor.BN(ETF_VAULT_ID).toArrayLike(Buffer, "le", 8)],
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

  it('As a user, I can get all etf token vaults', async () => {
    const allVaults = await fetchAllEtfTokenVaults(program);
    console.log('ALL ETF VAULTS: ', allVaults)
  })

  it('As a user, I can get all etf token metadata', async () => {
    const metadata = await fetchAllEtfTokenMetadata(program);
    console.log('ALL ETF METADATA: ', metadata)
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
  let [programStatePda, programStateBump] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("program_state")],
    program.programId
  );

  const programState = await program.account.programState.fetch(programStatePda);
  console.log('PROGRAM STATE: ', programState)

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

export const fetchAllEtfTokenMetadata = async (
  program: Program<SolfaiManager>,
) => {
  const metadataArr = await program.account.etfTokenMetadata.all();

  return deserializeMetadataArr(metadataArr);
}

interface EtfTokenMetadata {
  symbol: string;
  uri: string;
  mint: string;
}

const deserializeMetadataArr = (arr: any[]): EtfTokenMetadata[] =>
  arr.map((item: any) => ({
    symbol: item.account.symbol,
    uri: item.account.uri,
    mint: item.account.mint.toBase58(),
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