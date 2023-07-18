import { Lucid,MintingPolicy, getAddressDetails,PolicyId, Unit,UTxO,fromHex, Redeemer,fromText,Data,applyParamsToScript,Address, Constr} from "lucid-cardano"
import scripts from "../assets/scripts.json";

interface Options {
 lucid: Lucid
 address: string
 name: string
}

const {Pool,NFT } = scripts;

const getUnit = (policyId: PolicyId, name: string): Unit => policyId + fromText(name)

const getUtxo = async (lucid:Lucid,address: string)=> {
    const utxos = await lucid!.utxosAt(address);
    const utxo = utxos[0];
    return utxo;
}; 

const findUtxo = async (lucid:Lucid,addr: Address , nftId: PolicyId, name: string) => {
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

    return { nftPolicy, unit };
};

// [nftPolicyIdHex, nftTokenNameHex, pkh]
export const mintNFT = async ({ lucid,address, name }: Options) => {
    // const wAddr = await lucid.wallet.address();
    console.log("minting NFT for " + address);
    const utxo = await getUtxo(lucid,address);
    const { nftPolicy, unit } = await getFinalPolicy(lucid,utxo,name);
    const tx = await lucid
            .newTx()
            .mintAssets({[unit]: 1n})
            .attachMintingPolicy(nftPolicy)
            .collectFrom([utxo])
            .complete();
    const signedTx = await tx.sign().complete();
    const txHash = await signedTx.submit();
    return txHash;
    
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

