import {
  Lucid,
  MintingPolicy,
  getAddressDetails,
  PolicyId,
  PaymentKeyHash,
  Script,
  Unit,
  UTxO,
  fromHex,
  Redeemer,
  fromText,
  Data,
  applyParamsToScript,
  Address,
  Constr,
} from "lucid-cardano";
import scripts from "../assets/scripts.json";
// import * as utils from "lib/mint-Nfts"

interface Options {
  lucid: Lucid;
  address: string;
  name: string;
}

const { Pool, NFT } = scripts;

const poolScript: Script = {
  type: "PlutusV2",
  script: Pool,
};

const PoolDatum = Data.Object({
  aCurrency: Data.Bytes(),
  aToken: Data.Bytes(),
  colOwner: Data.Bytes(),
  rate: Data.Integer(),
});

interface d {
  aCurrency: bigint;
  aToken: bigint;
  colOwner: string;
  rate: bigint;
}

const b = {
  aCurrency: "99c2e7b696e8c49c11c5d5c0bb0951d4571b9faeb5b8aa41ee0e6b40",
  aToken: "45",
  colOwner: "93377870bd1d96fd3c24b352e5cc7f088527c6d59e65d56afa190a5c",
  rate: 4n,
};

const datum = Data.to(b, PoolDatum);

// const datumValue: d = Data.from(datum, PoolDatum);

//  const datum = Data.to(b, PoolDatum);
export const findUtxo = async (lucid: Lucid, addr: Address) => {
  const unit: Unit =
    "7f4de8356fa00f59dc09f3f467bdbe121add5b15513839a98645c2e76565";
  const utxos = await lucid.utxosAtWithUnit(addr, unit);
  console.log(await lucid.utxosAt(addr), "dd");
  return utxos;
};
export const findPubKeyHash = async (lucid: Lucid, address: Address) => {
  // const walletAddr = await lucid.wallet.address();
  const details = getAddressDetails(address);
  console.log(address, "eee");

  if (!details) throw new Error("Spending script details not found");
  const pkh = details.paymentCredential?.hash;
  if (!pkh) throw new Error("Spending script utxo not found");
  return pkh;
};

export const listNFT = async ({ lucid, address, name }: Options) => {
  const unit: Unit = b.aCurrency + b.aToken;
  console.log(name);

  const poolAddress: Address = lucid.utils.validatorToAddress(poolScript);
  const pkh = await findPubKeyHash(lucid, address);
  console.log(pkh, "ddd");

  const tx = await lucid
    .newTx()
    .payToContract(
      poolAddress,
      {
        inline: datum,
      },
      { [unit]: BigInt(1) }
    )
    .addSignerKey(pkh)
    .complete();
  const signedTx = await tx.sign().complete();
  const txHash = await signedTx.submit();
  return txHash;
};

export const buyNFT = async (lucid: Lucid, policid: string, name: string) => {
  const unit: Unit = b.aCurrency + b.aToken;
  const poolAddress: Address = lucid.utils.validatorToAddress(poolScript);

  const tx = await lucid
    .newTx()
    .payToContract(
      poolAddress,
      {
        inline: datum,
      },
      { [unit]: BigInt(1) }
    )
    .complete();
  const signedTx = await tx.sign().complete();
  const txHash = await signedTx.submit();
  return txHash;
};

// export const displayNft  = async (lucid:Lucid,name:string) => {
//   // const nftId:PolicyId =""
//   const poolAddress: Address = lucid.utils.validatorToAddress(poolScript);
//   console.log(poolAddress,"pool");
//   const unit:Unit = ""

//   const utxos = await findUtxo(lucid, poolAddress);
//   // const ut = await lucid.utxoByUnit(unit)
//   // const ut:Unit = "7f4de8356fa00f59dc09f3f467bdbe121add5b15513839a98645c2e76565"
//   // const utxos = await lucid.utxoByUnit(ut)
//   const asset = utxos.
//   // console.log(asset,"assete");
//   // const asset = utxos.

//   return 2n;
// };
// 7f4de8356fa00f59dc09f3f467bdbe121add5b15513839a98645c2e76565
// 35a26bdf9e5beedeb504effd17dc7787ec00e299eb64f03b40a536196464

// To do went to search from the user wallet currency symbol and token name and display it in brawther

export const findCs = async (lucid: Lucid, addr: Address) => {
  const unit: Unit = "";
  const utxos = await lucid.utxosAtWithUnit(addr, unit);
  console.log(await lucid.utxosAt(addr), "dd");
  return utxos;
};
