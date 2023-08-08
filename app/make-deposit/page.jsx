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
  const [inputValue, setInputValue] = useState('');

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

  const {
    data: depositTxWeth,
    write: depositCollateralWeth,
    isSuccess: isDepositWethSuccess,
    isLoading: isDepositWethLoading,
    isError: isDepositWethError,
  } = useContractWrite({
    address: dhcAddress,
    abi: dhcEngineABI,
    functionName: 'depositCollateral',
    args: [wethAddress, depositAmount],
  });

  const {
    data: depositTxWbtc,
    write: depositCollateralWbtc,
    isSuccess: isDepositWbtcSuccess,
    isLoading: isDepositWbtcLoading,
    isError: isDepositWbtcError,
  } = useContractWrite({
    address: dhcAddress,
    abi: dhcEngineABI,
    functionName: 'depositCollateral',
    args: [wbtcAddress, depositAmount],
  });

  const {
    data: wethApproveData,
    isSuccess: isApproveWethSuccess,
    isError: isApproveWethError,
    isLoading: isApproveWethLoading,
    write: approveWeth,
  } = useContractWrite(wethConfigApprove);

  const {
    data: wbtcApproveData,
    isSuccess: isApproveWbtcSuccess,
    isError: isApproveWbtcError,
    isLoading: isApproveWbtcLoading,
    write: approveWbtc,
  } = useContractWrite(wbtcConfigApprove);

  const { isSuccess: txWethApproveSuccess } = useWaitForTransaction({
    hash: wethApproveData?.hash,
    onSuccess(data) {
      depositCollateralWeth();
    },
  });

  const { isSuccess: txWbtcApproveSuccess } = useWaitForTransaction({
    hash: wbtcApproveData?.hash,
    onSuccess(data) {
      depositCollateralWbtc();
    },
  });

  const { isSuccess: depositWethSuccess, isError: depositWethError } = useWaitForTransaction({
    hash: depositTxWeth?.hash,
  });

  const { isSuccess: depositWbtcSuccess, isError: depositWbtcError } = useWaitForTransaction({
    hash: depositTxWbtc?.hash,
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
    setDepositAmount(valueInWei);
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
          <div className=" w-2/3 flex flex-col justify-center items-center">
            <div className=" flex flex-row justify-center items-center space-x-10 mb-10">
              <h1 className=" text-3xl font-semibold">Choose currency to deposit</h1>
              <select
                value={selectedCurrency}
                onChange={handleCurrencyChange}
                className=" bg-header-button text-xl font-semibold rounded-xl rounded-header-button text-center pr-4 pl-4 pt-2 pb-2  transition duration-150"
              >
                <option value={1}>WETH</option>
                <option value={2}>WBTC</option>
              </select>
            </div>
            <div className=" flex flex-row space-x-10">
              <input
                type="text"
                value={inputValue}
                id="inputValue"
                onKeyPress={handleKeyPress}
                onChange={handleChange}
                className=" text-black w-80 border rounded-xl text-left font-semibold pl-4 pt-2 pb-2 text-lg shadow-sm shadow-black focus:shadow-md focus:shadow-black"
                placeholder=" Type amount you want to deposit"
              />
            </div>{' '}
            <div className=" mt-10 flex flex-col">
              <div className=" flex justify-center items-center">
                <button
                  className=" page-button pl-5 pr-5 text-3xl"
                  onClick={() => {
                    if (selectedCurrency === 1) {
                      approveWeth();
                    } else {
                      approveWbtc();
                    }
                  }}
                >
                  Deposit
                </button>
              </div>
              <div className=" flex flex-col justify-center items-center">
                <h1 className=" green-transactions">
                  {selectedCurrency === 1 && isApproveWethLoading && 'Approve loading...'}
                  {(selectedCurrency === 1 &&
                    isApproveWethSuccess &&
                    !txWethApproveSuccess &&
                    'Approving...') ||
                    (selectedCurrency === 1 && txWethApproveSuccess && 'Approved!')}

                  {selectedCurrency === 2 && isApproveWbtcLoading && 'Approve loading...'}
                  {(selectedCurrency === 2 &&
                    isApproveWbtcSuccess &&
                    !txWbtcApproveSuccess &&
                    'Approving...') ||
                    (selectedCurrency === 2 && txWbtcApproveSuccess && 'Approved!')}
                </h1>
                <h1 className=" red-transactions">
                  {selectedCurrency === 1 && isApproveWethError && 'Approve failed'}

                  {selectedCurrency === 2 && isApproveWbtcError && 'Approve failed'}
                </h1>
                <h1 className=" green-transactions">
                  {selectedCurrency === 1 && isDepositWethLoading && 'Deposit loading...'}
                  {(selectedCurrency === 1 &&
                    isDepositWethSuccess &&
                    !depositWethSuccess &&
                    'Depositing...') ||
                    (selectedCurrency === 1 &&
                      depositWethSuccess &&
                      `Successfully deposited ${formatEther(depositAmount)} of WETH`)}

                  {selectedCurrency === 2 && isDepositWbtcLoading && 'Deposit loading...'}
                  {(selectedCurrency === 2 &&
                    isDepositWbtcSuccess &&
                    !depositWbtcSuccess &&
                    'Depositing...') ||
                    (selectedCurrency === 2 &&
                      depositWbtcSuccess &&
                      `Successfully deposited ${depositAmount} of WBTC`)}
                </h1>
                <h1 className=" red-transactions">
                  {selectedCurrency === 1 &&
                    isDepositWethError &&
                    !depositWethError &&
                    'Deposit transaction not started'}
                  {selectedCurrency === 1 && isDepositWethError && 'Deposit transaction failed'}

                  {selectedCurrency === 2 &&
                    isDepositWbtcError &&
                    !depositWbtcError &&
                    'Deposit transaction not started'}
                  {selectedCurrency === 2 && depositWbtcError && 'Deposit transaction failed'}
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
