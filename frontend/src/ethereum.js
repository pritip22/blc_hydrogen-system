import { ethers } from "ethers";
import FuelTokenABI from "./abis/FuelToken.json";
import HydrogenFuelSystemABI from "./abis/HydrogenFuelSystem.json";

// Put your actual deployed addresses
const fuelTokenAddress = "0x5a2990163b02d40c8De74888448FE55e88296DF1";
const hydrogenSystemAddress = "0xEfd9033DAE846935925338eDCec7E60aDF5669C2";

let provider;
let signer;
let fuelToken;
let hydrogenSystem;

const connectWallet = async () => {
  if (!window.ethereum) {
    alert("Please install MetaMask!");
    return;
  }
  
  provider = new ethers.BrowserProvider(window.ethereum);

  // Request account access to trigger MetaMask popup
  await window.ethereum.request({ method: "eth_requestAccounts" });
  signer = await provider.getSigner();

  fuelToken = new ethers.Contract(fuelTokenAddress, FuelTokenABI.abi, signer);
  hydrogenSystem = new ethers.Contract(hydrogenSystemAddress, HydrogenFuelSystemABI.abi, signer);

  return { provider, signer, fuelToken, hydrogenSystem };
};

export default connectWallet;
