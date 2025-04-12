// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "../src/OrakaiOracle.sol";

contract MockConsumer is IOrakaiCallback {
    string public lastRequestID;
    bytes public lastResult;
    bool public callbackReceived;

    function OrakaiCallback(string calldata requestID, bytes calldata result) external override {
        lastRequestID = requestID;
        lastResult = result;
        callbackReceived = true;
    }
}

contract OrakaiConsumerTest is Test {
    OrakaiOracle public oracle;
    MockConsumer public consumer;
    address public aggregator = address(1);
    address public worker1 = address(2);
    address public worker2 = address(3);
    address public worker3 = address(4);

    function setUp() public {
        oracle = new OrakaiOracle(aggregator);
        consumer = new MockConsumer();
    }

    function test_ConsumerCallback() public {
        // Create request
        string memory queryID = "price-eth-usd";
        string memory requestID = "req-1";
        vm.prank(address(consumer));
        oracle.requestQuery(queryID, requestID, address(consumer));

        // Submit multiple responses
        vm.prank(worker1);
        oracle.submitResponse(requestID, "Qm123");
        vm.prank(worker2);
        oracle.submitResponse(requestID, "Qm456");
        vm.prank(worker3);
        oracle.submitResponse(requestID, "Qm789");

        // Finalize with valid indexes
        uint256[] memory validIndexes = new uint256[](3);
        validIndexes[0] = 0;
        validIndexes[1] = 1;
        validIndexes[2] = 2;
        uint256 randSeed = 123;
        bytes memory finalAnswer = abi.encode(uint256(2000));

        vm.prank(aggregator);
        oracle.finaliseResponse(requestID, validIndexes, randSeed, finalAnswer);

        // Verify callback was received
        assertTrue(consumer.callbackReceived());
        assertEq(consumer.lastRequestID(), requestID);
        assertEq(consumer.lastResult(), finalAnswer);
    }

    function test_ConsumerCallbackWithDifferentResultType() public {
        // Create request
        string memory queryID = "sentiment-analysis";
        string memory requestID = "req-2";
        vm.prank(address(consumer));
        oracle.requestQuery(queryID, requestID, address(consumer));

        // Submit multiple responses
        vm.prank(worker1);
        oracle.submitResponse(requestID, "Qm123");
        vm.prank(worker2);
        oracle.submitResponse(requestID, "Qm456");
        vm.prank(worker3);
        oracle.submitResponse(requestID, "Qm789");

        // Finalize with string result
        uint256[] memory validIndexes = new uint256[](3);
        validIndexes[0] = 0;
        validIndexes[1] = 1;
        validIndexes[2] = 2;
        uint256 randSeed = 123;
        bytes memory finalAnswer = abi.encode("Positive");

        vm.prank(aggregator);
        oracle.finaliseResponse(requestID, validIndexes, randSeed, finalAnswer);

        // Verify callback was received
        assertTrue(consumer.callbackReceived());
        assertEq(consumer.lastRequestID(), requestID);
        assertEq(consumer.lastResult(), finalAnswer);
    }
} 