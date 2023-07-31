import { Asset } from "@next/font/google";
import { Lucid,MintingPolicy,Assets, getAddressDetails,PolicyId, Unit,UTxO, NFTMetadataDetails,fromText,Data,applyParamsToScript,Address, fromUnit} from "lucid-cardano"
import scripts from "../assets/scripts.json";
import metadata from "../assets/metadata.json";
import { sortBy } from "lodash"
import { Responses } from '@blockfrost/blockfrost-js';
import { MetadataJsonSchema, MetadataList } from "lucid-cardano/types/src/core/libs/cardano_multiplatform_lib/cardano_multiplatform_lib.generated";
// https://www.npmjs.com/package/@blockfrost/blockfrost-js

interface Options {
 lucid: Lucid
 address: string
 name: string
}

const {Pool,NFT } = scripts;

const getUnit = (policyId: PolicyId, name: string): Unit => policyId + fromText(name)

type Value = ReturnType<typeof fromUnit>

interface ValueWithName extends Omit<Value, "name"> {
  value: number
  name: string
}

const getUtxo = async (lucid:Lucid,address: string)=> {
    const utxos = await lucid!.utxosAt(address);
    const utxo = utxos[0];
    // lucid.utxoByUnit()
    return utxo;
}; 

export const findUtxo = async (lucid:Lucid,addr: Address , nftId: PolicyId, name: string) => {
    const utxos = await lucid.utxosAt(addr);
    console.log(await lucid.utxosAt(addr));
    const utxo = utxos.filter(
      (utxo) => utxo.assets[getUnit(nftId,name)]
    );
    console.log(utxo, "utxos");
    return utxo;
  };

const getPolicyId = (lucid: Lucid, mintingPolicy: MintingPolicy) => {
    const policyId: PolicyId = lucid.utils.mintingPolicyToId(mintingPolicy)
    return policyId
  }

const getFinalPolicy = async (lucid:Lucid,utxo:UTxO,name:string)=> {
    const tn = fromText(name);
    // const utxo = await getUtxo(lucid,address);
    const Params = Data.Tuple([Data.Bytes(), Data.Integer(), Data.Bytes()]);
    type Params = Data.Static<typeof Params>;
    const nftPolicy: MintingPolicy = {
        type: "PlutusV2",
        script: applyParamsToScript<Params>(
            NFT,
            [utxo.txHash, BigInt(utxo.outputIndex), tn],
            Params
        ),
    };
    const policyId: PolicyId = lucid!.utils.mintingPolicyToId(nftPolicy);
    
    const unit: Unit = policyId + tn;
    console.log(policyId,"policy id");
    const mintaddress: Address = lucid.utils.validatorToAddress(nftPolicy);
    
    
    // const data =  await  lucid.utxosAt(mintaddress); from gimbalabs https://gitlab.com/gimbalabs/ppbl-2023/ppbl-front-end-template-2023/-/blob/main/src/data/queries/contributorQueries.tsx
 
    return { nftPolicy, unit };
};

// [nftPolicyIdHex, nftTokenNameHex, pkh]
export const mintNFT = async ({ lucid,address, name }: Options) => {
    // const wAddr = await lucid.wallet.address()
    const assetMetadata: NFTMetadataDetails = {
      name: "tokenname",
      image: "https://www.gimbalabs.com/g.png",
    };
    
    console.log("minting NFT for " + address);
    const utxo = await getUtxo(lucid,address);
    // const asset = utxo.assets.
    // const asset: Assets = {["d"]:1n}
    // const asst = asset
    const { nftPolicy, unit } = await getFinalPolicy(lucid,utxo,name);
    // const policyid = await getPolicyId(lucid,nftPolicy)
    // const hexname = await fromText(name) 
    fromUnit(unit).policyId
    const tx = await lucid
            .newTx()
            .mintAssets({[unit]: 1n},Data.void())
            .attachMintingPolicy(nftPolicy)
            .attachMetadata(1,assetMetadata) // to attach on-chain metadata
            .attachMetadata(721,metadata)  // attach metadata
            .collectFrom([utxo])
            .complete();
            
    const signedTx = await tx.sign().complete();
    const txHash = await signedTx.submit();
    return {txHash,assetMetadata};
  };

export const burnNFT = async ({lucid,address,name}:Options) => {
    // const wAddr = await lucid.wallet.address();
    console.log("minting NFT for " + address); 
    const utxo = await getUtxo(lucid,address);
    const { nftPolicy, unit } = await getFinalPolicy(lucid,utxo,name);
    const policyId = getPolicyId(lucid, nftPolicy)
    const utxos = await findUtxo(lucid, address, policyId, name);
    const tx = await lucid!
            .newTx()
            .collectFrom([utxo])
            .mintAssets({ [unit]: -1n })
            .attachMintingPolicy(nftPolicy)
            .addSignerKey(address)
            .complete();
    const signedTx = await tx.sign().complete();
    const txHash = await signedTx.submit();
    return txHash;
    };
    
export const listAssets = async ({lucid,address,name}:Options) => {
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
  
  console.log(assetsWithMetadata,"mintadd");
  console.log(sortedAssets, "eyasumintadd");
  return {lovelaces,sortedAssets};
      };
      // https://github.com/GGAlanSmithee/cardano-lucid-blockfrost-proxy-example/blob/main/hooks/use-assets.ts
      // https://github.com/GGAlanSmithee/cardano-lucid-blockfrost-proxy-example/blob/main/pages/assets.tsx
      // https://gitlab.com/gimbalabs/ppbl-2023/ppbl-front-end-template-2023/-/blob/main/src/pages/contributors/index.tsx   or data.utxos.length

      // https://github.com/blockfrost/blockfrost-js-examples
      // https://github.com/blockfrost/blockfrost-js/wiki/Exports