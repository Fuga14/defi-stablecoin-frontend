'use client';

import React, { useEffect } from 'react';
import { useState } from 'react';
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

const MakeDeposit = () => {
  const [collateralValueInUsd, setCollateralValueInUsd] = useState(0);
  const [totalDhcMinted, setTotalDhcMinted] = useState(0);
  const [userHealthFactor, setUserHealthFactor] = useState(0);
  const [selectedCurrency, setSelectedCurrency] = useState(1);
  const [depositAmount, setDepositAmount] = useState('');
  const [approveSuccess, setApproveSuccess] = useState(false);
  const { chain } = useNetwork();
  const { address } = useAccount();
  const dhcAddress = addresses.dhcEngine;
  const wethAddress = addresses.weth;
  const wbtcAddress = addresses.wbtc;
  const MAX_UINT256 =
    '115792089237316195423570985008687907853269984665640564039457584007913129639935';

  // console.log(chain);
  // console.log(dhcAddress);
  // console.log(address);
  // console.log(dhcEngineABI);

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

  const handleCurrencyChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedCurrency(parseInt(selectedValue));
  };

  const handleAmountInputChange = (event) => {
    const selectedValue = event.target.value;
    const valueToString = selectedValue.toString();
    const valueInWei = parseEther(valueToString);
    setDepositAmount(valueInWei.toString());
  };

  const { config: wethConfigApprove } = usePrepareContractWrite({
    address: wethAddress,
    abi: wethABI,
    functionName: 'approve',
    args: [dhcAddress, Number(depositAmount)],
  });

  const { config: wbtcConfigApprove } = usePrepareContractWrite({
    address: wbtcAddress,
    abi: wbtcABI,
    functionName: 'approve',
    args: [dhcAddress, Number(depositAmount)],
  });

  // const { config: depositCollateralConfig } = usePrepareContractWrite({
  //   address: dhcAddress,
  //   abi: dhcEngineABI,
  //   functionName: 'depositCollateral',
  // });

  const { data: depositTxWeth, write: depositCollateralWeth } = useContractWrite({
    address: dhcAddress,
    abi: dhcEngineABI,
    functionName: 'depositCollateral',
    args: [wethAddress, depositAmount],
  });

  const { data: depositTxWbtc, write: depositCollateralWbtc } = useContractWrite({
    address: dhcAddress,
    abi: dhcEngineABI,
    functionName: 'depositCollateral',
    args: [wbtcAddress, depositAmount],
  });

  const {
    data: wethApproveData,
    isSuccess: wethApproveSuccess,
    isError: wethApproveError,
    isLoading: wethApprovaLoading,
    write: approveWeth,
  } = useContractWrite(wethConfigApprove);

  const {
    data: wbtcApproveData,
    isSuccess: wbtcApproveSuccess,
    isError: wbtcApproveError,
    write: approveWbtc,
  } = useContractWrite(wbtcConfigApprove);

  const { isSuccess: txWethApproveSuccess } = useWaitForTransaction({
    hash: wethApproveData?.hash,
  });

  const { isSuccess: txWbtcApproveSuccess } = useWaitForTransaction({
    hash: wbtcApproveSuccess?.hash,
  });

  const { isSuccess: depositWethSuccess, isError: depositWethError } = useWaitForTransaction({
    hash: depositTxWeth?.hash,
  });

  const { isSuccess: depositWbtcSuccess, isError: depositWbtcError } = useWaitForTransaction({
    hash: depositTxWbtc?.hash,
  });

  const isApprovedWeth = txWethApproveSuccess;
  const isApprovedWbtc = txWbtcApproveSuccess;
  const isDepositWethSuccess = depositWethSuccess;
  const isDepositbtcSuccess = depositWbtcSuccess;

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
          <div className=" w-2/3 flex flex-col justify-center items-center">
            <div className=" flex flex-row justify-center items-center space-x-10 mb-10">
              <h1 className=" text-3xl font-semibold">Choose currency to deposit</h1>
              <select
                value={selectedCurrency}
                onChange={handleCurrencyChange}
                className=" bg-header-button text-xl font-semibold rounded-xl rounded-header-button text-center pr-4 pl-4 pt-2 pb-2 hover:scale-105 transition duration-150"
              >
                <option value={1}>WETH</option>
                <option value={2}>WBTC</option>
              </select>
            </div>
            <div className=" flex flex-row space-x-10">
              <input
                type="number"
                className=" text-black w-80 border rounded-xl text-center pt-2 pb-2 text-lg shadow-sm shadow-black focus:shadow-md focus:shadow-black"
                placeholder=" Type amount you want to deposit"
                onChange={handleAmountInputChange}
              />
              <button
                className=" bg-header-button p-[6px] hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-600/50 rounded-xl hover:scale-105 transition duration-150 font-semibold pl-5 pr-5"
                onClick={() => {
                  if (selectedCurrency === 1) {
                    approveWeth();
                  } else {
                    approveWbtc();
                  }
                }}
              >
                Approve
              </button>
              <div className=" flex justify-center items-center">
                <h1 className=" text-green-400 text-xl font-semibold">
                  {selectedCurrency === 1
                    ? txWethApproveSuccess && 'Approved'
                    : txWbtcApproveSuccess && 'Approved'}
                </h1>
                <h1 className=" text-red-500 text-xl font-semibold">
                  {(wethApproveError && 'Approve failed!') ||
                    (wbtcApproveError && 'Approve failed!')}
                </h1>
              </div>
            </div>{' '}
            <div className=" mt-10 flex flex-row space-x-10">
              <button
                className=" bg-header-button p-[6px] hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-600/50 rounded-xl hover:scale-105 transition duration-150 font-semibold pl-5 pr-5 text-3xl"
                onClick={() => {
                  if (selectedCurrency === 1) {
                    depositCollateralWeth();
                  } else {
                    depositCollateralWbtc();
                  }
                }}
              >
                Deposit
              </button>
              <div className=" flex justify-center items-center">
                <h1 className=" text-green-400 text-lg font-semibold">
                  {selectedCurrency === 1
                    ? depositWethSuccess && 'Deposit successfull'
                    : depositWbtcSuccess && 'Deposit successfull'}
                </h1>
                <h1 className=" text-red-500 text-lg font-semibold">
                  {(depositWbtcError && 'Deposit failed!') ||
                    (depositWethError && 'Deposit failed!')}
                </h1>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MakeDeposit;
