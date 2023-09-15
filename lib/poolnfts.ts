import {
  Lucid,
  MintingPolicy,
  getAddressDetails,
  PolicyId,
  Credential,
  PaymentKeyHash,
  Script,
  Utils,
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
import { Nonce } from "lucid-cardano/types/src/core/libs/cardano_multiplatform_lib/cardano_multiplatform_lib.generated";
import scripts from "../assets/scripts.json";
import * as all from "./mint-Nfts1";
// import * as utils from "lib/mint-Nfts"

interface Options {
  lucid: Lucid;
  address: string;
  name: string;
}

const { Pool } = scripts;

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
  aCurrency: "d6a5f87e9bc65e87851cf047e1836db6992033a31f2f563fe86f219c",
  aToken: "64",
  colOwner: "93377870bd1d96fd3c24b352e5cc7f088527c6d59e65d56afa190a5c",
  rate: 4n,
};

const datum = Data.to(b, PoolDatum);

export const findUtxo = async (
  lucid: Lucid,
  addr: Address,
  nftId: PolicyId,
  name: string
) => {
  const utxos = await lucid.utxosAt(addr);
  return utxos;
};

export const findPubKeyHash = async (lucid: Lucid, address: Address) => {
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

export const buyNFT = async ({ lucid, address, name }: Options) => {
  const unit: Unit = b.aCurrency + b.aToken;
  const poolAddress: Address = lucid.utils.validatorToAddress(poolScript);
  const utxos = await findUtxo(lucid, poolAddress, b.aCurrency, b.aToken);
  const utxo = utxos.filter((utxo) => utxo.assets[unit]);
  const datumof = await lucid.datumOf(utxo[0]);
  const unhashDatum: d = Data.from(datumof, PoolDatum);
  const rate = unhashDatum.rate;
  console.log(rate, "datum");
  const addr: Address = await lucid.wallet.address();
  const pkh = await findPubKeyHash(lucid, addr); // see how iohk ppp solve it
  const owner = unhashDatum.colOwner;
  console.log(owner, "bib1");
  const ownerCredential: Credential = {
    type: "Key", // Assuming "Key" is the correct type for a simple string hash
    hash: owner, // Replace 'owner' with the actual string hash
  };
  const addrowner = lucid.utils.credentialToAddress(ownerCredential);
  console.log(addrowner, "d");
  const tx = await lucid
    .newTx()
    .collectFrom(utxo, Data.to(new Constr(1, [pkh])) as Redeemer)
    .payToAddress(addr, { [unit]: BigInt(1) })
    .payToAddress(addrowner, { lovelace: rate })
    .attachSpendingValidator(poolScript)
    .complete();
  const signedTx = await tx.sign().complete();
  const txHash = await signedTx.submit();
  return txHash;
};

export const findCs = async (lucid: Lucid, addr: Address) => {
  const unit: Unit = "";
  const utxos = await lucid.utxosAtWithUnit(addr, unit);
  console.log(await lucid.utxosAt(addr), "dd");
  return utxos;
};
