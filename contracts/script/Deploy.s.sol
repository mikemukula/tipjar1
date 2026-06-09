// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {TipJarRegistry} from "../src/TipJarRegistry.sol";

contract DeployTipJarRegistry is Script {
    // GoodDollar G$ token on Celo Mainnet
    address constant G_DOLLAR_MAINNET = 0x62B8b11039fcfe5Ab0c56E502B1c372a3d2a9C14;

    // GoodDollar G$ token on Celo Alfajores Testnet
    address constant G_DOLLAR_ALFAJORES = 0x03d3daB843e6c03b3d271eff9178e6A96c28D25f;

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("DEPLOYER_PRIVATE_KEY_HEX");
        address gDollar = block.chainid == 42220
            ? G_DOLLAR_MAINNET
            : G_DOLLAR_ALFAJORES;

        vm.startBroadcast(deployerPrivateKey);

        TipJarRegistry registry = new TipJarRegistry(gDollar);

        console.log("TipJarRegistry deployed to:", address(registry));
        console.log("G$ token address:", gDollar);
        console.log("Owner:", registry.owner());
        console.log("Chain ID:", block.chainid);

        vm.stopBroadcast();
    }
}
