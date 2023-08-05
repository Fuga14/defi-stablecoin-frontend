import React from 'react';

const MintedBalance = ({ totalDhcMinted }) => {
  return (
    <div className=" w-96 h-auto">
      <div className="  flex flex-col bg-black rounded-xl border-white border ">
        <div className=" flex flex-row pt-3 pb-3 pl-5 pr-5 justify-between">
          <h1 className=" text-3xl text-center font-mono font-semibold">UHC balance</h1>
          <h1 className=" text-3xl font-bold font-mono">$</h1>
        </div>
        <div className="p-3">
          <h1 className=" text-4xl text-right  font-bold">{totalDhcMinted}</h1>
        </div>
      </div>
    </div>
  );
};

export default MintedBalance;
