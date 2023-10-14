// import { Asset } from "@next/font/google";
import {
  Lucid,
  MintingPolicy,
  // Assets,
  // getAddressDetails,
  PolicyId,
  Unit,
  UTxO,
  // NFTMetadataDetails,
  fromText,
  Data,
  applyParamsToScript,
  Address,
  fromUnit,
} from "lucid-cardano";
import scripts from "../assets/scripts.json";
import metadata from "../assets/metadata.json";
import { Asset } from "@next/font/google";
// import { sortBy } from "lodash"
// import { Responses } from "@blockfrost/blockfrost-js";
import { blockfrostProxy } from "use-cardano-blockfrost-proxy";
import FormData from "form-data";
// import {
//   MetadataJsonSchema,
//   MetadataList,
// } from "lucid-cardano/types/src/core/libs/cardano_multiplatform_lib/cardano_multiplatform_lib.generated";
// https://www.npmjs.com/package/@blockfrost/blockfrost-js

interface Options {
  lucid: Lucid;
  address: string;
  name: string;
}

const { Pool, NFT } = scripts;

export const getUnit = (policyId: PolicyId, name: string): Unit =>
  policyId + fromText(name);

type Value = ReturnType<typeof fromUnit>;

interface ValueWithName extends Omit<Value, "name"> {
  value: number;
  name: string;
}

const getUtxo = async (lucid: Lucid, address: string) => {
  const utxos = await lucid!.utxosAt(address);
  const utxo = utxos[0];
  // lucid.utxoByUnit()
  return utxo;
};

export const findUtxo = async (
  lucid: Lucid,
  addr: Address,
  nftId: PolicyId,
  name: string
) => {
  const utxos = await lucid.utxosAt(addr);
  console.log(await lucid.utxosAt(addr));
  const utxo = utxos.filter((utxo) => utxo.assets[getUnit(nftId, name)]);
  console.log(utxo, "utxos");
  return utxo;
};

const getPolicyId = (lucid: Lucid, mintingPolicy: MintingPolicy) => {
  const policyId: PolicyId = lucid.utils.mintingPolicyToId(mintingPolicy);
  return policyId;
};

const getFinalPolicy = async (lucid: Lucid, utxo: UTxO, name: string) => {
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
  console.log(policyId, "policy id");
  const mintaddress: Address = lucid.utils.validatorToAddress(nftPolicy);

  const data = await lucid.utxosAt(mintaddress); // from gimbalabs https://gitlab.com/gimbalabs/ppbl-2023/ppbl-front-end-template-2023/-/blob/main/src/data/queries/contributorQueries.tsx
  console.log(data, "minted");

  return { nftPolicy, unit };
};

// const ipfsClient = new BlockFrostIPFS({
//   projectId: "ipfsuwPRuQaISYnggAmqZV5i1zKH8otvB9ZR",
// });

// const { BlockFrostIPFS } = require("@blockfrost/blockfrost-js");

// [nftPolicyIdHex, nftTokenNameHex, pkh]
export const mintNFT = async (
  { lucid, address, name }: Options,
  image: string,
  description: string
) => {
  // const wAddr = await lucid.wallet.address()
  // const assetMetadata: NFTMetadataDetails = {
  //   description: description,
  //   name: name,
  //   image: image,
  // };

  // const IMAGE_PATH = "../assets/avatar.png";
  // const PROJECT_ID = "ipfsuwPRuQaISYnggAmqZV5i1zKH8otvB9ZR"; // Replace with your actual project ID
  // // const formData = new FormData(IMAGE_PATH);
  // // formData.append("file", fs.createReadStream(IMAGE_PATH));

  // // Create a FormData object and append the file
  // const formData = new FormData();
  // formData.append(
  //   "file",
  //   fetch(IMAGE_PATH).then((response) => response.body),
  //   { filename: "avatar.png" }
  // );

  // // Define the API endpoint and headers
  // const apiUrl = "https://ipfs.blockfrost.io/api/v0/ipfs/add";
  // const headers = {
  //   project_id: PROJECT_ID,
  //   ...formData.getHeaders(),
  // };

  // Make the POST request
  // const response = await fetch(apiUrl, {
  //   method: "POST",
  //   headers: headers,
  //   body: formData,
  // });
  // console.log(response);

  // if (!response.ok) {
  //   throw new Error(`Request failed with status: ${response.status}`);
  // }

  // const responseData = await response.json();
  // console.log("Response:", responseData);

  console.log("minting NFT for " + address);
  const utxo = await getUtxo(lucid, address);
  const { nftPolicy, unit } = await getFinalPolicy(lucid, utxo, name);
  // fromUnit(unit).policyId;
  const policy = fromUnit(unit).policyId;
  // const metadata = {
  //   [policy]: {
  //     name: {
  //       description: [description],
  //       files: [
  //         {
  //           mediaType: "image/png",
  //           name: name,
  //           src: image,
  //         },
  //       ],
  //       image: image,
  //       mediaType: "image/png",
  //       name: name,
  //     },
  //   },
  //   version: "1.0",
  // };

  const metadata = {
    [policy]: {
      [name]: {
        image: image,
        name: name,
        description: description,
      },
    },
  };

  const tx = await lucid
    .newTx()
    .mintAssets({ [unit]: 1n }, Data.void())
    .attachMintingPolicy(nftPolicy)
    .attachMetadata(721, metadata) // to attach on-chain metadata
    // .attachMetadata(721, metadata) // attach metadata
    .collectFrom([utxo])
    .complete();
  const signedTx = await tx.sign().complete();
  const txHash = await signedTx.submit();
  return { txHash };
};

// ABout metadata
//https:gitlab.com/gimbalabs/ppbl-2023/ppbl-front-end-template-2023/-/blob/main/src/components/course-modules/100/ContributorMinter/ContributorPairMintingComponent.tsx
// https://cardano.stackexchange.com/questions/11334/how-to-format-metadata-for-lucid

// Upload image to IPFS
// const ipfsObject = await blockfrostProxy.add(IMAGE_PATH);
// const cid = ipfsObject.ipfs_hash;
// returns hash of the image

// console.log(
//   `Image uploaded to IPFS! Check it out https://ipfs.blockfrost.dev/ipfs/${cid}`
// );

// Fetch asset metadata for each asset in utxoAssets

// lucid,
// address: account.address,
// name,
// image: imageUrl, // Pass image URL as a property
// description,
// image: "https://www.gimbalabs.com/g.png",

export const burnNFT = async ({ lucid, address, name }: Options) => {
  // const wAddr = await lucid.wallet.address();
  console.log("minting NFT for " + address);
  const utxo = await getUtxo(lucid, address);
  const { nftPolicy, unit } = await getFinalPolicy(lucid, utxo, name);
  const policyId = getPolicyId(lucid, nftPolicy);
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

// https://github.com/GGAlanSmithee/cardano-lucid-blockfrost-proxy-example/blob/main/hooks/use-assets.ts
// https://github.com/GGAlanSmithee/cardano-lucid-blockfrost-proxy-example/blob/main/pages/assets.tsx
// https://gitlab.com/gimbalabs/ppbl-2023/ppbl-front-end-template-2023/-/blob/main/src/pages/contributors/index.tsx   or data.utxos.length

// https://github.com/blockfrost/blockfrost-js-examples
// https://github.com/blockfrost/blockfrost-js/wiki/Exports
