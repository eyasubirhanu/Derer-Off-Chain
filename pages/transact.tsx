import { listAssets } from "hooks/use-assets-poolscript";
import { useCardano, utility } from "use-cardano";
import { Inter } from "@next/font/google";
import styles from "../styles/index.module.css";
import * as pool from "lib/poolnfts";
import { useCallback, useMemo, useState, useEffect } from "react";

const inter = Inter({ subsets: ["latin"] });

const Index = () => {
  const { lucid, showToaster } = useCardano();
  const { assets } = listAssets(lucid);
  const [rate, setRate] = useState(0n); // Initialize rate as 0n (bigint)
  const [isTransactionPending, setTransactionPending] = useState(false); // Flag to prevent multiple transactions

  const fetchRate = async (asset: any) => {
    try {
      if (!lucid || !asset) return;

      // Fetch the rate
      const {
        metadata,
        asset: { policyId },
      } = asset;

      const assetName = metadata?.name || asset.onchain_metadata?.name || "";
      console.log(asset, "asset");

      const policyIdd = asset.policy_id;
      const tokenname = asset.asset_name;
      console.log(policyIdd, "policyid");
      console.log(tokenname, "tokenname");

      const rateValue = await pool.getDatumValue(lucid, policyIdd, tokenname);
      setRate(rateValue);
    } catch (e) {
      if (utility.isError(e)) showToaster("Could not fetch rate", e.message);
      else if (typeof e === "string") showToaster("Could not fetch rate", e);
    }
  };

  const buyNFT = async (asset: any) => {
    try {
      if (!lucid || !asset || isTransactionPending) return;

      // Set the flag to prevent multiple transactions
      setTransactionPending(true);

      // Fetch the rate
      await fetchRate(asset);

      // Buy the NFT
      const {
        metadata,
        asset: { policyId },
      } = asset;

      const assetName = metadata?.name || asset.onchain_metadata?.name || "";
      console.log(asset, "asset");

      const policyIdd = asset.policy_id;
      const tokenname = asset.asset_name;
      console.log(policyIdd, "policyid");
      console.log(tokenname, "tokenname");

      const buyTx = await pool.buyNFT({
        lucid,
        address: "", // Replace with a valid address
        name: tokenname,
        policyid: policyIdd,
        price: 0n,
      });

      showToaster("Buy NFT", `Transaction: ${buyTx}`);

      // Reset the flag after the transaction is complete
      setTransactionPending(false);
    } catch (e) {
      // Handle errors and reset the flag on error as well
      setTransactionPending(false);

      if (utility.isError(e)) showToaster("Could not buy NFT", e.message);
      else if (typeof e === "string") showToaster("Could not buy NFT", e);
    }
  };

  useEffect(() => {
    // Fetch the rate for the first asset when the component mounts
    if (assets.length > 0) {
      fetchRate(assets[0]);
    }
  }, [assets, lucid, showToaster]);

  return (
    <div
      className="text-center m-auto text-gray-900 dark:text-gray-100"
      style={{
        background: "linear-gradient(to bottom, #111A28, #05102D)",
        minHeight: "100vh",
        padding: "2rem",
      }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {assets.map((asset, index) => (
          <div
            key={index}
            className="nft-card bg-white shadow-lg p-5 rounded-lg"
          >
            {asset?.metadata?.image && (
              <img
                src={`https://ipfs.blockfrost.dev/ipfs/${asset.metadata.image}`}
                alt={`${
                  asset.metadata?.name || asset.onchain_metadata?.name || ""
                } NFT`}
                className="rounded-lg mb-4"
              />
            )}
            <h3 className="text-xl font-bold mb-2">
              {asset.metadata?.name || asset.onchain_metadata?.name || ""}
            </h3>
            <p className="text-gray-600">{asset.metadata?.description || ""}</p>
            <div className="flex justify-between items-center mt-6">
              <span className="text-gray-500">Price = ${Number(rate)}</span>
              <button
                className={`${styles.btn} ${styles.btnPrimary}`}
                onClick={() => buyNFT(asset)}
              >
                <span className={styles.btnIcon}>🛍️</span> Buy
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Index;
