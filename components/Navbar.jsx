"use client";
import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import Image from "next/image";

const Navbar = () => {
  const links = [
    { id: 1, title: "Make deposit", url: "/make-deposit" },
    { id: 2, title: "Withdraw deposit", url: "/withdraw-deposit" },
    { id: 3, title: "Mint UHC", url: "/mint-uhc" },
    { id: 4, title: "Burn UHC", url: "/burn-uhc" },
  ];

  return (
    <div className="border-b-2 border-white h-20 flex flex-row items-center">
      <div className=" w-1/4 flex flex-row items-center pl-5 ">
        <div className=" hover:scale-105 transition duration-200">
          <Link href="/" className=" mr-7 flex flex-row items-center space-x-4">
            <Image src="/logo.png" width={45} height={45} alt="Home page" />
            <h1 className=" text-4xl font-bold ">Hryvnia Coin</h1>
          </Link>
        </div>
      </div>
      <div className=" w-2/4 flex flex-row items-center text-xl space-x-20 pl-2 ">
        {links.map((link) => (
          <div
            key={link.id}
            className=" bg-blue-500 p-2 hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-500/50 rounded-xl hover:scale-105 transition duration-150 font-semibold "
          >
            <Link key={link.id} href={link.url}>
              {link.title}
            </Link>
          </div>
        ))}
      </div>
      <div className=" w-1/4 flex flex-row-reverse pr-10 ">
        <ConnectButton />
      </div>
    </div>
  );
};

export default Navbar;
