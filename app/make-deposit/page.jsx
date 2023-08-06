'use client';

import React from 'react';
import { useState } from 'react';
import NotSepoliaChain from '@/components/NotSepoliaChain';
import { useNetwork, useAccount, useContractRead } from 'wagmi';
import addresses from '@/constants/addresses';
import { dhcEngineABI } from '@/constants/dhcEngine-abi';
import { formatEther } from 'viem';
import DepositBalanceUSD from '@/components/DepositBalanceUSD';
import MintedBalance from '@/components/MintedBalance';
import HealthFactor from '@/components/HealthFactor';

const MakeDeposit = () => {
  const [collateralValueInUsd, setCollateralValueInUsd] = useState(0);
  const [totalDhcMinted, setTotalDhcMinted] = useState(0);
  const [userHealthFactor, setUserHealthFactor] = useState(0);

  const { chain } = useNetwork();
  const { address } = useAccount();
  const dhcAddress = addresses.dhcEngine;
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
          <div className=" w-2/3">Side</div>
        </div>
      )}
    </div>
  );
};

export default MakeDeposit;
