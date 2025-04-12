// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IOrakai {
    /// @notice Requests a query to be fulfilled
    /// @param queryID The ID associated with the query
    /// @param requestID The user-generated unique identifier for this specific request
    /// @param callbackAddress The contract address where the callback should be made
    function requestQuery(
        string calldata queryID,
        string calldata requestID,
        address callbackAddress
    ) external;

    /// @notice Submits a worker's response for a specific request
    /// @param requestID The request ID this response is for
    /// @param cid The IPFS CID pointing to the full response data
    function submitResponse(
        string calldata requestID,
        string calldata cid
    ) external;

    /// @notice Called by aggregator to finalize the result and trigger callback
    /// @param requestID The ID of the request being finalized
    /// @param validIndexes The indexes of valid responses as per consensus
    /// @param randSeed Random seed to pick the winning response
    /// @param finalAnswer ABI-encoded result data
    function finaliseResponse(
        string calldata requestID,
        uint256[] calldata validIndexes,
        uint256 randSeed,
        bytes calldata finalAnswer
    ) external;

    /// @notice Fetches the metadata for a given request
    /// @param requestID The request ID to look up
    function getRequest(string calldata requestID)
        external
        view
        returns (
            address requester,
            string memory queryID,
            string memory requestID_,
            address callbackAddress,
            uint256 timestamp,
            bool finalized
        );

    /// @notice Fetches all responses submitted for a request
    /// @param requestID The request ID to look up
    function getResponses(string calldata requestID)
        external
        view
        returns (address[] memory workers, string[] memory cids);
}
