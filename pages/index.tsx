/* eslint-disable react/no-unescaped-entities */
import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CommandLineIcon } from "components/icons/CommandLineIcon";
import { Inter } from "@next/font/google";
import { FiArrowRight } from "react-icons/fi";
import { Headers } from "../components/Header";

const inter = Inter({ subsets: ["latin"] });
// Define the type for the props
type NFTCardProps = {
  slide: number;
  title: string;
  description: string;
  price: string;
};

const NFTCard: React.FC<NFTCardProps> = ({ slide, title, description, price }) => (
  <>
    <img
      src={`https://source.unsplash.com/featured/400x300/?nft`}
      alt="NFT Image"
      className="w-96 h-80 rounded-lg mt-8 ml-8"
    />
    <div className="w-1/2 flex flex-wrap -ml-36">
      <h3 className="text-xl w-full ml-72 mt-8 font-bold mb-2 text-black">{title}</h3>
      <p className="w-full text-gray-600 ml-56 -mt-10">{description}</p>
      <div className="flex w-full ml-52 items-center gap-4">
        <button className="text-amber-400 font-bold bg-lime-700 p-6 rounded-md text-center text-xl hover:bg-amber-700 duration-500">
          Transfer
        </button>
        <span className="font-bold text-black text-center bg-slate-300 rounded-md p-6 w-44 hover:w-56 duration-500">
          {price}
        </span>
        <button className="bg-black p-5 rounded-md font-bold text-center text-xl text-white w-56 hover:w-64 duration-500">
          Buy
        </button>
      </div>
    </div>
  </>
);

const Home = () => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const nftData = [
    { title: "Digital Dreams", description: "An abstract digital artwork exploring the beauty of dreams and imagination.", price: "500 ADA" },
    { title: "Crypto Cosmos", description: "A space-themed NFT capturing the essence of the cryptocurrency universe.", price: "600 ADA" },
    { title: "Pixel Paradise", description: "A pixel art NFT depicting a serene paradise with vibrant colors and retro aesthetics.", price: "700 ADA" },
    { title: "Tech Tesseract", description: "Futuristic NFT showcasing the convergence of technology and art in a mesmerizing tesseract.", price: "800 ADA" },
    { title: "Nature's Symphony", description: "A harmonious blend of natural elements in a mesmerizing symphony of colors and forms.", price: "900 ADA" },
    { title: "Abstract Elevation", description: "Elevate your digital space with this abstract NFT, exploring the concept of elevation.", price: "1000 ADA" },
    { title: "Neon Nova", description: "Vibrant and futuristic NFT featuring a neon-lit cityscape with a cosmic twist.", price: "1100 ADA" },
    { title: "Timeless Treasures", description: "Discover timeless treasures in this NFT, where art meets the echoes of history.", price: "1000 ADA" },
];


  const nextCardIndex = (currentCardIndex + 1) % nftData.length;
  // const previousCardIndex = currentCardIndex == 1 ? 8 : (currentCardIndex - 1);

  const handleNextCard = () => {
    console.log(currentCardIndex);
    currentCardIndex == 7
      ? setCurrentCardIndex(0)
      : setCurrentCardIndex(nextCardIndex);
  };
  const handlePreviousCard = () => {
    console.log(currentCardIndex);
    currentCardIndex == 0
      ? setCurrentCardIndex(7)
      : setCurrentCardIndex(currentCardIndex - 1);
  };
  return (
    <>
      <Headers></Headers>
      <motion.div
        initial={{ opacity: 0, x: -100 }} // Animate from left to right
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
        className="flex flex-wrap w-full text-center mt-28 text-white dark:text-gray-100"
      >
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-1/2 ml-5 rounded-lg -mt-10"
          style={{
            backgroundImage: `url('/dererlogo.png')`, // Set the background image URL
            backgroundSize: "cover", // Adjust this as needed
            backgroundPosition: "center", // Adjust this as needed
            width: "550px", // Set the width to match the image
            height: "500px", // Set the height to match the image
            boxShadow: "0 0 10px 5px rgba(0, 0, 0, 0.5)", // Add a black shadow
          }}
        ></motion.div>

        <motion.div className="w-1/2 block ml-20">
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
            Website That Offers Convenient Payment Options For Ethiopian
            Customers.
          </motion.p>

          <div style={inter.style} className="my-8 text-left">
            The NFT market in Ethiopia is still extremely small due to
            challenges such as limited access to cryptocurrencies and a lack of
            awareness about NFTs and blockchain in general. DERER NFT
            Marketplace aims to address these challenges and drive mainstream
            adoption of NFTs in Ethiopia. These challenges of limited
            technological infrastructure and access can be overcome by
            developing a mobile-friendly platform and providing alternative
            forms of payment options accessible to the Ethiopian market. By
            addressing these limitations, DERER can build a pioneering platform
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
      </motion.div>
      <motion.div>
        <motion.h2
          style={inter.style}
          initial={{ opacity: 0, x: -100 }} // Animate from right to left
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-28 text-yellow-400 font-bold text-4xl text-center mb-10 
      "
        >
          Popular NFTS
        </motion.h2>
        <div className="w-full">
          <div className="flex justify-center gap-8">
            <a href={`#slide${currentCardIndex}`} className="btn btn-square h-56 mt-20" onClick={handlePreviousCard}>
              ❮
            </a>
            <div
              className="carousel w-3/4 rounded h-96 mb-10"
            >
              {nftData.map((data, index) => (
                <div id={`slide${index}`} className="carousel-item relative w-full bg-slate-400">
                  <NFTCard
                    slide={index}
                    title={data.title}
                    description={data.description}
                    price={data.price}
                  />
                </div>
              ))}
            </div>
            <a href={`#slide${currentCardIndex}`} className="btn btn-square h-56 mt-20" onClick={handleNextCard}>
              ❯
            </a>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Home;
