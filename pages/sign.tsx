import React, { useState, useEffect } from "react";
import { useCardano, utility } from "use-cardano";
import { Inter } from "@next/font/google";
import styles from "../styles/index.module.css";
import * as pool from "lib/poolnfts"; // Import the poolnfts library
import { listAssets } from "hooks/use-assets-users";
import { lovelaceToAda } from "lib/lovelace-to-ada";

const inter = Inter({ subsets: ["latin"] });

// Define the type for the NFT object
type NFT = {
  imageSrc: string;
  name: string;
  description: string;
  price: number;
};

const Index = () => {
  const { lucid, account, showToaster } = useCardano();
  const { lovelace, assets } = listAssets(lucid);

  const [priceInputs, setPriceInputs] = useState(Array(assets.length).fill(""));
  const [listedNFTs, setListedNFTs] = useState<NFT[]>([]);
  const [isTransactionPending, setTransactionPending] = useState(false);

  const listNFT = async (asset: any, index: any) => {
    try {
      if (!lucid || !asset || !account?.address || isTransactionPending) return;

      // Set the flag to prevent multiple transactions
      setTransactionPending(true);

      const {
        metadata,
        asset: { policyId },
      } = asset;

      const assetName = metadata?.name || asset.onchain_metadata?.name || "";
      const policyIdd = asset.policy_id;
      const tokenname = asset.asset_name;
      const listTx = await pool.listNFT({
        lucid,
        address: account.address, // Replace with a valid address
        name: tokenname, // Use the asset name directly
        policyid: policyIdd, // Use the asset policy ID directly
        price: priceInputs[index],
      });

      showToaster("Buy NFT", `Transaction: ${listTx}`);

      // Reset the flag after the transaction is complete
      setTransactionPending(false);
    } catch (e) {
      // Handle errors and reset the flag on error as well
      setTransactionPending(false);

      if (utility.isError(e)) showToaster("Could not buy NFT", e.message);
      else if (typeof e === "string") showToaster("Could not buy NFT", e);
    }
    // setListedNFTs(newListedNFTs);
  };

  useEffect(() => {
    // Fetch the rate for the first asset when the component mounts
    if (assets.length > 0) {
      // You can choose to fetch the rate here if needed
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
      <div
        className="max-w-6xl mx-auto"
        style={{
          background: "rgba(255, 255, 255, 0.05)",
          padding: "2rem",
          borderRadius: "0.5rem",
          marginBottom: "2rem",
        }}
      >
        <h1
          style={inter.style}
          className="mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl lg:text-6xl text-white"
        >
          List Your Nfts To The Marketplace.
        </h1>

        <div className="my-4 text-center text-lg text-white">
          Listing Your Assets
        </div>

        {lovelace > 0 && (
          <div className="text-2xl font-semibold my-4 text-white">
            Total ADA: {lovelaceToAda(lovelace)}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {assets.map((a, index) => {
            const name = a.metadata?.name || a.onchain_metadata?.name || "";
            const tokenName = a.name;
            const description = a.metadata?.description || "";
            const imageSrc =
              a.onchain_metadata?.image?.replace(
                "ipfs://",
                "https://ipfs.blockfrost.dev/ipfs/"
              ) || "";

            return (
              <div
                key={a.asset}
                className="nft-card bg-white shadow-lg p-5 rounded-lg"
                style={{
                  background: "white",
                }}
              >
                {imageSrc && (
                  <img
                    src={imageSrc}
                    alt={`${name} NFT`}
                    className="rounded-lg mb-4"
                  />
                )}
                <h3 className="text-xl font-bold mb-2">{name}</h3>
                <h3 className="text-xl font-bold mb-2">{tokenName}</h3>
                <p className="text-gray-600">{description}</p>
                <div className="flex justify-between items-center mt-6">
                  <input
                    type="number"
                    placeholder="Price"
                    value={priceInputs[index]}
                    onChange={(e) => {
                      const newPriceInputs = [...priceInputs];
                      newPriceInputs[index] = e.target.value;
                      setPriceInputs(newPriceInputs);
                    }}
                    className="border rounded-lg px-2 py-1 w-20 focus:outline-none focus:border-blue-400"
                  />
                  <button
                    onClick={() => listNFT(a, index)}
                    className={`${styles.btn} ${styles.btnPrimary}`}
                  >
                    <span className={styles.btnIcon}>📝</span> List
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-between mt-4">
          {listedNFTs.map((nft, index) => {
            // Check if nft has the required properties
            if (
              "imageSrc" in nft &&
              "name" in nft &&
              "description" in nft &&
              "price" in nft
            ) {
              return (
                <div
                  key={index}
                  className="nft-card bg-white shadow-lg p-5 rounded-lg"
                  style={{
                    background: "white",
                  }}
                >
                  <img
                    src={nft.imageSrc}
                    alt={`${nft.name} NFT`}
                    className="rounded-lg mb-4"
                  />
                  <h3 className="text-xl font-bold mb-2">{nft.name}</h3>
                  <p className="text-gray-600">{nft.description}</p>
                  <p className="text-gray-500">Listed Price: ${nft.price}</p>
                </div>
              );
            }
            return null; // Handle cases where nft doesn't have the required properties
          })}
        </div>
      </div>
    </div>
  );
};
export default Index;
