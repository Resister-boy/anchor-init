import * as anchor from '@coral-xyz/anchor'
import {Program} from '@coral-xyz/anchor'
import {Keypair} from '@solana/web3.js'
import {Anchorinit} from '../target/types/anchorinit'

describe('anchorinit', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const payer = provider.wallet as anchor.Wallet

  const program = anchor.workspace.Anchorinit as Program<Anchorinit>

  const anchorinitKeypair = Keypair.generate()

  it('Initialize Anchorinit', async () => {
    await program.methods
      .initialize()
      .accounts({
        anchorinit: anchorinitKeypair.publicKey,
        payer: payer.publicKey,
      })
      .signers([anchorinitKeypair])
      .rpc()

    const currentCount = await program.account.anchorinit.fetch(anchorinitKeypair.publicKey)

    expect(currentCount.count).toEqual(0)
  })

  it('Increment Anchorinit', async () => {
    await program.methods.increment().accounts({ anchorinit: anchorinitKeypair.publicKey }).rpc()

    const currentCount = await program.account.anchorinit.fetch(anchorinitKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Increment Anchorinit Again', async () => {
    await program.methods.increment().accounts({ anchorinit: anchorinitKeypair.publicKey }).rpc()

    const currentCount = await program.account.anchorinit.fetch(anchorinitKeypair.publicKey)

    expect(currentCount.count).toEqual(2)
  })

  it('Decrement Anchorinit', async () => {
    await program.methods.decrement().accounts({ anchorinit: anchorinitKeypair.publicKey }).rpc()

    const currentCount = await program.account.anchorinit.fetch(anchorinitKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Set anchorinit value', async () => {
    await program.methods.set(42).accounts({ anchorinit: anchorinitKeypair.publicKey }).rpc()

    const currentCount = await program.account.anchorinit.fetch(anchorinitKeypair.publicKey)

    expect(currentCount.count).toEqual(42)
  })

  it('Set close the anchorinit account', async () => {
    await program.methods
      .close()
      .accounts({
        payer: payer.publicKey,
        anchorinit: anchorinitKeypair.publicKey,
      })
      .rpc()

    // The account should no longer exist, returning null.
    const userAccount = await program.account.anchorinit.fetchNullable(anchorinitKeypair.publicKey)
    expect(userAccount).toBeNull()
  })
})
