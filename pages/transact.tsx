import { listAssets } from "hooks/use-assets-poolscript";
import { useCardano, utility } from "use-cardano";
import { Inter } from "@next/font/google";
import styles from "../styles/index.module.css";
import * as pool from "lib/poolnfts";
import { useCallback, useMemo, useState, useEffect } from "react";
import { Headers } from "../components/Header";

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
      <Headers></Headers>
      <div className="flex felx-wrap justify-between">
        <ul className="menu w-64 bg-base-200 rounded-box mt-32">
          <li className="mb-10 mt-10 font-bold text-2xl">
            <a>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 font-bold"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              ALL
            </a>
          </li>
          <li className="mb-10 font-bold text-2xl">
            <a>
              <img
                src="/trending-up-svgrepo-com.svg"
                alt="Trending"
                width={50}
              />
              Trending
            </a>
          </li>
          <li className="mb-10 font-bold text-2xl">
            <a>
              <img src="user-svgrepo-com.svg" alt="PFPs" width={50} />
              PFPs
            </a>
          </li>
          <li className="mb-10 font-bold text-2xl">
            <a>
              <img src="/music-svgrepo-com.svg" alt="Music svg" width={50} />
              Music
            </a>
          </li>
          <li className="mb-10 font-bold text-2xl">
            <a>
              <img
                src="/gaming-pad-alt-1-svgrepo-com.svg"
                alt="Gaming svg"
                width={50}
              />
              Gaming
            </a>
          </li>
          <li className="mb-10 font-bold text-2xl">
            <a>
              <img
                src="/join-membership-svgrepo-com.svg"
                alt="Membership svg"
              />
              Memberships
            </a>
          </li>
          <li className="mb-10 font-bold text-2xl">
            <a>
              <img src="/photography-svgrepo-com.svg" alt="Photography svg" />
              Photography
            </a>
          </li>
        </ul>
        <div>
          <ul className="menu menu-vertical lg:menu-horizontal bg-base-200 rounded-box justify-end mt-20">
            <li className="font-bold text-2xl mr-10">
              <a>1H</a>
            </li>
            <li className="font-bold text-2xl mr-10">
              <a>6H</a>
            </li>
            <li className="font-bold text-2xl mr-10">
              <a>12H</a>
            </li>
            <li className="font-bold text-2xl mr-10">
              <a>24H</a>
            </li>
            <li className="font-bold text-2xl mr-10">
              <a>7D</a>
            </li>
            <li className="font-bold text-2xl mr-10">
              <a>14D</a>
            </li>
            <li className="font-bold text-2xl mr-10">
              <a>1M</a>
            </li>
          </ul>
          <div className="grid bg-sky-800 rounded-md p-5 grid-cols-1 mt-20 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8">
            {assets.map((asset, index) => (
              <div key={index} className="card w-80 p-5 bg-base-100 shadow-xl">
                {asset?.onchain_metadata?.image && (
                  <img
                    src={asset.onchain_metadata.image}
                    alt={`${
                      asset.metadata?.name || asset.onchain_metadata?.name || ""
                    } NFT`}
                    className="rounded-lg mb-4 max-h-48"
                    style={{ maxWidth: "100%" }}
                  />
                )}
                <div className="card-body">
                  <h3 className="card-title">
                    {asset.metadata?.name || asset.onchain_metadata?.name || ""}
                  </h3>
                  <p className="text-left">
                    {asset.metadata?.description ||
                      asset.onchain_metadata?.description ||
                      ""}
                  </p>
                  <div className="flex mt-5 justify-between">
                    <div className="card-actions justify-start">
                      <p className="font-semibold text-start mt-10">
                        Price = $
                        {Number(
                          rate[
                            asset.metadata?.name ||
                              asset.onchain_metadata?.name ||
                              ""
                          ] || 0
                        )}
                      </p>
                    </div>
                    <div className="card-actions justify-end">
                      <button
                        className="btn btn-secondary"
                        onClick={() => buyNFT(asset)}
                      >
                        Buy
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
