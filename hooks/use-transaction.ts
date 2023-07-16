import { useCallback, useState } from "react"
import { useCardano } from "use-cardano"

const useTransaction = () => {
  const { isValid, lucid } = useCardano()

  const [successMessage, setSuccessMessage] = useState<string>()
  const [error, setError] = useState<Error | undefined>()
  const [lovelace, setLovelace] = useState(0)
  const [toAccount, setToAccount] = useState("")

  const sendTransaction = useCallback(async () => {
    if (!lucid || !toAccount || !lovelace) return

    try {
      const tx = await lucid
        .newTx()
        .payToAddress(toAccount, { lovelace: BigInt(lovelace) })
        .complete()

      const signedTx = await tx.sign().complete()

      const txHash = await signedTx.submit()

      setLovelace(0)
      setToAccount("")
      setSuccessMessage(`Transaction submitted with hash ${txHash}`)
    } catch (e) {
      if (e instanceof Error) setError(e)
      else console.error(e)
    }
  }, [lucid, toAccount, lovelace])

  const lovelaceSetter = useCallback((value: string) => {
    setError(undefined)
    setSuccessMessage(undefined)

    const parsed = parseInt(value)
    if (isNaN(parsed)) return
    setLovelace(parsed)
  }, [])

  const toAccountSetter = useCallback((value: string) => {
    setError(undefined)
    setSuccessMessage(undefined)
    setToAccount(value)
  }, [])

  return {
    error,
    successMessage,
    lovelace,
    setLovelace: lovelaceSetter,
    toAccount,
    setToAccount: toAccountSetter,
    sendTransaction,
    canTransact: isValid && lovelace > 0 && toAccount,
  }
}

export { useTransaction }
