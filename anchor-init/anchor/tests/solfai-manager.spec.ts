import * as anchor from '@coral-xyz/anchor'
import {Program} from '@coral-xyz/anchor'
import {Keypair} from '@solana/web3.js'
import {SolfaiManager} from '../target/types/solfai_manager'

describe('solfai_manager', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const payer = provider.wallet as anchor.Wallet

  const program = anchor.workspace.SolfaiManager as Program<SolfaiManager>

  let admin = anchor.web3.Keypair.generate()

  // const etfCreatorKeypair = Keypair.generate()

  it('As an Admin, I can initialize Program Config', async () => {
    await airdrop(program.provider.connection, admin.publicKey, 500_000_000_000);

    let [program_config, bump] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("config")],
      program.programId
    );

    console.log("program_config: ", program_config.toBase58())

    const tx = await program.methods
      .initializeConfig()
      .accounts({
        admin: admin.publicKey,
      })
      .signers([admin])
      .rpc()

      console.log('tx: ', tx)
  })

  // it('Initialize etf token vault', async () => {
  //   const tx = await program.methods
  //     .initializeEtfTokenVault()
  //     .rpc()

  //     console.log('tx: ', tx)
  // })

  // it('add etf token', async () => {
  //   const tx = await program.methods
  //     .fundEtfToken()
  //     .rpc()

  //     console.log('tx: ', tx)
  // })
})

export async function airdrop(
  connection: any,
  address: any,
  amount = 500_000_000_000
) {
  await connection.confirmTransaction(
    await connection.requestAirdrop(address, amount),
    'confirmed'
  );
}
