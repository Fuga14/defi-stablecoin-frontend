"use client";

import Image from "next/image";

import { useAccount } from "wagmi";

export default function Home() {
  const { address, isConnecting, isDisconnected } = useAccount();

  // if (isConnecting) return <div>Connecting…</div>;
  // if (isDisconnected) return <div>Disconnected</div>;
  // <div>{address}</div>;

  return (
    <main className="w-full h-full">
      <div className=" w-full flex flex-row h-[80vh] border-b">
        <div className=" w-1/2 flex flex-col justify-center items-center">
          <h1 className=" text-6xl p-4 text-center font-bold gradient-b-y place-content-center">
            Stepping into the Future: The Hryvnia Stablecoin Revolution
          </h1>
        </div>
        <div className=" w-1/2 flex flex-col justify-center items-center">
          <Image
            src="/coins.png"
            alt="Crypto coins image"
            width={1920}
            height={1080}
            className=" scale-75"
          />
        </div>
      </div>
      <div className=" w-full flex flex-row h-[80vh] border-b ">
        <div className=" w-1/2 flex flex-col justify-center items-center">
          <Image
            src="/hryvnia-coin.png"
            alt="Crypto coins image"
            width={450}
            height={450}
            className=" scale-90"
          />
        </div>
        <div className=" w-1/2 flex flex-col justify-center items-center mr-5">
          <h1 className=" text-4xl p-4 text-center font-bold text-white place-content-center">
            Why is this a step forward?
          </h1>
          <div className=" flex flex-col">
            <p className=" mt-2">
              <span className=" font-bold">Autonomy and decentralization:</span>{" "}
              The protocol is fully autonomous and has no central owner, which
              ensures the independence and integrity of the system.
            </p>
            <p className=" mt-2">
              <span className=" font-bold">Stability of value:</span> Each coin
              (token) of the protocol is equal to $1, providing stability and
              usability.
            </p>
            <p className=" mt-2">
              <span className=" font-bold">Unique Minting Mechanism:</span>{" "}
              Users can create new coins using their loans, providing an
              opportunity to earn and maintain the stability of the protocol.
            </p>
            <p className=" mt-2">
              <span className=" font-bold">Secure transactions:</span> Users can
              buy coins by providing collateral as weth wbtc currency, ensuring
              reliable and secure transactions.
            </p>
            <p className=" mt-2">
              <span className=" font-bold">Coin burn and liquidation:</span>{" "}
              Users can burn their coins to withdraw their collateral, and the
              protocol actively monitors user health, liquidating accounts with
              a health factor below 1 with a bonus in favor of the protocol.
            </p>
            <p className=" mt-2">
              <span className=" font-bold">Free transfers:</span> Users can
              freely send coins to each other, ensuring high liquidity and ease
              of use for the protocol.
            </p>
          </div>
        </div>
      </div>
      <div className=" w-full h-auto">
        <div className=" flex flex-col justify-center items-center mt-8">
          <h1 className=" text-5xl font-semibold rounded-xl p-6">
            User&apos;s guide to using protocol
          </h1>
        </div>
        <div className=" flex flex-col justify-center items-center ">
          <div className=" mt-10 bg-white text-black p-10 rounded-3xl shadow-md shadow-white">
            <div className=" mb-3">
              <h1 className=" text-center text-3xl font-medium">
                Step 1: Pledging
              </h1>
            </div>
            <p className=" font-medium text-lg">
              1. To start using the protocol, you need to pledge currency.
              <div className=" flex flex-row items-center justify-center space-x-8 text-blue-700 underline">
                <a
                  href="https://sepolia.etherscan.io/address/0xdd13E55209Fd76AfE204dBda4007C227904f0a81"
                  target="_blank"
                >
                  WETH
                </a>
                <a
                  href="https://sepolia.etherscan.io/token/0xae7c08f2fc56719b8f403c29f02e99cf809f8e34"
                  target="_blank"
                >
                  WBTC
                </a>
              </div>
              2. Check the current exchange rate and make sure you have enough
              assets to pledge.
            </p>
          </div>
          {/* // */}
          <div className=" mt-10 bg-white text-black p-10 rounded-3xl shadow-md shadow-white">
            <div className=" mb-3">
              <h1 className=" text-center text-3xl font-medium">
                Step 2: Purchase Coins
              </h1>
            </div>
            <p className=" font-medium text-lg">
              1. If you have sufficient collateral, you can purchase protocol
              coins. <br /> 2. Specify the number of coins you want to buy and
              confirm the transaction. <br /> 3. Receive your coins to your
              wallet.
            </p>
          </div>
          {/* // */}
          <div className=" mt-10 bg-white text-black p-10 rounded-3xl shadow-md shadow-white">
            <div className=" mb-3">
              <h1 className=" text-center text-3xl font-medium">
                Step 3: Create new coins (mining)
              </h1>
            </div>
            <p className=" font-medium text-lg">
              1. If you have available loans, you can use them to mine new
              coins. <br />
              2. Determine the number of new coins you want to create and start
              the minting process. <br /> 3. The new coins will be added to your
              balance.
            </p>
          </div>
          {/* // */}
          <div className=" mt-10 bg-white text-black p-10 rounded-3xl shadow-md shadow-white">
            <div className=" mb-3">
              <h1 className=" text-center text-3xl font-medium">
                Step 4: Sell your coins or return your deposit
              </h1>
            </div>
            <p className=" font-medium text-lg">
              1. If you need to return your pledge, you can burn (sell) your
              coins. <br />
              2. Specify the number of coins you want to sell and confirm the
              transaction. <br /> 3. The funds will be returned to you in the
              form of your pledge.
            </p>
          </div>
          {/* // */}
          <div className=" mt-10 bg-white text-black p-10 rounded-3xl shadow-md shadow-white">
            <div className=" mb-3">
              <h1 className=" text-center text-3xl font-medium">
                Step 5: Send coins to other users
              </h1>
            </div>
            <p className=" font-medium text-lg">
              1. You can easily and securely send coins to other users of the
              protocol. <br /> 2. Specify the recipient&apos;s address and the
              number of coins to send. <br /> 3. Confirm the transaction and the
              coins will be sent to the recipient.
            </p>
          </div>
          {/* // */}
          <div className=" mt-10 bg-white text-black p-10 rounded-3xl shadow-md shadow-white">
            <div className=" mb-3">
              <h1 className=" text-center text-3xl font-medium">
                Step 6: Refer to the elimination mechanism (if necessary)
              </h1>
            </div>
            <p className=" font-medium text-lg">
              1. The protocol automatically monitors the health factor of users.{" "}
              <br />
              2. If your health factor drops below 1 due to a change in the
              exchange rate of your pledged assets, liquidation will occur.{" "}
              <br />
              3. The liquidation is accompanied by a 10% bonus that goes to the
              protocol account.
            </p>
          </div>
          {/* // */}
          <div className=" mt-10 bg-white text-black p-10 rounded-3xl shadow-md shadow-white">
            <div className=" mb-3">
              <h1 className=" text-center text-3xl font-medium text-red-600">
                Remember:
              </h1>
            </div>
            <p className=" font-medium text-lg text-center">
              Always check the current rate and status of your deposit. <br />{" "}
              Be careful and responsible not to let your health factor drop
              below 1. <br /> Use the protocol for fast and secure money
              transactions.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
