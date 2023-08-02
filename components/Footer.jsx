import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer className=" w-full h-16 bg-black border-t-2 font-semibold">
      <div className=" flex flex-row items-center justify-center pt-4 ml-5 mr-5">
        <div className=" flex flex-row w-1/4">
          <Image src="/ethereum.png" width={25} height={25} alt="Ethereum icon" />
          <h1 className=" text-center">Supported network: Sepolia</h1>
        </div>
        <div className=" flex flex-row w-1/4 hover:underline">
          <Link href="https://www.linkedin.com/in/vladyslavpereder/" target="_blank">
            @Author: Vladyslav Pereder
          </Link>
        </div>
        <div className=" w-2/4 flex flex-row items-center space-x-10">
          <div className="  ">
            <Link
              href="https://sepolia.etherscan.io/address/0x9a3d58644b45e85bb1b89f3b0e78425a83a72e80#code"
              target="_blank"
              className=" hover:underline"
            >
              <h1 className=" whitespace-nowrap">Decentralized Hryvna Coin contract</h1>
            </Link>
          </div>
          <div className=" ">
            <Link
              href="https://sepolia.etherscan.io/address/0x092dc07A6e42888B1B8caB478CF7e897D5ab05e9"
              target="_blank"
              className=" hover:underline"
            >
              <h1 className=" whitespace-nowrap">Decentralized Hryvna Coin Engine contract</h1>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
