'use client';

import React from 'react';
import NotSepoliaChain from '@/components/NotSepoliaChain';
import { useNetwork } from 'wagmi';

const MakeDeposit = () => {
  const { chain } = useNetwork();
  console.log(chain);
  return (
    <div className=" w-full h-[80vh]">
      {chain?.name != 'Sepolia' ? <NotSepoliaChain /> : <div className="">Rest of the page</div>}
    </div>
  );
};

export default MakeDeposit;
