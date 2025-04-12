// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./OrakaiOracle.sol";

contract OrakaiConsumer is IOrakaiCallback {
    OrakaiOracle public oracle;
    string public lastRequestID;
    bytes public lastResult;
    bool public callbackReceived;

    event QueryResult(string requestID, bytes result);

    constructor(address _oracle) {
        oracle = OrakaiOracle(_oracle);
    }

    function requestPriceQuery(string memory requestID) external {
        string memory queryID = "price-eth-usd";
        oracle.requestQuery(queryID, requestID, address(this));
    }

    function OrakaiCallback(string calldata requestID, bytes calldata result) external override {
        require(msg.sender == address(oracle), "Only oracle can callback");
        lastRequestID = requestID;
        lastResult = result;
        callbackReceived = true;
        emit QueryResult(requestID, result);
    }

    function getLastResultAsUint() external view returns (uint256) {
        require(callbackReceived, "No result received yet");
        return abi.decode(lastResult, (uint256));
    }
} 