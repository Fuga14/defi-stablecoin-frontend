import React from 'react';

const DepositedCollateral = ({ selectedCurrency, depositedAmountWeth, depositedAmountWbtc }) => {
  return (
    <div className=" w-80 h-auto">
      <div className="  flex flex-col bg-black rounded-xl border-white border ">
        <div className=" flex flex-row pt-3 pl-5 pr-5 justify-center items-center">
          <h1 className=" text-xl text-center font-bold">
            Deposited currency: {selectedCurrency === 1 ? 'WETH' : 'WBTC'}
          </h1>
        </div>
        <div className="p-3">
          <h1 className=" text-4xl text-right  font-bold">
            {selectedCurrency === 1 ? depositedAmountWeth : depositedAmountWbtc}
          </h1>
        </div>
      </div>
    </div>
  );
};

export default DepositedCollateral;
