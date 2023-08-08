'use client';

import React, { useEffect, useState } from 'react';
import NotSepoliaChain from '@/components/NotSepoliaChain';
import {
  useNetwork,
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi';
import addresses from '@/constants/addresses';
import { dhcEngineABI } from '@/constants/dhcEngine-abi';
import { wethABI } from '@/constants/weth-abi';
import { wbtcABI } from '@/constants/wbtc-abi';
import { formatEther, parseEther } from 'viem';
import DepositBalanceUSD from '@/components/DepositBalanceUSD';
import MintedBalance from '@/components/MintedBalance';
import HealthFactor from '@/components/HealthFactor';

const MintUHC = () => {
  const [collateralValueInUsd, setCollateralValueInUsd] = useState(0);
  const [totalDhcMinted, setTotalDhcMinted] = useState(0);
  const [userHealthFactor, setUserHealthFactor] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [mintValue, setMintValue] = useState(0);

  const { chain } = useNetwork();
  const { address } = useAccount();

  const dhcAddress = addresses.dhcEngine;
  const wethAddress = addresses.weth;
  const wbtcAddress = addresses.wbtc;
  const MAX_UINT256 =
    '115792089237316195423570985008687907853269984665640564039457584007913129639935';

  const { data, isError, isLoading } = useContractRead({
    address: dhcAddress,
    abi: dhcEngineABI,
    functionName: 'getAccountInformation',
    args: [address],
    watch: true,
    onSuccess(data) {
      const dataValueInUsd = formatEther(data[1]);
      const roundedValue = Number(dataValueInUsd).toFixed(2);
      setCollateralValueInUsd(roundedValue);

      const mintedValue = formatEther(data[0]);
      setTotalDhcMinted(mintedValue);
    },
  });

  const { data: healthFactor } = useContractRead({
    address: dhcAddress,
    abi: dhcEngineABI,
    functionName: 'getHealthFactor',
    args: [address],
    watch: true,
    onSuccess(healthFactor) {
      const hf = healthFactor.toString();
      setUserHealthFactor(hf);
    },
  });

  const { config: mintConfig } = usePrepareContractWrite({
    address: dhcAddress,
    abi: dhcEngineABI,
    functionName: 'mintDhc',
    args: [mintValue],
  });

  const {
    write: mint,
    data: txMint,
    isLoading: isMintingLoading,
    isSuccess: isMintingSuccess,
    isError: isMintingError,
  } = useContractWrite(mintConfig);

  const { isSuccess: mintSuccess, isError: mintError } = useWaitForTransaction({
    hash: txMint?.hash,
  });

  const handleKeyPress = (event) => {
    const charCode = event.which ? event.which : event.keyCode;
    // Allow only numeric characters (character codes 48-57 correspond to digits 0-9)
    // Allow one decimal point (character code 46)
    if (
      (charCode < 48 || charCode > 57) &&
      charCode !== 46 // decimal point character code
    ) {
      event.preventDefault();
    }
    // Check that the decimal point has not been entered earlier
    if (charCode === 46 && inputValue.includes('.')) {
      event.preventDefault();
    }
  };

  const handleChange = (event) => {
    setInputValue(event.target.value);
    convertToWei(event.target.value);
  };

  const convertToWei = (value) => {
    console.log(value);
    const valueInWei = parseEther(value);
    setMintValue(valueInWei);
  };

  return (
    <div className=" w-full h-[80vh]">
      {chain?.name != 'Sepolia' ? (
        <NotSepoliaChain />
      ) : (
        <div className=" flex flex-row w-full h-[80vh]">
          <div className=" w-1/3 flex flex-col justify-center items-center space-y-10">
            <DepositBalanceUSD collateralValueInUsd={collateralValueInUsd} />
            <MintedBalance totalDhcMinted={totalDhcMinted} />
            <HealthFactor userHealthFactor={userHealthFactor} />
          </div>
          <div className=" w-2/3  flex flex-col justify-center items-center">
            <div className=" m-10">
              <h1></h1>
              <input
                type="text"
                value={inputValue}
                id="inputValue"
                onKeyPress={handleKeyPress}
                onChange={handleChange}
                placeholder="Type amount to be minted"
                className="text-black w-80 border rounded-xl text-left font-semibold pl-4 pt-2 pb-2 text-lg shadow-sm shadow-black focus:shadow-md focus:shadow-black"
              />
            </div>
            <div className=" flex flex-col justify-center items-center">
              <button
                className="page-button pr-5 pl-5 pb-2 pt-2 text-3xl font-bold text-center"
                onClick={() => mint?.()}
              >
                MINT COIN{inputValue > 1 ? 'S' : ''}
              </button>
              <h1 className=" text-green-400 text-md font-semibold mt-1">
                {isMintingLoading && 'Mint loading'}
                {(isMintingSuccess && !mintSuccess && 'Minting...') ||
                  (mintSuccess &&
                    `Successfully minted ${inputValue} coin${inputValue > 1 ? 's' : ''}`)}
              </h1>
              <h1 className=" text-red-500 text-md font-semibold mt-1">
                {isMintingError && 'Transaction failed and not started'}
                {mintError && 'Mint failed'}
              </h1>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MintUHC;
