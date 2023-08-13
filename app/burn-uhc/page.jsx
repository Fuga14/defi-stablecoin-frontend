'use client';

import React, { useState } from 'react';
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
import { dhcABI } from '@/constants/dhc-abi';
import { formatEther, parseEther } from 'viem';
import DepositBalanceUSD from '@/components/DepositBalanceUSD';
import MintedBalance from '@/components/MintedBalance';
import HealthFactor from '@/components/HealthFactor';

const BurnUHC = () => {
  const [collateralValueInUsd, setCollateralValueInUsd] = useState(0);
  const [totalDhcMinted, setTotalDhcMinted] = useState(0);
  const [userHealthFactor, setUserHealthFactor] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [burnValue, setBurnValue] = useState(0);

  const { chain } = useNetwork();
  const { address } = useAccount();

  const dhcEngineAddress = addresses.dhcEngine;
  const dhcAddress = addresses.dhc;

  const { data, isError, isLoading } = useContractRead({
    address: dhcEngineAddress,
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
    address: dhcEngineAddress,
    abi: dhcEngineABI,
    functionName: 'getHealthFactor',
    args: [address],
    watch: true,
    onSuccess(healthFactor) {
      const hf = healthFactor.toString();
      setUserHealthFactor(hf);
    },
  });

  const { config: burnConfig } = usePrepareContractWrite({
    address: dhcEngineAddress,
    abi: dhcEngineABI,
    functionName: 'burnDhc',
    args: [burnValue],
  });

  const {
    write: burn,
    data: txBurn,
    isLoading: isBurnLoading,
    isSuccess: isBurnSuccess,
    isError: isBurnError,
  } = useContractWrite(burnConfig);

  const { isSuccess: burnSuccess, isError: burnError } = useWaitForTransaction({
    hash: txBurn?.hash,
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
    setBurnValue(valueInWei);
  };

  const { config: approveConfig } = usePrepareContractWrite({
    address: dhcAddress,
    abi: dhcABI,
    functionName: 'approve',
    args: [dhcEngineAddress, burnValue],
  });

  const {
    data: txApproveData,
    isSuccess: isApproveSuccess,
    isLoading: isApproveLoading,
    isError: isApproveError,
    write: approve,
  } = useContractWrite(approveConfig);

  const { isSuccess: approveSuccess, isError: approveError } = useWaitForTransaction({
    hash: txApproveData?.hash,
    onSuccess(data) {
      burn();
    },
  });

  return (
    <div className=" w-full h-screen">
      {chain?.name != 'Sepolia' ? (
        <NotSepoliaChain />
      ) : (
        <div className=" flex flex-row w-full h-screen">
          <div className=" w-1/3 flex flex-col justify-center items-center space-y-10">
            <DepositBalanceUSD collateralValueInUsd={collateralValueInUsd} />
            <MintedBalance totalDhcMinted={totalDhcMinted} />
            <HealthFactor userHealthFactor={userHealthFactor} />
          </div>
          <div className=" w-2/3  flex flex-col justify-center items-center">
            <div className=" m-10">
              <input
                type="text"
                value={inputValue}
                id="inputValue"
                onKeyPress={handleKeyPress}
                onChange={handleChange}
                placeholder="Type amount to be burned"
                className="text-black w-80 border rounded-xl text-left font-semibold pl-4 pt-2 pb-2 text-lg shadow-sm shadow-black focus:shadow-md focus:shadow-black"
              />
            </div>
            <div className=" flex flex-col justify-center items-center">
              <button
                className="page-button pr-5 pl-5 pb-2 pt-2 text-3xl font-bold text-center"
                onClick={() => approve?.()}
              >
                BURN COIN{inputValue > 1 ? 'S' : ''}
              </button>
              <h1 className=" green-transactions">
                {isApproveLoading && 'Approve loading...'}
                {(isApproveSuccess && !approveSuccess && 'Approving...') ||
                  (approveSuccess && 'Successfully approved')}
              </h1>
              <h1 className=" red-transactions">
                {isApproveError && 'Approve error'}
                {approveError && 'Approve failed'}
              </h1>
              <h1 className=" green-transactions">
                {isBurnLoading && 'Burn loading...'}
                {(isBurnSuccess && !burnSuccess && 'Burning...') ||
                  (burnSuccess &&
                    `Successfully burned ${inputValue} coin${inputValue > 1 ? 's' : ''}`)}
              </h1>
              <h1 className=" red-transactions">
                {isBurnError && 'Transaction failed and not started'}
                {burnError && 'Burn failed'}
              </h1>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BurnUHC;
