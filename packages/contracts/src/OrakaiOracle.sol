// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IOrakaiCallback {
    function OrakaiCallback(string calldata requestID, bytes calldata result) external;
}

contract OrakaiOracle {
    struct Request {
        address requester;
        string queryID;
        string requestID;
        address callbackAddress;
        uint256 timestamp;
        bool finalized;
    }

    struct Response {
        address worker;
        string cid;
    }

    mapping(bytes32 => Request) public requests;
    mapping(bytes32 => Response[]) public responses;
    mapping(bytes32 => mapping(address => bool)) public hasResponded;

    address public aggregator;
    uint256 public requestTimeout = 1 hours;

    event RequestCreated(bytes32 indexed reqHash, address requester, string queryID, string requestID);
    event ResponseSubmitted(bytes32 indexed reqHash, address worker, string cid, string requestID);
    event Finalised(bytes32 indexed reqHash, string queryID, address winner, bytes answer);

    modifier onlyAggregator() {
        require(msg.sender == aggregator, "Not authorized");
        _;
    }

    constructor(address _aggregator) {
        aggregator = _aggregator;
    }

    function requestQuery(
        string memory queryID,
        string memory requestID,
        address callbackAddress
    ) external {
        bytes32 reqHash = keccak256(abi.encodePacked(requestID));
        require(requests[reqHash].timestamp == 0, "Request already exists");

        requests[reqHash] = Request({
            requester: msg.sender,
            queryID: queryID,
            requestID: requestID,
            callbackAddress: callbackAddress,
            timestamp: block.timestamp,
            finalized: false
        });

        emit RequestCreated(reqHash, msg.sender, queryID, requestID);
    }

    function submitResponse(
        string memory requestID,
        string memory cid
    ) external {
        bytes32 reqHash = keccak256(abi.encodePacked(requestID));
        require(!requests[reqHash].finalized, "Request finalized");
        require(!hasResponded[reqHash][msg.sender], "Worker already responded");

        responses[reqHash].push(Response({
            worker: msg.sender,
            cid: cid
        }));

        hasResponded[reqHash][msg.sender] = true;

        emit ResponseSubmitted(reqHash, msg.sender, cid, requestID);
    }

    function finaliseResponse(
        string memory requestID,
        uint256[] calldata validIndexes,
        uint256 randSeed,
        bytes memory finalAnswer
    ) external onlyAggregator {
        bytes32 reqHash = keccak256(abi.encodePacked(requestID));
        Request storage req = requests[reqHash];

        require(!req.finalized, "Already finalized");
        //debug: change to two for minimum consensus
        require(validIndexes.length >= 1, "Insufficient consensus responses");
        require(block.timestamp <= req.timestamp + requestTimeout, "Request expired");

        uint256 winnerIndex = validIndexes[randSeed % validIndexes.length];
        address winner = responses[reqHash][winnerIndex].worker;

        // Mark as finalized
        req.finalized = true;

        // Call the consumer contract
        IOrakaiCallback(req.callbackAddress).OrakaiCallback(requestID, finalAnswer);

        emit Finalised(reqHash, req.queryID, winner, finalAnswer);
    }

    function getRequest(string memory requestID) external view returns (Request memory) {
        bytes32 reqHash = keccak256(abi.encodePacked(requestID));
        return requests[reqHash];
    }

    function getResponses(string memory requestID) external view returns (Response[] memory) {
        bytes32 reqHash = keccak256(abi.encodePacked(requestID));
        return responses[reqHash];
    }

    function updateAggregator(address newAggregator) external {
        // Can add auth later
        aggregator = newAggregator;
    }
}