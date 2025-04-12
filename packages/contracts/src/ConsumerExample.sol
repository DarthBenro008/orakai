// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./IOrakaiOracle.sol";

interface IOrakaiCallback {
    function OrakaiCallback(string calldata requestID, bytes calldata result) external;
}

contract ConsumerExample is IOrakaiCallback {
    address public oracle;
    string public latestRequestID;
    uint256 public latestResponse;

    event CallbackReceived(string requestID, uint256 response);

    constructor(address _oracle) {
        oracle = _oracle;
    }

    function makeQuery() external {
        latestRequestID = string(abi.encodePacked("req-", block.timestamp));
        IOrakai(oracle).requestQuery("146", latestRequestID, address(this));
    }

    function OrakaiCallback(string calldata requestID, bytes calldata result) external override {
        require(msg.sender == oracle, "Unauthorized oracle");
        uint256 decoded = abi.decode(result, (uint256));
        latestResponse = decoded;
        emit CallbackReceived(requestID, decoded);
    }

    function getLatestResponse() external view returns (uint256) {
        return latestResponse;
    }
}
