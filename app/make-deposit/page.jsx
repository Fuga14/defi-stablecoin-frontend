'use client';

import React from 'react';
import { useState } from 'react';
import NotSepoliaChain from '@/components/NotSepoliaChain';
import {
  useNetwork,
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
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
    console.log(valueToString);
    const valueInWei = parseEther(valueToString);
    console.log(valueInWei.toString());
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
          <div className=" w-2/3">
            <div className="">
              <div className=" ">
                <h1>Choose currency to deposit</h1>
                <select
                  value={selectedCurrency}
                  onChange={handleCurrencyChange}
                  className=" bg-black text-4xl rounded-xl border-white border text-center p-2"
                >
                  <option value={1}>weth</option>
                  <option value={2}>wbtc</option>
                </select>
              </div>
              <p>Выбранная валюта: {selectedCurrency === 1 ? 'weth' : 'wbtc'}</p>
              <input
                type="number"
                className=" text-black w-80 "
                placeholder=" Type amount you want to seposit"
                onChange={handleAmountInputChange}
              />
              <h1>{depositAmount}</h1>
              <button>Make deposit!!!</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MakeDeposit;
