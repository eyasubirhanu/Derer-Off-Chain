import React, { useState, useEffect } from "react";
import { Inter } from "@next/font/google";
import { lovelaceToAda } from "lib/lovelace-to-ada";
import { listAssets } from "hooks/use-assets-users";
import { useCardano, utility } from "use-cardano";
import { FaWallet } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";

const inter = Inter({ subsets: ["latin"] });

type CartNFT = {
  id: string;
  imgurl: string;
  name: string;
  price: number;
};

export const Headers = () => {
  const { lucid, account, showToaster } = useCardano();
  const { lovelace, assets } = listAssets(lucid);
  const openModal = () => {
    const modal = document.getElementById("my_modal_1") as HTMLDialogElement;
    modal.showModal();
  };
  const Cart: React.FC = () => {
    const [cartItems, setCartItems] = useState<CartNFT[]>([
      {
        id: "1",
        imgurl: "https://i.imgur.com/uFz6NYC.jpg",
        name: "wendeNft",
        price: 10,
      },
      {
        id: "2",
        imgurl: "https://i.imgur.com/uFz6NYC.jpg",
        name: "wendeNft",
        price: 10,
      },
      {
        id: "3",
        imgurl: "https://i.imgur.com/uFz6NYC.jpg",
        name: "wendeNft",
        price: 10,
      },
      {
        id: "4",
        imgurl: "https://i.imgur.com/uFz6NYC.jpg",
        name: "wendeNft",
        price: 10,
      },
      {
        id: "5",
        imgurl: "https://i.imgur.com/uFz6NYC.jpg",
        name: "wendeNft",
        price: 10,
      },
      {
        id: "6",
        imgurl: "https://i.imgur.com/uFz6NYC.jpg",
        name: "wendeNft",
        price: 10,
      },
      {
        id: "7",
        imgurl: "https://i.imgur.com/uFz6NYC.jpg",
        name: "wendeNft",
        price: 10,
      },
      {
        id: "8",
        imgurl: "https://i.imgur.com/uFz6NYC.jpg",
        name: "wendeNft",
        price: 10,
      },
      {
        id: "9",
        imgurl: "https://i.imgur.com/uFz6NYC.jpg",
        name: "wendeNft",
        price: 10,
      },
      {
        id: "10",
        imgurl: "https://i.imgur.com/uFz6NYC.jpg",
        name: "wendeNft",
        price: 10,
      },
      {
        id: "11",
        imgurl: "https://i.imgur.com/uFz6NYC.jpg",
        name: "wendeNft",
        price: 10,
      },
      {
        id: "12",
        imgurl: "https://i.imgur.com/uFz6NYC.jpg",
        name: "wendeNft",
        price: 10,
      },
      {
        id: "13",
        imgurl: "https://i.imgur.com/uFz6NYC.jpg",
        name: "wendeNft",
        price: 10,
      },
    ]);

    const removeFromCart = (id: string) => {
      setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
    };

    const calculateTotal = () => {
      return cartItems.reduce((total, item) => total + item.price, 0);
    };

    return (
      <div className="max-h-96 max-w-full bg-white rounded p-4 overflow-auto">
        <div className="modal-action ">
          <form method="dialog">
            <button className="btn bg-red-500">Close</button>
          </form>
        </div>
        <h2 className="text-lg font-bold mb-4 text-black">Your Cart</h2>
        <hr className="my-4" />
        {cartItems.map((item) => (
          <div
            key={item.id}
            className="flex justify-between gap-3 items-center mb-2"
          >
            <img
              src={item.imgurl}
              alt="NFT Image"
              className="w-16 rounded-lg"
            />
            <span>{item.name}</span>
            <div>
              <span className="mr-2">{item.price} ETH</span>
              <button
                onClick={() => removeFromCart(item.id)}
                className="text-red-500"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
        <hr className="my-4" />
        <div className="flex justify-between items-center font-bold">
          <span>Total</span>
          <span>{calculateTotal()} ETH</span>
        </div>
      </div>
    );
  };

  return(
    <div className="navbar gap-8 rounded-md bg-amber-400 -mt-11">
      <div className="flex-1">
        <a className="btn btn-ghost text-4xl font-extrabold ml-16">
          DERER NFT MARKETPLACE
        </a>
      </div>
      <div className="card">
        <div className="card-body rounded">
          <div className="card-title bg-slate-300 rounded-md p-2">
            <FaWallet className="h-8 w-8" />{" "}
            {lovelace > 0 && <p>{lovelaceToAda(lovelace)} ADA</p>}
          </div>
        </div>
      </div>
      <div className="flex-none gap-2">
        <div className="form-control">
          <input
            type="text"
            placeholder="Search"
            className="input input-bordered w-24 md:w-auto"
          />
        </div>
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
            <div className="w-16 mt-1 rounded-full">
              <img alt="No user profile image" src="/nullProfile.png" />
            </div>
          </label>
          <ul
            tabIndex={0}
            className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
          >
            <li>
              <a className="justify-between">
                Profile
                <span className="badge">New</span>
              </a>
            </li>
            <li>
              <a>Settings</a>
            </li>
            <li>
              <a>Logout</a>
            </li>
          </ul>
        </div>
        {/* Open the modal using document.getElementById('ID').showModal() method */}
        <button className="btn" onClick={openModal}>
          <FiShoppingCart></FiShoppingCart>
        </button>
        <dialog id="my_modal_1" className="modal">
          <Cart />
        </dialog>
      </div>
    </div>
  );
};

export default Headers;
