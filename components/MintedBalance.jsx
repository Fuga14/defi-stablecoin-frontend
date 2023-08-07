import React from 'react';

const MintedBalance = ({ totalDhcMinted }) => {
  const valueRounded = Number(totalDhcMinted).toFixed(2);
  return (
    <div className=" w-80 h-auto">
      <div className="  flex flex-col bg-black rounded-xl border-white border ">
        <div className=" flex flex-row pt-3 pb-3 pl-5 pr-5 justify-between">
          <h1 className=" text-3xl text-center font-mono font-semibold">UHC balance</h1>
          <h1 className=" text-3xl text-right font-bold">{valueRounded}</h1>
        </div>
      </div>
    </div>
  );
};

export default MintedBalance;
