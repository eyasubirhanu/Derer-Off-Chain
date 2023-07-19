import { Lucid,MintingPolicy, getAddressDetails,PolicyId,PaymentKeyHash, Script,Unit,UTxO,fromHex, Redeemer,fromText,Data,applyParamsToScript,Address, Constr} from "lucid-cardano"
import scripts from "../assets/scripts.json";

interface Options {
 lucid: Lucid
 address: string
 name: string
}

const {Pool,NFT } = scripts;

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
    state: boolean;
    exchangeRate: bigint;
  }

  const b = {
    aCurrency: "f07a742d15e1f6a5890fadc95e262a63c771e2db6876187011cfad70",
    aToken: "47204e4654",
    colOwner:2,
    rate:4,
  };

 const datum = Data.to(b, PoolDatum);

  export const findPubKeyHash = async (lucid:Lucid) => {
    const walletAddr = await lucid.wallet.address();
    const details = getAddressDetails(walletAddr);
    if (!details) throw new Error("Spending script details not found");
    const pkh = details.paymentCredential?.hash;
    if (!pkh) throw new Error("Spending script utxo not found");
    return pkh;
  };


  export const listNFT = async ({ lucid,address, name }: Options) => {
    const unit: Unit = b.aCurrency + b.aToken;
    const poolAddress: Address = lucid.utils.validatorToAddress(poolScript);
    const pkh = await findPubKeyHash(lucid);
    const tx = await lucid
            .newTx()
            .payToContract(poolAddress,
                {
                    inline:datum,
                },
                {[unit]:BigInt(1)}
                )
            .addSignerKey(pkh)
            .complete();
    const signedTx = await tx.sign().complete();
    const txHash = await signedTx.submit();
    return txHash;
    
  };