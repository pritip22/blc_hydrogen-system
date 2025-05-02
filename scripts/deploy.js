const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  // Deploy FuelToken
  const FuelToken = await ethers.getContractFactory("FuelToken");
  const fuelToken = await FuelToken.deploy();
  await fuelToken.waitForDeployment();
  console.log("FuelToken deployed to:", await fuelToken.getAddress());

  // Deploy HydrogenFuelSystem with FuelToken address
  const HydrogenFuelSystem = await ethers.getContractFactory("HydrogenFuelSystem");
  const hydrogenSystem = await HydrogenFuelSystem.deploy(await fuelToken.getAddress());
  await hydrogenSystem.waitForDeployment();
  console.log("HydrogenFuelSystem deployed to:", await hydrogenSystem.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
  
