import React, { useState } from "react";
import connectWallet from "./ethereum";

export default function App() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [fuelToken, setFuelToken] = useState(null);
  const [hydrogenSystem, setHydrogenSystem] = useState(null);
  const [balances, setBalances] = useState({ water: 0, electricity: 0, hydrogen: 0, fuel: 0 });

  const [mintAmount, setMintAmount] = useState(0);
  const [produceAmount, setProduceAmount] = useState(0);
  const [sellAmount, setSellAmount] = useState(0);
  const [sellTo, setSellTo] = useState("");
  const [burnAmount, setBurnAmount] = useState(0);

  const handleConnectWallet = async () => {
    const { signer, fuelToken, hydrogenSystem } = await connectWallet();
    const address = await signer.getAddress();
    setWalletAddress(address);
    setFuelToken(fuelToken);
    setHydrogenSystem(hydrogenSystem);
  };

  const fetchBalances = async () => {
    if (!hydrogenSystem || !walletAddress) return;
    const [water, electricity, hydrogen, fuel] = await hydrogenSystem.getBalances(walletAddress);
    setBalances({
      water: water.toString(),
      electricity: electricity.toString(),
      hydrogen: hydrogen.toString(),
      fuel: fuel.toString(),
    });
  };

  const mintWater = async () => {
    await hydrogenSystem.mintWater(mintAmount);
    fetchBalances();
  };

  const mintElectricity = async () => {
    await hydrogenSystem.mintElectricity(mintAmount);
    fetchBalances();
  };

  const produceHydrogen = async () => {
    alert("Hydrogen produced");
    await hydrogenSystem.produceHydrogen(produceAmount);
    fetchBalances();
  };
  

  const sellHydrogen = async () => {
    const cleanedAddress = sellTo.trim();
  
    // Validate address
    if (!ethers.isAddress(cleanedAddress)) {
      alert("Invalid Ethereum address");
      return;
    }
  
    await fuelToken.approve(hydrogenSystem.address, ethers.parseUnits("1000000", 18));
    await hydrogenSystem.sellHydrogen(cleanedAddress, sellAmount);
    fetchBalances();
  };
  
  // const sellHydrogen = async () => {
  //   alert("Points rewarded - 10");
  // };
  
  

  const burnHydrogen = async () => {
    await hydrogenSystem.burnHydrogen(burnAmount);
    fetchBalances();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-8">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">Hydrogen Fuel Blockchain</h1>

      {!walletAddress ? (
        <button
          onClick={handleConnectWallet}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-600 transition"
        >
          Connect Wallet
        </button>
      ) : (
        <>
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg">
            <h2 className="text-xl font-semibold mb-4">Wallet: {walletAddress}</h2>
            <div className="space-y-2">
              <p>💧 Water Balance: {balances.water}</p>
              <p>⚡ Electricity Balance: {balances.electricity}</p>
              <p>🫧 Hydrogen Balance: {balances.hydrogen}</p>
              <p>🪙 FuelToken Balance: {balances.fuel}</p>
              <button onClick={fetchBalances} className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-4">Refresh Balances</button>
            </div>
          </div>

          <div className="flex flex-wrap gap-6 mt-8">
            <div className="bg-white p-6 rounded-lg shadow-md w-72">
              <h3 className="text-lg font-semibold mb-2">Mint Resources</h3>
              <input type="number" className="border p-2 w-full mb-2" placeholder="Amount" onChange={(e) => setMintAmount(e.target.value)} />
              <button onClick={mintWater} className="bg-blue-400 text-white px-4 py-2 rounded mb-2 w-full">Mint Water</button>
              <button onClick={mintElectricity} className="bg-yellow-400 text-white px-4 py-2 rounded w-full">Mint Electricity</button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md w-72">
              <h3 className="text-lg font-semibold mb-2">Produce Hydrogen</h3>
              <input type="number" className="border p-2 w-full mb-2" placeholder="Kg" onChange={(e) => setProduceAmount(e.target.value)} />
              <button onClick={produceHydrogen} className="bg-green-500 text-white px-4 py-2 rounded w-full">Produce</button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md w-72">
              <h3 className="text-lg font-semibold mb-2">Sell Hydrogen</h3>
              <input type="text" className="border p-2 w-full mb-2" placeholder="Buyer Address"  onChange={(e) => setSellTo(e.target.value.trim())} />
              <input type="number" className="border p-2 w-full mb-2" placeholder="Amount" onChange={(e) => setSellAmount(e.target.value)} />
              <button onClick={sellHydrogen} className="bg-purple-500 text-white px-4 py-2 rounded w-full">Sell</button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md w-72">
              <h3 className="text-lg font-semibold mb-2">Burn Hydrogen</h3>
              <input type="number" className="border p-2 w-full mb-2" placeholder="Kg" onChange={(e) => setBurnAmount(e.target.value)} />
              <button onClick={burnHydrogen} className="bg-red-500 text-white px-4 py-2 rounded w-full">Burn</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
