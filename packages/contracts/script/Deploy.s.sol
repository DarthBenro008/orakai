// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../src/OrakaiOracle.sol";
import "../src/ConsumerExample.sol";

contract DeployScript is Script {
    function run() external {
        // Get the private key from the environment
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Deploy the oracle contract
        address aggregator = vm.envAddress("AGGREGATOR_ADDRESS");
        OrakaiOracle oracle = new OrakaiOracle(aggregator);
        console.log("OrakaiOracle deployed at:", address(oracle));

        // Deploy the consumer contract
        ConsumerExample consumer = new ConsumerExample(address(oracle));
        console.log("ConsumerExample deployed at:", address(consumer));

        vm.stopBroadcast();
    }
} 