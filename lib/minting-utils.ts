import { Lucid, MintingPolicy, PolicyId, TxHash, Unit, fromHex } from "lucid-cardano"
import { Redeemer } from "lucid-cardano/types/src/core/libs/cardano_multiplatform_lib/cardano_multiplatform_lib.generated"

interface Options {
  lucid: Lucid
  address: string
  name: string
}

// fully qualified asset name, hex encoded policy id + name
const getUnit = (policyId: PolicyId, name: string): Unit => policyId + fromHex(name)

const getMintingPolicy = (lucid: Lucid, address: string) => {
  const { paymentCredential } = lucid.utils.getAddressDetails(address)

  const mintingPolicy: MintingPolicy = lucid.utils.nativeScriptFromJson({
    type: "all",
    scripts: [{ type: "sig", keyHash: paymentCredential?.hash! }],
  })

  return mintingPolicy
}

const getPolicyId = (lucid: Lucid, mintingPolicy: MintingPolicy) => {
  const policyId: PolicyId = lucid.utils.mintingPolicyToId(mintingPolicy)

  return policyId
}

export const mintNFT = async ({ lucid, address, name }: Options) => {
  const mintingPolicy = getMintingPolicy(lucid, address)
  const policyId = getPolicyId(lucid, mintingPolicy)
  const unit = getUnit(policyId, name)

  const tx = await lucid
    .newTx()
    .mintAssets({ [unit]: 1n })
    .attachMintingPolicy(mintingPolicy)
    .complete()

  const signedTx = await tx.sign().complete()

  const txHash = await signedTx.submit()

  return txHash
}

export const burnNFT = async ({ lucid, address, name }: Options): Promise<TxHash> => {
  const mintingPolicy = getMintingPolicy(lucid, address)
  const policyId = getPolicyId(lucid, mintingPolicy)
  const unit = getUnit(policyId, name)

  const tx = await lucid
    .newTx()
    .mintAssets({ [unit]: -1n })
    .attachMintingPolicy(mintingPolicy)
    .complete()

  const signedTx = await tx.sign().complete()

  const txHash = await signedTx.submit()

  return txHash
}


// ToDo 
// nft mint and burn
// using pool script sell Redeemer transfer nft to the market 
// using buy buy nft from the pool
