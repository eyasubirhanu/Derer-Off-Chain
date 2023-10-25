/* eslint-disable react/no-unescaped-entities */
import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CommandLineIcon } from "components/icons/CommandLineIcon";
import { Inter } from "@next/font/google";
import { FiArrowRight } from "react-icons/fi";

const inter = Inter({ subsets: ["latin"] });
// Define the type for the props
type NFTCardProps = {
  title: string;
  description: string;
  price: string;
};
const NFTCard: React.FC<NFTCardProps> = ({ title, description, price }) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="nft-card flex gap-2 bg-white shadow-lg p-5 rounded-lg"
    >
      <img
        src={`https://source.unsplash.com/featured/400x300/?nft`}
        alt="NFT Image"
        className="w-1/2 h-80 rounded-lg mb-4"
      />
      <div className="w-1/2">
      <h3 className="text-xl font-bold mb-2 text-black">{title}</h3>
      <p className="text-gray-600">{description}</p>
      <div className="flex ml-52 items-center mt-48 gap-10">
        <span className="text-gray-500 font-bold text-center bg-slate-300 rounded-md p-6">{price}</span>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-black p-5 rounded-md font-bold text-center text-xl text-white "
        >
          Buy
        </motion.button>
      </div>
      </div>
    </motion.div>
  );
  
const Home = () => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const nftData = [
    { title: "NFT Title 1", description: "NFT Description 1", price: "$500" },
    { title: "NFT Title 2", description: "NFT Description 2", price: "$600" },
    { title: "NFT Title 3", description: "NFT Description 3", price: "$700" },
    { title: "NFT Title 4", description: "NFT Description 4", price: "$800" },
  ];

  const nextCardIndex = (currentCardIndex + 1) % nftData.length;

  const handleNextCard = () => {
    setCurrentCardIndex(nextCardIndex);
  };
  return (
    <motion.div
      initial={{ opacity: 0, x: -100 }} // Animate from left to right
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="flex flex-wrap w-full text-center mt-20 ml-10 text-white dark:text-gray-100"
    >
  <motion.div
  initial={{ opacity: 0, x: -100 }}
  animate={{ opacity: 1, x: 0 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 0.8, delay: 0.2 }}
  className="w-1/2 ml-5 rounded-lg -mt-10"
  style={{
    backgroundImage: `url('/dererlogo.png')`, // Set the background image URL
    backgroundSize: 'cover', // Adjust this as needed
    backgroundPosition: 'center', // Adjust this as needed
    width: '550px', // Set the width to match the image
    height: '500px', // Set the height to match the image
    boxShadow: '0 0 10px 5px rgba(0, 0, 0, 0.5)', // Add a black shadow
  }}
>
  {/* You can remove the <img> element */}
</motion.div>


    <motion.div
        className="w-1/2 block ml-10">
      <motion.h1
        style={inter.style}
        initial={{ opacity: 0, x: -100 }} // Animate from left to right
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl lg:text-6xl"
      >
        Derer NFT Marketplace
      </motion.h1>
      <motion.p
        style={inter.style}
        initial={{ opacity: 0, x: 100 }} // Animate from right to left
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="mb-6 text-lg w-full font-normal text-gray-100 lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400"
      >
        Website That Offers Convenient Payment Options For Ethiopian Customers.
      </motion.p>

      <div style={inter.style} className="my-8 text-left">
        The NFT market in Ethiopia is still extremely small due to challenges
        such as limited access to cryptocurrencies and a lack of awareness about
        NFTs and blockchain in general. DERER NFT Marketplace aims to address
        these challenges and drive mainstream adoption of NFTs in Ethiopia.
        These challenges of limited technological infrastructure and access can
        be overcome by developing a mobile-friendly platform and providing
        alternative forms of payment options accessible to the Ethiopian market.
        By addressing these limitations, DERER can build a pioneering platform
        for Ethiopia's NFT community and tap into new markets. Derer NFT
        Marketplace uses{" "}
        <a
          className="underline underline-offset-2"
          href="https://www.endubis.io/"
          rel="noreferrer"
          target="_blank"
        >
          Endubis-Wallet.
        </a>
      </div>
      </motion.div>
      <motion.h2
      style={inter.style}
      initial={{ opacity: 0, x: -100 }} // Animate from right to left
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="text-black relative mt-28 ml-72 font-bold text-4xl text-center 
      ">
        Popular NFTS
      </motion.h2>
      <div className="container mr-20 mb-20 mt-10 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1">
        <AnimatePresence initial={false} mode="wait">
          <NFTCard
            key={currentCardIndex}
            title={nftData[currentCardIndex].title}
            description={nftData[currentCardIndex].description}
            price={nftData[currentCardIndex].price}
          />
        </AnimatePresence>
      </div>
      <div className="text-center ml-96">
        <button
          onClick={handleNextCard}
          className="font-bold text-center bg-black rounded-md p-4 text-white mb-5 justify-center -mt-36 ml-52"
        >
          Next Card
        </button>
        <FiArrowRight className="font-4xl"/>
      </div>
    </motion.div>
    
  );
};

export default Home;
