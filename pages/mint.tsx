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

  useEffect(() => {
    const init = () => {
      if (!lucid) return;
    };
    init();
  }, [lucid, name]);

  const mintNFT = useCallback(async () => {
    try {
      if (!lucid || !account?.address || !name) return;

      const nftTx = await utils.mintNFT({
        lucid,
        address: account.address,
        name,
      });
      showToaster("Minted NFT", `Transaction: ${nftTx.txHash}`);
    } catch (e) {
      if (utility.isError(e)) showToaster("Could not mint NFT", e.message);
      else if (typeof e === "string") showToaster("Could not mint NFT", e);
    }
  }, [lucid, account?.address, showToaster, name]);

  const burnNFT = useCallback(async () => {
    try {
      if (!lucid || !account?.address || !name) return;

      const nftTx = await pool.listNFT({
        lucid,
        address: account?.address,
        policyid: "",
        name,
        price: 4n,
      });

      showToaster("Burned NFT", `Transaction: ${nftTx}`);
    } catch (e) {
      if (utility.isError(e)) showToaster("Could not burn NFT", e.message);
      else if (typeof e === "string") showToaster("Could not burn NFT", e);
    }
  }, [lucid, account?.address, showToaster, burnname]);

  const canMint = useMemo(
    () => lucid && account?.address && name,
    [lucid, account?.address, name]
  );

  const canBurn = useMemo(
    () => lucid && account?.address && name,
    [lucid, account?.address, burnname]
  );

  return (
    <div className="text-center text-gray-900 dark:text-gray-100 ">
      <div className="absolute right-40 rounded-xl bg-sky-800 py-2  hover:opacity-80 duration-200 disabled:opacity-30 w-40 text-white">
        Total reserve of Ada ≈{Number(display)} ₳
      </div>
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
                <span className="text-sm lowercase mb-1 font-bold">
                  NFT Name
                </span>

                <input
                  className="rounded py-1 px-2 text-gray-800 border"
                  name="message"
                  placeholder="My NFT name"
                  value={name || ""}
                  onChange={(e) => setName(e.target.value?.toString())}
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

        <div className="w-[500px] max-w-[90%] h-[550px] mt-10 shadow-sm bg-slate-800 rounded-xl flex items-center flex-col p-6">
          <div className="rounded-xl text-xl font-bold mb-6 text-white">
            Burn Nft
          </div>
          <div className="text-left my-8">
            <div className="my-4">
              <label className="flex flex-col w-100">
                <span className="text-sm lowercase mb-1">NFT name</span>

                <input
                  className="rounded py-1 px-2 text-gray-800 border"
                  name="message"
                  placeholder="My NFT name"
                  value={burnname || ""}
                  onChange={(e) => setBurnName(e.target.value?.toString())}
                />
              </label>
            </div>
          </div>
          <button
            disabled={!canBurn}
            className="border hover:bg-blue-400 text-white my-4 w-64 py-2 cursor-pointer transition-colors disabled:cursor-not-allowed disabled:text-gray-200 rounded bg-red-300 disabled:bg-red-600 dark:bg-white dark:text-gray-800 dark:disabled:bg-white dark:hover:bg-white font-bold uppercase"
            onClick={() => {
              hideToaster();
              burnNFT();
            }}
          >
            burn
          </button>
        </div>
      </div>
    </div>
  );
}
