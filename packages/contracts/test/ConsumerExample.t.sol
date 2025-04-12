// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "../src/ConsumerExample.sol";
import "../src/OrakaiOracle.sol";

contract ConsumerExampleTest is Test {
    OrakaiOracle public oracle;
    ConsumerExample public consumer;
    address public aggregator = address(1);
    address public worker1 = address(2);
    address public worker2 = address(3);
    address public worker3 = address(4);

    function setUp() public {
        oracle = new OrakaiOracle(aggregator);
        consumer = new ConsumerExample(address(oracle));
    }

    function test_MakeQuery() public {
        string memory queryID = "translate-en-fr";
        string memory requestID = "req-1";
        
        // Make a query
        consumer.makeQuery(queryID, requestID);
        
        
        // Verify the request was created in the oracle
        OrakaiOracle.Request memory req = oracle.getRequest(requestID);
        assertEq(req.requester, address(consumer));
        assertEq(req.queryID, queryID);
        assertEq(req.requestID, requestID);
        assertEq(req.callbackAddress, address(consumer));
        assertFalse(req.finalized);
    }

    function test_ReceiveCallback() public {
        string memory queryID = "translate-en-fr";
        string memory requestID = "req-1";
        
        // Make a query
        consumer.makeQuery(queryID, requestID);
        
        // Submit responses
        vm.prank(worker1);
        oracle.submitResponse(requestID, "Qm123");
        vm.prank(worker2);
        oracle.submitResponse(requestID, "Qm456");
        vm.prank(worker3);
        oracle.submitResponse(requestID, "Qm789");

        // Prepare final answer
        string memory translation = "bonjour";
        bytes memory finalAnswer = abi.encode(translation);
        uint256[] memory validIndexes = new uint256[](3);
        validIndexes[0] = 0;
        validIndexes[1] = 1;
        validIndexes[2] = 2;
        uint256 randSeed = 123;

        // Finalize the response
        vm.prank(aggregator);
        oracle.finaliseResponse(requestID, validIndexes, randSeed, finalAnswer);

        // Verify the callback was received
        assertEq(consumer.latestTranslation(), translation);
    }

    function test_GetInitialPhrase() public {
        assertEq(consumer.getInitialPhrase(), "hi");
    }

    function test_RevertIfNotOracle() public {
        string memory requestID = "req-1";
        bytes memory result = abi.encode("bonjour");
        
        // Try to call callback from non-oracle address
        vm.expectRevert("Unauthorized oracle");
        consumer.OrakaiCallback(requestID, result);
    }
} 