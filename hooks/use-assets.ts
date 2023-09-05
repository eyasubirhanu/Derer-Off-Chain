import { Lucid, fromUnit } from "lucid-cardano";
import { sortBy } from "lodash";
import { useCallback, useEffect, useState } from "react";

type Value = ReturnType<typeof fromUnit>;

interface ValueWithName extends Omit<Value, "name"> {
  value: number;
  name: string;
}

const listAssets = (lucid?: Lucid) => {
  const [assets, setAssets] = useState<ValueWithName[]>([]);
  const [lovelace, setLovelace] = useState(0);

  const fetchAssets = useCallback(async () => {
    if (!lucid?.wallet) return;

    const utxos = await lucid.wallet.getUtxos();

    const allUtxos = utxos
      .map((u) =>
        Object.keys(u.assets).map((key) => ({ key, value: u.assets[key] }))
      )
      .reduce((acc, curr) => [...acc, ...curr], [])
      .map((a) => ({
        ...fromUnit(a.key),
        value: Number(a.value),
      }));

    const lovelaces = allUtxos
      .filter((u) => u.policyId === "lovelace")
      .reduce((acc, curr) => acc + curr.value, 0);

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
      const sortedAssets = sortBy(
        assetsWithMetadata,
        (a: { quantity: any }) => (Number(a.quantity) === 1 ? 1 : -1),
        "policy_id",
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
  }, [assets, lovelace]);

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
