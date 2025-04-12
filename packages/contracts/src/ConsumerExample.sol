// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./IOrakaiOracle.sol";
import "./OrakaiOracle.sol";

contract ConsumerExample is IOrakaiCallback {
    address public oracle;
    string public latestRequestID;
    string public latestTranslation;
    string public initialPhrase;

    event CallbackReceived(string requestID, string translation);

    constructor(address _oracle) {
        oracle = _oracle;
        initialPhrase = "hi";
    }

    function makeQuery(string calldata queryID, string calldata requestID) external {
        latestRequestID = requestID;
        IOrakai(oracle).requestQuery(queryID, requestID, address(this));
    }

    function OrakaiCallback(string calldata requestID, bytes calldata result) external override {
        require(msg.sender == oracle, "Unauthorized oracle");
        string memory decoded = abi.decode(result, (string));
        latestTranslation = decoded;
        emit CallbackReceived(requestID, decoded);
    }

    function getLatestTranslation() external view returns (string memory) {
        return latestTranslation;
    }

    function getInitialPhrase() external view returns (string memory) {
        return initialPhrase;
    }
}
