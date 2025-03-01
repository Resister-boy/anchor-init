import * as anchor from '@coral-xyz/anchor'
import {Program} from '@coral-xyz/anchor'
// import {Keypair} from '@solana/web3.js'
import {SolfaiManager} from '../target/types/solfai_manager'

describe('solfai_manager', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  // const payer = provider.wallet as anchor.Wallet

  const program = anchor.workspace.SolfaiManager as Program<SolfaiManager>

  // const solfaiManagerKeypair = Keypair.generate()

  it('Initialize Program Config', async () => {
    const tx = await program.methods
      .initializeConfig()
      .rpc()

      console.log('tx: ', tx)
  })

  it('Initialize etf token vault', async () => {
    const tx = await program.methods
      .initializeEtfTokenVault()
      .rpc()

      console.log('tx: ', tx)
  })

  it('add etf token', async () => {
    const tx = await program.methods
      .fundEtfToken()
      .rpc()

      console.log('tx: ', tx)
  })
})
