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

  it('Initialize SolfaiManager', async () => {
    const tx = await program.methods
      .initialize()
      .rpc()

      console.log('tx: ', tx)
  })
})
