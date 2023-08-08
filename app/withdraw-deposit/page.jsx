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
import DepositedCollateral from '@/components/DepositedCollateral';

const WithdrawDeposit = () => {
  const [collateralValueInUsd, setCollateralValueInUsd] = useState(0);
  const [totalDhcMinted, setTotalDhcMinted] = useState(0);
  const [userHealthFactor, setUserHealthFactor] = useState(0);
  const [selectedCurrency, setSelectedCurrency] = useState(1);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [depositedAmountWeth, setDepositedAmountWeth] = useState('');
  const [depositedAmountWbtc, setDepositedAmountWbtc] = useState('');
  const [inputValue, setInputValue] = useState('');

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

  const { data: depositedWethAmount } = useContractRead({
    address: dhcAddress,
    abi: dhcEngineABI,
    functionName: 'getCollateralDepositedAmountOfUser',
    args: [address, wethAddress],
    watch: true,
    onSuccess(depositedWethAmount) {
      const wethAmountString = depositedWethAmount.toString();
      const wethAmount = formatEther(depositedWethAmount);
      setDepositedAmountWeth(wethAmount);
    },
  });

  const { data: depositedWbtcAmount } = useContractRead({
    address: dhcAddress,
    abi: dhcEngineABI,
    functionName: 'getCollateralDepositedAmountOfUser',
    args: [address, wbtcAddress],
    watch: true,
    onSuccess(depositedWbtcAmount) {
      const wbtcAmountString = depositedWbtcAmount.toString();
      const wbtcAmount = formatEther(depositedWbtcAmount);
      setDepositedAmountWbtc(wbtcAmount);
    },
  });

  const handleCurrencyChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedCurrency(parseInt(selectedValue));
  };

  const {
    data: redeemTxWeth,
    write: redeemCollateralWeth,
    isSuccess: isRedeemWethSuccess,
    isLoading: isRedeemWethLoading,
    isError: isRedeemWethError,
  } = useContractWrite({
    address: dhcAddress,
    abi: dhcEngineABI,
    functionName: 'redeemCollateral',
    args: [wethAddress, withdrawAmount],
  });

  const {
    data: redeemTxWbtc,
    write: redeemCollateralWbtc,
    isSuccess: isRedeemWbtcSuccess,
    isLoading: isRedeemWbtcLoading,
    isError: isRedeemWbtcError,
  } = useContractWrite({
    address: dhcAddress,
    abi: dhcEngineABI,
    functionName: 'redeemCollateral',
    args: [wbtcAddress, withdrawAmount],
  });

  const { isSuccess: redeemWethSuccess, isError: redeemWethError } = useWaitForTransaction({
    hash: redeemTxWeth?.hash,
  });

  const { isSuccess: redeemWbtcSuccess, isError: redeemWbtcError } = useWaitForTransaction({
    hash: redeemTxWbtc?.hash,
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
    setWithdrawAmount(valueInWei);
  };

  return (
    <div className=" w-full h-[80vh]">
      {chain?.name != 'Sepolia' ? (
        <NotSepoliaChain />
      ) : (
        <div className=" flex flex-row w-full h-[80vh]">
          <div className=" w-1/3 flex flex-col justify-center items-center space-y-5 scale-90">
            <DepositBalanceUSD collateralValueInUsd={collateralValueInUsd} />
            <MintedBalance totalDhcMinted={totalDhcMinted} />
            <HealthFactor userHealthFactor={userHealthFactor} />
            <DepositedCollateral
              selectedCurrency={selectedCurrency}
              depositedAmountWeth={depositedAmountWeth}
              depositedAmountWbtc={depositedAmountWbtc}
            />
          </div>
          <div className=" w-2/3 flex flex-col justify-center items-center">
            <div className=" flex flex-row justify-center items-center space-x-10 mb-10">
              <h1 className=" text-3xl font-semibold">Choose a currency to withdraw collaterals</h1>
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
                placeholder=" Type amount you want to withdraw"
              />
            </div>{' '}
            <div className=" mt-10 flex flex-col">
              <div className=" flex flex-col justify-center items-center">
                <button
                  className=" page-button pl-5 pr-5 text-3xl"
                  onClick={() => {
                    if (selectedCurrency === 1) {
                      redeemCollateralWeth();
                    } else {
                      redeemCollateralWbtc();
                    }
                  }}
                >
                  Withdraw
                </button>
                <h1 className=" green-transactions">
                  {selectedCurrency === 1 && isRedeemWethLoading && 'Redeem loading...'}
                  {(selectedCurrency === 1 &&
                    isRedeemWethSuccess &&
                    !redeemWethSuccess &&
                    'Redeeming...') ||
                    (selectedCurrency === 1 && redeemWethSuccess && 'Redeemed successfully')}

                  {selectedCurrency === 2 && isRedeemWethLoading && 'Redeem loading...'}
                  {(selectedCurrency === 2 &&
                    isRedeemWbtcSuccess &&
                    !redeemWbtcSuccess &&
                    'Redeeming...') ||
                    (selectedCurrency === 2 && redeemWbtcSuccess && 'Redeemed successfully')}
                </h1>
                <h1 className=" red-transactions">
                  {selectedCurrency === 1 && isRedeemWethError && 'Redeeming failed'}
                  {selectedCurrency === 1 && redeemWethError && 'Redeeming failed'}

                  {selectedCurrency === 2 && isRedeemWbtcError && 'Redeeming failed'}
                  {selectedCurrency === 2 && redeemWbtcError && 'Redeeming failed'}
                </h1>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WithdrawDeposit;
