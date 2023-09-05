import { listAssets } from "hooks/use-assets";
import { useCardano } from "use-cardano";
// import { isNil } from "lodash";
import { Inter } from "@next/font/google";
import styles from "../styles/index.module.css";
import { lovelaceToAda } from "lib/lovelace-to-ada";

const inter = Inter({ subsets: ["latin"] });

const Index = () => {
  const { lucid } = useCardano();
  const { lovelace, assets } = listAssets(lucid);

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
          Welcome to the NFT Marketplace
        </h1>

        <div className="my-4 text-center text-lg text-white">
          Explore a collection of unique digital assets
        </div>

        {lovelace > 0 && (
          <div className="text-2xl font-semibold my-4 text-white">
            Total ADA: {lovelaceToAda(lovelace)}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {assets.map((a) => {
            const name = a.metadata?.name || a.onchain_metadata?.name || "";
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
              >
                {imageSrc && (
                  <img
                    src={imageSrc}
                    alt={`${name} NFT`}
                    className="rounded-lg mb-4"
                  />
                )}
                <h3 className="text-xl font-bold mb-2">{name}</h3>
                <p className="text-gray-600">{description}</p>
                <div className="flex justify-between items-center mt-6">
                  <span className="text-gray-500">$Price</span>
                  <button className={`${styles.btn} ${styles.btnPrimary}`}>
                    <span className={styles.btnIcon}>🛍️</span> Buy
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-between">
        {/* Small NFT box 1 */}
        <div className="nft-card bg-white shadow-lg p-5 rounded-lg">
          {/* NFT content */}
        </div>

        {/* Small NFT box 2 */}
        <div className="nft-card bg-white shadow-lg p-5 rounded-lg">
          {/* NFT content */}
        </div>

        {/* Add more small NFT boxes as needed */}
      </div>
    </div>
  );
};

export default Index;
