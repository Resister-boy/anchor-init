'use client'

import { getAnchorinitProgram, getAnchorinitProgramId } from '@project/anchor'
import { useConnection } from '@solana/wallet-adapter-react'
import { Cluster, Keypair, PublicKey } from '@solana/web3.js'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'
import { useCluster } from '../cluster/cluster-data-access'
import { useAnchorProvider } from '../solana/solana-provider'
import { useTransactionToast } from '../ui/ui-layout'

export function useAnchorinitProgram() {
  const { connection } = useConnection()
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const provider = useAnchorProvider()
  const programId = useMemo(() => getAnchorinitProgramId(cluster.network as Cluster), [cluster])
  const program = useMemo(() => getAnchorinitProgram(provider, programId), [provider, programId])

  const accounts = useQuery({
    queryKey: ['anchorinit', 'all', { cluster }],
    queryFn: () => program.account.anchorinit.all(),
  })

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  })

  const initialize = useMutation({
    mutationKey: ['anchorinit', 'initialize', { cluster }],
    mutationFn: (keypair: Keypair) =>
      program.methods.initialize().accounts({ anchorinit: keypair.publicKey }).signers([keypair]).rpc(),
    onSuccess: (signature) => {
      transactionToast(signature)
      return accounts.refetch()
    },
    onError: () => toast.error('Failed to initialize account'),
  })

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    initialize,
  }
}

export function useAnchorinitProgramAccount({ account }: { account: PublicKey }) {
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const { program, accounts } = useAnchorinitProgram()

  const accountQuery = useQuery({
    queryKey: ['anchorinit', 'fetch', { cluster, account }],
    queryFn: () => program.account.anchorinit.fetch(account),
  })

  const closeMutation = useMutation({
    mutationKey: ['anchorinit', 'close', { cluster, account }],
    mutationFn: () => program.methods.close().accounts({ anchorinit: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accounts.refetch()
    },
  })

  const decrementMutation = useMutation({
    mutationKey: ['anchorinit', 'decrement', { cluster, account }],
    mutationFn: () => program.methods.decrement().accounts({ anchorinit: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const incrementMutation = useMutation({
    mutationKey: ['anchorinit', 'increment', { cluster, account }],
    mutationFn: () => program.methods.increment().accounts({ anchorinit: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const setMutation = useMutation({
    mutationKey: ['anchorinit', 'set', { cluster, account }],
    mutationFn: (value: number) => program.methods.set(value).accounts({ anchorinit: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  return {
    accountQuery,
    closeMutation,
    decrementMutation,
    incrementMutation,
    setMutation,
  }
}
