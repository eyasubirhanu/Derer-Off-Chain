import { listAssets } from "hooks/use-assets-poolscript";
import { useCardano, utility } from "use-cardano";
import { Inter } from "@next/font/google";
import styles from "../styles/index.module.css";
import * as pool from "lib/poolnfts";
import { useCallback, useMemo, useState, useEffect } from "react";

const inter = Inter({ subsets: ["latin"] });

type RateState = {
  [assetName: string]: number;
};

const Index = () => {
  const { lucid, showToaster } = useCardano();
  const { assets } = listAssets(lucid);
  const [rate, setRate] = useState<RateState>({}); // Initialize rate as an object
  const [isTransactionPending, setTransactionPending] = useState(false); // Flag to prevent multiple transactions

  const fetchRate = async (asset: any) => {
    try {
      if (!lucid || !asset) return;

      const {
        metadata,
        asset: { policyId },
      } = asset;
      const assetName = metadata?.name || asset.onchain_metadata?.name || "";

      const policyIdd = asset.policy_id;
      const tokenname = asset.asset_name;

      const rateValue = await pool.getDatumValue(lucid, policyIdd, tokenname);

      // Update the rate for the specific asset
      setRate((prevRates) => ({
        ...prevRates,
        [assetName]: rateValue,
      }));
    } catch (e) {
      // Handle errors here
    }
  };

  const buyNFT = async (asset: any) => {
    try {
      if (!lucid || !asset || isTransactionPending) return;

      // Set the flag to prevent multiple transactions
      setTransactionPending(true);

      const {
        metadata,
        asset: { policyId },
      } = asset;
      const assetName = metadata?.name || asset.onchain_metadata?.name || "";

      const policyIdd = asset.policy_id;
      const tokenname = asset.asset_name;

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
    // Fetch the rate for all assets when the component mounts
    assets.forEach((asset) => fetchRate(asset));
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
            {asset?.onchain_metadata?.image && (
              <img
                src={asset.onchain_metadata.image}
                alt={`${
                  asset.metadata?.name || asset.onchain_metadata?.name || ""
                } NFT`}
                className="rounded-lg mb-4"
                style={{ maxWidth: "100%" }}
              />
            )}
            <h3 className="text-xl font-bold mb-2">
              {asset.metadata?.name || asset.onchain_metadata?.name || ""}
            </h3>
            <p className="text-gray-600">
              {asset.metadata?.description ||
                asset.onchain_metadata?.description ||
                ""}
            </p>
            <p className="text-gray-600">{asset.metadata?.description || ""}</p>
            <div className="flex justify-between items-center mt-6">
              <span className="text-gray-500">
                Price = $
                {Number(
                  rate[
                    asset.metadata?.name || asset.onchain_metadata?.name || ""
                  ] || 0
                )}
              </span>

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
