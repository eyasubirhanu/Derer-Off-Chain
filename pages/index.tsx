import React from "react";
import { CommandLineIcon } from "components/icons/CommandLineIcon";
import { Inter } from "@next/font/google";

const inter = Inter({ subsets: ["latin"] });

const Home = () => {
  return (
    <div className="text-center max-w-4xl m-auto text-gray-900 dark:text-gray-100">
      <h1
        style={inter.style}
        className="mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl lg:text-6xl"
      >
        Derer NFT Marketplace
      </h1>
      <p
        style={inter.style}
        className="mb-6 text-lg font-normal text-gray-600 lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400"
      >
        Website That Offers Convenient Payment Options For Ethiopian Customers.
      </p>

      <div style={inter.style} className="my-4 text-left ">
        The NFT market in Ethiopia is still extremely small due to challenges
        such as limited access to cryptocurrencies, and a lack of awareness
        about NFTs and blockchain in general. DERER NFT Marketplace aims to
        address these challenges and drive mainstream adoption of NFTs in
        Ethiopia. These challenge of limited technological infrastructure and
        access, can be overcome by developing a mobile-friendly platform and
        providing alternative forms of payment options accessible to the
        Ethiopian market. By addressing these limitations, DERER can build a
        pioneering platform for Ethiopias NFT community and tap into new
        markets. Derer NFT Marketplace uses{" "}
        <a
          className="underline underline-offset-2"
          href="https://www.endubis.io/"
          rel="noreferrer"
          target="_blank"
        >
          Endubis-Wallet.
        </a>{" "}
      </div>

      {/* NFT Cards */}
      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="nft-card bg-white shadow-lg p-5 rounded-lg"
          >
            <img
              src={`https://source.unsplash.com/featured/400x300/?nft${index}`}
              alt="NFT Image"
              className="rounded-lg mb-4"
            />
            <h3 className="text-xl font-bold mb-2">NFT Title</h3>
            <p className="text-gray-600">NFT Description</p>
            <div className="flex justify-between items-center mt-6">
              <span className="text-gray-500">$500</span>
              <button className="btn btn-primary">Buy</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
