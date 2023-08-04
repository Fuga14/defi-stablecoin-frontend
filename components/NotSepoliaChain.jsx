import React from 'react';
import { useNetwork, useSwitchNetwork } from 'wagmi';
import { useAccount } from 'wagmi';

const NotSepoliaChain = () => {
  const { chain } = useNetwork();
  const { chains, error, isLoading, pendingChainId, switchNetwork } = useSwitchNetwork();
  const { isDisconnected } = useAccount();

  const networkToSwitch = 11155111;
  return (
    <div className=" w-full h-[80vh]">
      <div className=" flex flex-col h-full justify-center items-center text-center">
        {isDisconnected ? (
          <div>
            <h1 className=" text-4xl font-semibold ">You need to connect your wallet to work</h1>
          </div>
        ) : (
          <div>
            {chain && (
              <div className=" font-semibold text-3xl">
                <h1>Your current chain: {chain.name}</h1>
                <h1>Switch to Sepolia please!</h1>
              </div>
            )}
            <button
              onClick={() => switchNetwork(networkToSwitch)}
              className=" p-[6px] bg-header-button font-semibold rounded-xl transition duration-200 hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-600/50 hover:scale-150 mt-10 scale-125"
            >
              Switch to Sepolia
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotSepoliaChain;
