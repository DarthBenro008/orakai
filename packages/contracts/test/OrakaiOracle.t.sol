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

contract OrakaiOracleTest is Test {
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

    function test_RequestQuery() public {
        string memory queryID = "price-eth-usd";
        string memory requestID = "req-1";
        
        vm.prank(address(consumer));
        oracle.requestQuery(queryID, requestID, address(consumer));

        bytes32 reqHash = keccak256(abi.encodePacked(requestID));
        OrakaiOracle.Request memory req = oracle.getRequest(requestID);

        assertEq(req.requester, address(consumer));
        assertEq(req.queryID, queryID);
        assertEq(req.requestID, requestID);
        assertEq(req.callbackAddress, address(consumer));
        assertFalse(req.finalized);
    }

    function test_SubmitResponse() public {
        // First create a request
        string memory queryID = "price-eth-usd";
        string memory requestID = "req-1";
        vm.prank(address(consumer));
        oracle.requestQuery(queryID, requestID, address(consumer));

        // Submit response from worker
        string memory cid = "Qm123";
        vm.prank(worker1);
        oracle.submitResponse(requestID, cid);

        OrakaiOracle.Response[] memory responses = oracle.getResponses(requestID);
        assertEq(responses.length, 1);
        assertEq(responses[0].worker, worker1);
        assertEq(responses[0].cid, cid);
    }

    function test_FinalizeResponse() public {
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
        uint256[] memory validIndexes = new uint256[](2);
        validIndexes[0] = 0;
        validIndexes[1] = 1;
        uint256 randSeed = 123;
        bytes memory finalAnswer = abi.encode(uint256(2000));

        vm.prank(aggregator);
        oracle.finaliseResponse(requestID, validIndexes, randSeed, finalAnswer);

        // Verify request is finalized
        OrakaiOracle.Request memory req = oracle.getRequest(requestID);
        assertTrue(req.finalized);
        
        // Verify callback was received
        assertTrue(consumer.callbackReceived());
        assertEq(consumer.lastRequestID(), requestID);
        assertEq(consumer.lastResult(), finalAnswer);
    }

    function test_RevertIfNotAggregator() public {
        string memory requestID = "req-1";
        uint256[] memory validIndexes = new uint256[](1);
        validIndexes[0] = 0;
        uint256 randSeed = 123;
        bytes memory finalAnswer = abi.encode(uint256(2000));

        vm.expectRevert("Not authorized");
        oracle.finaliseResponse(requestID, validIndexes, randSeed, finalAnswer);
    }

    function test_RevertIfRequestExpired() public {
        // Create request
        string memory queryID = "price-eth-usd";
        string memory requestID = "req-1";
        vm.prank(address(consumer));
        oracle.requestQuery(queryID, requestID, address(consumer));

        // Submit enough responses first
        vm.prank(worker1);
        oracle.submitResponse(requestID, "Qm123");
        vm.prank(worker2);
        oracle.submitResponse(requestID, "Qm456");

        // Warp time past timeout
        vm.warp(block.timestamp + 2 hours);

        uint256[] memory validIndexes = new uint256[](2);
        validIndexes[0] = 0;
        validIndexes[1] = 1;
        uint256 randSeed = 123;
        bytes memory finalAnswer = abi.encode(uint256(2000));

        vm.prank(aggregator);
        vm.expectRevert("Request expired");
        oracle.finaliseResponse(requestID, validIndexes, randSeed, finalAnswer);
    }

    function test_RevertIfInsufficientConsensus() public {
        // Create request
        string memory queryID = "price-eth-usd";
        string memory requestID = "req-1";
        vm.prank(address(consumer));
        oracle.requestQuery(queryID, requestID, address(consumer));

        // Submit only one response
        vm.prank(worker1);
        oracle.submitResponse(requestID, "Qm123");

        uint256[] memory validIndexes = new uint256[](1);
        validIndexes[0] = 0;
        uint256 randSeed = 123;
        bytes memory finalAnswer = abi.encode(uint256(2000));

        vm.prank(aggregator);
        vm.expectRevert("Insufficient consensus responses");
        oracle.finaliseResponse(requestID, validIndexes, randSeed, finalAnswer);
    }
} 