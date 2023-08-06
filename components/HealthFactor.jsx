import React from 'react';
import { parseEther } from 'viem';

const HealthFactor = ({ userHealthFactor }) => {
  const minHealthFactor = parseEther('1');

  return (
    <div className=" w-80 h-auto">
      <div className="  flex flex-col bg-black rounded-xl border-white border ">
        <div className=" flex flex-col pt-3 pb-3 pl-5 pr-5 justify-between">
          <h1 className=" text-2xl text-center font-mono font-semibold">
            Your current status of health factor
          </h1>
          <h1 className=" text-4xl text-center  font-bold">
            {userHealthFactor >= minHealthFactor ? (
              <div className=" text-green-500">Normal</div>
            ) : (
              <div className=" text-red-600">Not normal</div>
            )}
          </h1>
        </div>
      </div>
    </div>
  );
};

export default HealthFactor;
