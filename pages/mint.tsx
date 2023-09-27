import * as utils from "lib/mint-Nfts1";
import * as pool from "lib/poolnfts";
// import { useAssets } from "hooks/use-assets"
import { useCallback, useMemo, useState, useEffect } from "react";
import { useCardano, utility } from "use-cardano";

import { Inter } from "@next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Mint() {
  const { lucid, account, showToaster, hideToaster } = useCardano();

  const [name, setName] = useState("");
  const [burnname, setBurnName] = useState("");
  const [display, setDisplay] = useState(0n);
  const [imageUrl, setImageUrl] = useState(""); // State for image URL
  const [description, setDescription] = useState(""); // State for description

  useEffect(() => {
    const init = () => {
      if (!lucid) return;
    };
    init();
  }, [lucid, name]);

  const mintNFT = useCallback(async () => {
    try {
      if (!lucid || !account?.address || !name) return;

      const nftTx = await utils.mintNFT(
        { lucid, address: account.address, name },
        imageUrl,
        description
      );
      showToaster("Minted NFT", `Transaction: ${nftTx.txHash}`);
    } catch (e) {
      if (utility.isError(e)) showToaster("Could not mint NFT", e.message);
      else if (typeof e === "string") showToaster("Could not mint NFT", e);
    }
  }, [lucid, account?.address, showToaster, name, imageUrl, description]); // Include imageUrl and description as dependencies

  const canMint = useMemo(
    () => lucid && account?.address && name,
    [lucid, account?.address, name]
  );

  return (
    <div className="text-center text-gray-900 dark:text-gray-100 ">
      <h1
        style={inter.style}
        className="mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl lg:text-6xl py-2"
      >
        Derer Nft MarketPlace
      </h1>

      <div className="flex flex-row px-2.5 md:flex-row  justify-center w-full justify-around gap-4 place-content-center justify-center ">
        <div className="w-[500px] max-w-[90%] h-[550px] mt-10 shadow-sm bg-slate-800 rounded-xl flex items-center flex-col p-8 ">
          <div className="rounded-xl text-xl font-bold mb-6 text-white">
            Mint Nft
          </div>

          <div className="text-left my-8">
            <div className="my-4">
              <label className="flex flex-col w-100">
                <span className="text-sm mb-1 text-white">NFT Name</span>

                <input
                  className="rounded py-1 px-2 text-gray-800 border"
                  name="message"
                  placeholder="My NFT name"
                  value={name || ""}
                  onChange={(e) => setName(e.target.value?.toString())}
                />
              </label>
            </div>

            <div className="my-4">
              <label className="flex flex-col w-100">
                <span className="text-sm mb-1 text-white">Image URL</span>

                <input
                  className="rounded py-1 px-2 text-gray-800 border"
                  name="image"
                  placeholder="Enter NFT Image URL or Hash"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
              </label>
            </div>

            <div className="my-4">
              <label className="flex flex-col w-100">
                <span className="text-sm mb-1 text-white">Description</span>

                <textarea
                  className="rounded py-1 px-2 text-gray-800 border"
                  name="description"
                  placeholder="Enter NFT Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </label>
            </div>
          </div>
          <button
            disabled={!canMint}
            className="border hover:bg-blue-800 text-white my-4 w-64 py-2 cursor-pointer transition-colors disabled:cursor-not-allowed disabled:text-gray-200 rounded bg-blue-300 disabled:bg-blue-600 dark:bg-white dark:text-gray-800 dark:disabled:bg-white dark:hover:bg-white font-bold uppercase"
            onClick={() => {
              hideToaster();
              mintNFT();
            }}
          >
            mint
          </button>
        </div>
      </div>
    </div>
  );
}
