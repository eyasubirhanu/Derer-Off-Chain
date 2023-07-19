import { CommandLineIcon } from "components/icons/CommandLineIcon"

import { Inter } from "@next/font/google"

const inter = Inter({ subsets: ["latin"] })

export default function Home() {
  return (
    <div className="text-center max-w-4xl m-auto text-gray-900 dark:text-gray-100">
      <h1
        style={inter.style}
        className="mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl lg:text-6xl"
      >
        Derer Nft MarketPlace
      </h1>
      <p
        style={inter.style}
        className="mb-6 text-lg font-normal text-gray-600 lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400"
      >
        Website That Offers Convenient Payment Options For Ethiopian Customers.
      </p>

      <div style={inter.style} className="my-4 text-left ">

        The NFT market in Ethiopia is still extremely small due to challenges such as limited access to
        cryptocurrencies, and a lack of awareness about NFTs and blockchain in general. DERER NFT
         Marketplace aims to address these challenges and drive mainstream adoption of NFTs in
         Ethiopia. These challenge of limited technological infrastructure and access, can be overcome by
            developing a mobile-friendly platform and providing alternative forms of payment options
          accessible to the Ethiopian market. By addressing these limitations, DERER can build a pioneering
            platform for Ethiopia's NFT community and tap into new markets.

            Derer Nft MarketPlace uses{" "}
        <a
          className="underline underline-offset-2"
          href="https://www.endubis.io/"
          rel="noreferrer"
          target="_blank"
        >
          Endubis-Wallet.
        </a>{" "}
      </div>
    </div>
  )
}
