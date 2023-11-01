import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { twMerge } from "tailwind-merge";
import { CardanoWalletSelector } from "use-cardano";
import { FiHome, FiShoppingBag, FiList, FiPlus } from "react-icons/fi"; // Import relevant icons from react-icons
import { FaWallet } from "react-icons/fa";
import Image from "next/image";

const links = [
  { path: "/", text: "Home", icon: <FiHome /> },
  { path: "/transact", text: "Market-Place", icon: <FiShoppingBag /> },
  { path: "/sign", text: "List-YOUR-NFT-TO-MP", icon: <FiList /> },
  { path: "/mint", text: "Mint", icon: <FiPlus /> },
];

const className =
  "h-10 text-black font-bold tracking-widest uppercase rounded mr-2 px-6 flex items-center dark:hover:text-white bg-blue-300 dark:bg-transparent dark:hover:bg-transparent dark:shadow-none shadow shadow-blue-100s hover:shadow-none hover:bg-blue-400 transition-all duration-300 hover:underline underline-offset-4";

const activeClassName = "text-white dark:text-white bg-transparent dark:shadow-none dark:hover:bg-transparent dark:underline";

export const Navigation = () => {
  const { asPath } = useRouter();

  const getLinkClassName = (path: string) => {
    return twMerge(className, asPath === path ? activeClassName : "");
  };

  return (
    <nav className="flex h-36 items-center justify-around w-full py-2 rounded-lg mt-10 shadow-2xl bg-gray-800">
      <div className="flex items-center">
        {links.map((link) => (
          <Link key={link.path} href={link.path}>
            <button className={getLinkClassName(link.path)}>
              <span className="mr-2">{link.icon}</span>
              {link.text}
            </button>
          </Link>
        ))}
      </div>

          <div className="mr-10">
      <div className="flex items-center space-x-2 bg-amber-600 rounded-md text-black">
        <FaWallet size={40} className="ml-4"/> {/* Add the wallet icon here */}
        <CardanoWalletSelector />
      </div>
      </div>

    </nav>
  );
};

export default Navigation;
