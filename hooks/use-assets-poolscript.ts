import { Lucid, fromUnit, Address } from "lucid-cardano";
import { sortBy } from "lodash";
import { useCallback, useEffect, useState } from "react";
import { assets } from "@blockfrost/blockfrost-js/lib/endpoints/api/assets";
import * as pool from "lib/poolnfts";

type Value = ReturnType<typeof fromUnit>;

interface ValueWithName extends Omit<Value, "name"> {
  [x: string]: any;
  value: number;
  name: string;
}

const listAssets = (lucid?: Lucid) => {
  const [assets, setAssets] = useState<ValueWithName[]>([]);
  const [lovelace, setLovelace] = useState(0);

  const fetchAssets = useCallback(async () => {
    if (!lucid?.wallet) return;

    // Utxo from user wallet
    const utxos = await lucid.wallet.getUtxos();

    // Utxo from address
    const poolAddress: Address = lucid.utils.validatorToAddress(
      pool.poolScript
    );
    const utx = await lucid.utxosAt(poolAddress);

    // output example of allUtxos
    // [
    // {
    //   policyId: "policy1",
    //   assetName: "asset1",
    //   name: "Asset One",
    //   label: null,
    //   value: 10,
    // },
    // ]
    const allUtxos = utx
      .map((u) =>
        Object.keys(u.assets).map((key) => ({ key, value: u.assets[key] }))
      )
      .reduce((acc, curr) => [...acc, ...curr], [])
      .map((a) => ({
        ...fromUnit(a.key),
        value: Number(a.value),
      }));

    // Calculate the total quantity of "lovelace" assets from a list of UTXOs.
    const lovelaces = allUtxos
      .filter((u) => u.policyId === "lovelace")
      .reduce((acc, curr) => acc + curr.value, 0);

    // Filter and transform UTXOs to select assets other than "lovelace" and add a fully qualified asset name.
    const utxoAssets = allUtxos
      .filter((u) => u.policyId !== "lovelace")
      .filter((v: Value): v is ValueWithName => v.name !== null)
      .map((a) => ({
        ...a,
        fullyQualifiedAssetName: `${a.policyId}${a.name}`,
      }));

    // Fetch asset metadata for each asset in utxoAssets
    const assetMetadataPromises = utxoAssets.map((a) =>
      fetch(
        `/api/blockfrost/${"Preprod"}/assets/${a.fullyQualifiedAssetName}`
      ).then((r) => r.json())
    );

    try {
      const assetsWithMetadata = await Promise.all(assetMetadataPromises);

      // Ensure that assetsWithMetadata is correctly structured as an array of objects
      // Sort assets with metadata based on quantity after that by, policy ID, name, metadata name, and onchain metadata name.
      const sortedAssets = sortBy(
        assetsWithMetadata,
        (a: { quantity: any }) => (Number(a.quantity) === 1 ? 1 : -1),
        "policy_id",
        "name",
        "metadata.name",
        "onchain_metadata.name"
      );

      setLovelace(lovelaces);

      // Update assets state with the correctly structured data
      setAssets(sortedAssets);
    } catch (error) {
      // Handle errors if any occur during API requests
      console.error("Error fetching asset metadata:", error);
    }
  }, [lucid?.wallet]);

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  return {
    lovelace,
    assets,
  };
};

export { listAssets };

// const Blockfrost = require("@blockfrost/blockfrost-js");
// // import { BlockFrostIPFS } from '@blockfrost/blockfrost-js'; // using import syntax

// const IPFS = new Blockfrost.BlockFrostIPFS({
//   projectId: "ipfsuwPRuQaISYnggAmqZV5i1zKH8otvB9ZR", // see: https://blockfrost.io
// });

// async function runExample() {
//   try {
//     const added = await IPFS.add(`${__dirname}/img.svg`);
//     console.log("added", added);

//     const pinned = await IPFS.pin(added.ipfs_hash);
//     console.log("pinned", pinned);
//   } catch (err) {
//     console.log("error", err);
//   }
// }

// runExample();
