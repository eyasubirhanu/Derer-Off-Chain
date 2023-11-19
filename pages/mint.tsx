import * as utils from "lib/mint-Nfts1";
import * as pool from "lib/poolnfts";
// import { useAssets } from "hooks/use-assets"
import { useCallback, useMemo, useState, useEffect } from "react";
import { useCardano, utility } from "use-cardano";
import { FaGem } from 'react-icons/fa';

import { Inter } from "@next/font/google";
import { motion } from "framer-motion";

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
        className="mb-4 text-4xl  text-white font-extrabold tracking-tight leading-none md:text-5xl lg:text-6xl py-2"
      >
        Derer Nft MarketPlace
      </h1>
      <p className="text-xl text-yellow-100 font-bold">
        Mint your very own NFT right here without any hassle!!!
      </p>
      <div className="flex mt-15 ml-20 pb-10">
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-1/2 ml-5 rounded-lg mt-10"
          style={{
            backgroundImage: `url('/MintNft.jpg')`, // Set the background image URL
            backgroundSize: "cover", // Adjust this as needed
            backgroundPosition: "center", // Adjust this as needed
            width: "700px", // Set the width to match the image
            height: "550px", // Set the height to match the image
            boxShadow: "0 0 10px 5px rgba(0, 0, 0, 0.5)", // Add a black shadow
          }}
        ></motion.div>
        <div className="flex flex-row px-2.5 md:flex-row w-full gap-4 place-content-center justify-center ">
          <div className="w-[700px] max-w-[90%] h-[550px] mt-10 shadow-sm bg-slate-800 rounded-xl flex items-center flex-col p-8 ">
            <div className="flex gap-5 rounded-xl text-xl font-bold mb-6 text-white">
              MINT AN NFT <FaGem className="mt-1.5"/>
            </div>

            <div className="flex flex-wrap text-left my-8">
              <label className="w-full">
                <span className="text-md mb-2 text-white font-bold">
                  Name for your NFT <span className="text-red-600">*</span>
                </span>
              </label>
              <input
                className="w-full h-14 rounded py-1 px-2 text-gray-800 border mb-8"
                name="message"
                placeholder="Name your NFT"
                value={name || ""}
                onChange={(e) => setName(e.target.value?.toString())}
              />

              <label className="w-full">
                <span className="text-md mb-2 text-white font-bold">
                  Your image Location<span className="text-red-600">*</span>
                </span>
              </label>
              <input
                className="w-full h-14 rounded py-1 px-2 text-gray-800 border mb-8"
                name="image"
                placeholder="Enter NFT Image URL or Hash"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />

              <label className="w-full">
                <span className="text-md mb-2 text-white font-bold">
                  Description your NFT<span className="text-red-600">*</span>
                </span>
              </label>
              <textarea
                className="w-full h-18 rounded py-1 px-2 text-gray-800 border"
                name="description"
                placeholder="Enter NFT Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <button
              disabled={!canMint}
              className="flex gap-10 justify-center border hover:bg-blue-800 text-white w-64 p-5 cursor-pointer transition-colorsdisabled:text-gray-200 rounded bg-blue-300 disabled:bg-blue-600 dark:bg-white dark:text-gray-800 dark:disabled:bg-white dark:hover:bg-white font-bold uppercase mb-10"
              onClick={() => {
                hideToaster();
                mintNFT();
              }}
            >
              Mint <FaGem className="mt-1.5"/> 
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
