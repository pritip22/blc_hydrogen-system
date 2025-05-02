// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract HydrogenFuelSystem {
    address public admin;
    IERC20 public fuelToken;

    mapping(address => uint256) public waterBalance;
    mapping(address => uint256) public electricityBalance;
    mapping(address => uint256) public hydrogenBalance;

    uint256 public hydrogenProductionReward = 5 * 10 ** 18; // 5 FUEL tokens reward per hydrogen produced
    uint256 public hydrogenSalePrice = 10 * 10 ** 18;        // 10 FUEL tokens price per kg hydrogen

    event WaterMinted(address indexed by, uint256 amount);
    event ElectricityMinted(address indexed by, uint256 amount);
    event HydrogenProduced(address indexed by, uint256 amount);
    event HydrogenSold(address indexed seller, address buyer, uint256 amount, uint256 price);
    event HydrogenBurned(address indexed user, uint256 amount);

    constructor(IERC20 _fuelToken) {
        admin = msg.sender;
        fuelToken = _fuelToken;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this");
        _;
    }

    function mintWater(uint256 amount) external {
        require(amount > 0, "Amount must be > 0");
        waterBalance[msg.sender] += amount;
        emit WaterMinted(msg.sender, amount);
    }

    function mintElectricity(uint256 amount) external {
        require(amount > 0, "Amount must be > 0");
        electricityBalance[msg.sender] += amount;
        emit ElectricityMinted(msg.sender, amount);
    }

    function produceHydrogen(uint256 kg) external {
        uint256 requiredWater = kg * 11;
        uint256 requiredElectricity = kg * 55;

        require(waterBalance[msg.sender] >= requiredWater, "Not enough water");
        require(electricityBalance[msg.sender] >= requiredElectricity, "Not enough electricity");

        waterBalance[msg.sender] -= requiredWater;
        electricityBalance[msg.sender] -= requiredElectricity;
        hydrogenBalance[msg.sender] += kg;

        bool success = fuelToken.transfer(msg.sender, hydrogenProductionReward * kg);
        require(success, "FuelToken reward transfer failed");

        emit HydrogenProduced(msg.sender, kg);

    }

    function sellHydrogen(address buyer, uint256 kg) external {
        require(hydrogenBalance[msg.sender] >= kg, "Not enough hydrogen");

        uint256 totalPrice = hydrogenSalePrice * kg;

        require(fuelToken.transferFrom(buyer, msg.sender, totalPrice), "Payment failed");

        hydrogenBalance[msg.sender] -= kg;
        hydrogenBalance[buyer] += kg;

        emit HydrogenSold(msg.sender, buyer, kg, totalPrice);
    }

    function burnHydrogen(uint256 kg) external {
        require(hydrogenBalance[msg.sender] >= kg, "Not enough hydrogen to burn");
        hydrogenBalance[msg.sender] -= kg;

        emit HydrogenBurned(msg.sender, kg);
    }

    function getBalances(address user) external view returns (uint256 water, uint256 electricity, uint256 hydrogen, uint256 fuelTokens) {
        return (
            waterBalance[user],
            electricityBalance[user],
            hydrogenBalance[user],
            fuelToken.balanceOf(user)
        );
    }
}
