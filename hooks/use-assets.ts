import { Lucid,fromUnit} from "lucid-cardano"
import { Responses } from '@blockfrost/blockfrost-js';
import { sortBy } from "lodash"
import { useCallback, useEffect, useState } from "react"


type Value = ReturnType<typeof fromUnit>

interface ValueWithName extends Omit<Value, "name"> {
  value: number
  name: string
}

 const listAssets = (lucid?:Lucid) => {

    const [assets, setAssets] = useState<Responses["asset"][]>([])
    const [lovelace, setLovelace] = useState(0)

    const fetchAssets = useCallback(async () => {
        if (!lucid?.wallet) return
        const utxos = await lucid.wallet.getUtxos()
        const allUtxos = utxos
        .map((u) => Object.keys(u.assets).map((key) => ({ key, value: u.assets[key] })))
        .reduce((acc, curr) => [...acc, ...curr], [])
        .map((a) => ({
        ...fromUnit(a.key),
        value: Number(a.value),
        }))
        
    const lovelaces = allUtxos
      .filter((u) => u.policyId === "lovelace")
      .reduce((acc, curr) => acc + curr.value, 0)
  
    const utxoAssets = allUtxos
      .filter((u) => u.policyId !== "lovelace")
      .filter((v: Value): v is ValueWithName => v.name !== null)
      .map((a) => ({
        ...a,
        fullyQualifiedAssetName: `${a.policyId}${a.name}`,
      }))
  
      const assetsWithMetadata: Responses["asset"][] = await Promise.all(
        utxoAssets.map((a) =>
          fetch(`/api/blockfrost/${"Preprod"}/assets/${a.fullyQualifiedAssetName}`).then((r) =>
            r.json()
          )
        )
      )
  
    const sortedAssets = sortBy(
      assetsWithMetadata,
        (a) => (Number(a.quantity) === 1 ? 1 : -1),
        "policy_id",
        "metadata.name",
        "onchain_metadata.name"
      )
    // setAssets(sortedAssets)
    setLovelace(lovelaces)
    setAssets(sortedAssets)
    // console.log(assetsWithMetadata,"mintadd");
    // console.log(sortedAssets, "eyasumintadd");
    },[lucid?.wallet])

    useEffect(() => {
        fetchAssets()
      }, [fetchAssets])

    return {
        lovelace,
        assets,
    }  
}

export { listAssets }