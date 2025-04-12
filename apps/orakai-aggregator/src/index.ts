import { AddressLike, BytesLike, ethers } from 'ethers';
import { create } from 'ipfs-http-client';
import fetch from 'cross-fetch';

// Environment variables
const PRIVATE_KEY = Bun.env.PRIVATE_KEY;
const ORACLE_CONTRACT_ADDRESS = Bun.env.ORACLE_CONTRACT_ADDRESS;
const RPC_URL = Bun.env.RPC_URL;
const BACKEND_URL = Bun.env.BACKEND_URL || 'http://localhost:3000';
const IPFS_GATEWAY = Bun.env.IPFS_GATEWAY || 'https://ipfs.io/ipfs/';

// Initialize ethers provider and wallet
const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY!, provider);

// Initialize IPFS client
const ipfs = create({ url: IPFS_GATEWAY });

// Load contract ABI
const oracleABI = [{ "type": "constructor", "inputs": [{ "name": "_aggregator", "type": "address", "internalType": "address" }], "stateMutability": "nonpayable" }, { "type": "function", "name": "aggregator", "inputs": [], "outputs": [{ "name": "", "type": "address", "internalType": "address" }], "stateMutability": "view" }, { "type": "function", "name": "finaliseResponse", "inputs": [{ "name": "requestID", "type": "string", "internalType": "string" }, { "name": "validIndexes", "type": "uint256[]", "internalType": "uint256[]" }, { "name": "randSeed", "type": "uint256", "internalType": "uint256" }, { "name": "finalAnswer", "type": "bytes", "internalType": "bytes" }], "outputs": [], "stateMutability": "nonpayable" }, { "type": "function", "name": "getRequest", "inputs": [{ "name": "requestID", "type": "string", "internalType": "string" }], "outputs": [{ "name": "", "type": "tuple", "internalType": "struct OrakaiOracle.Request", "components": [{ "name": "requester", "type": "address", "internalType": "address" }, { "name": "queryID", "type": "string", "internalType": "string" }, { "name": "requestID", "type": "string", "internalType": "string" }, { "name": "callbackAddress", "type": "address", "internalType": "address" }, { "name": "timestamp", "type": "uint256", "internalType": "uint256" }, { "name": "finalized", "type": "bool", "internalType": "bool" }] }], "stateMutability": "view" }, { "type": "function", "name": "getResponses", "inputs": [{ "name": "requestID", "type": "string", "internalType": "string" }], "outputs": [{ "name": "", "type": "tuple[]", "internalType": "struct OrakaiOracle.Response[]", "components": [{ "name": "worker", "type": "address", "internalType": "address" }, { "name": "cid", "type": "string", "internalType": "string" }] }], "stateMutability": "view" }, { "type": "function", "name": "hasResponded", "inputs": [{ "name": "", "type": "bytes32", "internalType": "bytes32" }, { "name": "", "type": "address", "internalType": "address" }], "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }], "stateMutability": "view" }, { "type": "function", "name": "requestQuery", "inputs": [{ "name": "queryID", "type": "string", "internalType": "string" }, { "name": "requestID", "type": "string", "internalType": "string" }, { "name": "callbackAddress", "type": "address", "internalType": "address" }], "outputs": [], "stateMutability": "nonpayable" }, { "type": "function", "name": "requestTimeout", "inputs": [], "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }], "stateMutability": "view" }, { "type": "function", "name": "requests", "inputs": [{ "name": "", "type": "bytes32", "internalType": "bytes32" }], "outputs": [{ "name": "requester", "type": "address", "internalType": "address" }, { "name": "queryID", "type": "string", "internalType": "string" }, { "name": "requestID", "type": "string", "internalType": "string" }, { "name": "callbackAddress", "type": "address", "internalType": "address" }, { "name": "timestamp", "type": "uint256", "internalType": "uint256" }, { "name": "finalized", "type": "bool", "internalType": "bool" }], "stateMutability": "view" }, { "type": "function", "name": "responses", "inputs": [{ "name": "", "type": "bytes32", "internalType": "bytes32" }, { "name": "", "type": "uint256", "internalType": "uint256" }], "outputs": [{ "name": "worker", "type": "address", "internalType": "address" }, { "name": "cid", "type": "string", "internalType": "string" }], "stateMutability": "view" }, { "type": "function", "name": "submitResponse", "inputs": [{ "name": "requestID", "type": "string", "internalType": "string" }, { "name": "cid", "type": "string", "internalType": "string" }], "outputs": [], "stateMutability": "nonpayable" }, { "type": "function", "name": "updateAggregator", "inputs": [{ "name": "newAggregator", "type": "address", "internalType": "address" }], "outputs": [], "stateMutability": "nonpayable" }, { "type": "event", "name": "Finalised", "inputs": [{ "name": "reqHash", "type": "bytes32", "indexed": true, "internalType": "bytes32" }, { "name": "queryID", "type": "string", "indexed": false, "internalType": "string" }, { "name": "winner", "type": "address", "indexed": false, "internalType": "address" }, { "name": "answer", "type": "bytes", "indexed": false, "internalType": "bytes" }], "anonymous": false }, { "type": "event", "name": "RequestCreated", "inputs": [{ "name": "reqHash", "type": "bytes32", "indexed": true, "internalType": "bytes32" }, { "name": "requester", "type": "address", "indexed": false, "internalType": "address" }, { "name": "queryID", "type": "string", "indexed": false, "internalType": "string" }, { "name": "requestID", "type": "string", "indexed": false, "internalType": "string" }], "anonymous": false }, { "type": "event", "name": "ResponseSubmitted", "inputs": [{ "name": "reqHash", "type": "bytes32", "indexed": true, "internalType": "bytes32" }, { "name": "worker", "type": "address", "indexed": false, "internalType": "address" }, { "name": "cid", "type": "string", "indexed": false, "internalType": "string" }, { "name": "requestID", "type": "string", "indexed": false, "internalType": "string" }], "anonymous": false }]

// Create contract instance
const oracleContract = new ethers.Contract(ORACLE_CONTRACT_ADDRESS!, oracleABI, wallet);

// Track request states
interface RequestState {
  queryID: string;
  callbackAddress: string;
  responseCount: number;
  cids: string[];
  workers: string[];
}

const requestStates: Map<string, RequestState> = new Map();

// Function to validate output type
function validateOutputType(value: string, outputType: string): boolean {
  try {
    switch (outputType) {
      case "uint256":
        return ethers.toBigInt(value) >= BigInt(0);
      case "string":
        return typeof value === "string";
      case "bool":
        return value.toLowerCase() === "true" || value.toLowerCase() === "false";
      case "address":
        return ethers.isAddress(value);
      default:
        return false;
    }
  } catch (error) {
    return false;
  }
}

// Function to ABI encode the response
function encodeResponse(value: string, outputType: string): string {
  const abiCoder = new ethers.AbiCoder();
  switch (outputType) {
    case "uint256":
      return abiCoder.encode(["uint256"], [ethers.toBigInt(value)]);
    case "string":
      return abiCoder.encode(["string"], [value]);
    case "bool":
      return abiCoder.encode(["bool"], [value.toLowerCase() === "true"]);
    case "address":
      return abiCoder.encode(["address"], [ethers.getAddress(value)]);
    default:
      throw new Error(`Unsupported output type: ${outputType}`);
  }
}

// Function to fetch query details from backend
async function fetchQueryDetails(queryID: string) {
  const response = await fetch(`${BACKEND_URL}/api/queries/${queryID}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch query details: ${response.statusText}`);
  }
  const data = await response.json();
  return data.query;
}

// Function to fetch response from IPFS
async function fetchResponseFromIPFS(cid: string) {
  try {
    const response = await fetch(`https://${cid}.ipfs.w3s.link`);
    if (!response.ok) {
      throw new Error(`Failed to fetch from IPFS: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching from IPFS ${cid}:`, error);
    return null;
  }
}

// Function to process responses for a request
async function processResponses(requestID: string) {
  console.log(`Processing responses for request ${requestID}`);
  const state = requestStates.get(requestID);
  if (!state) {
    console.log(`No state found for request ${requestID}`);
    return;
  }
  // if (!state || state.responseCount < 2) {
  //   return;
  // }

  try {
    console.log(`State found for request ${requestID}`);
    // Get query details
    const queryDetails = await fetchQueryDetails(state.queryID);
    const { outputType } = queryDetails;
    console.log(`Query details found for request ${requestID}`);

    // Fetch and validate all responses
    const validResponses: { cid: string; response: any }[] = [];
    for (const cid of state.cids) {
      const response = await fetchResponseFromIPFS(cid);
      if (response && validateOutputType(response.response, outputType)) {
        validResponses.push({ cid, response });
      }
    }
    console.log(`Valid responses found for request ${requestID}`);
    if (validResponses.length === 0) {
      console.log(`No valid responses found for request ${requestID}`);
      return;
    }

    // Pick a random response
    const randomIndex = Math.floor(Math.random() * validResponses.length);
    const selectedResponse = validResponses[randomIndex];

    // Encode the response
    const calldata = encodeResponse(selectedResponse.response.response, outputType);
    console.log(`Calldata found for request ${requestID}`);
    // Get the indexes of valid responses
    const validIndexes = validResponses.map((_, index) => index);

    // Generate a random seed
    const randSeed = ethers.toBigInt(ethers.randomBytes(32));

    // Finalize the response
    const tx = await oracleContract.finaliseResponse(
      requestID,
      validIndexes,
      randSeed,
      calldata
    );
    await tx.wait();

    console.log(`Successfully finalized request ${requestID} with CID ${selectedResponse.cid}`);
  } catch (error) {
    console.error(`Error processing responses for request ${requestID}:`, error);
  }
}

// Main function to start the aggregator
async function startAggregator() {
  console.log('Starting Orakai aggregator...');

  // Listen for RequestCreated events
  oracleContract.on("RequestCreated", async (reqHash: BytesLike, requester: AddressLike, queryID: string, requestID: string) => {
    console.log(`New query requested: ${queryID} with requestID: ${requestID} from ${requester}`);

    // Initialize request state
    const [_, __, ___, callbackAddress] = await oracleContract.getRequest(requestID);
    requestStates.set(requestID, {
      queryID,
      callbackAddress,
      responseCount: 0,
      cids: [],
      workers: []
    });
  });

  // Listen for ResponseSubmitted events
  oracleContract.on("ResponseSubmitted", async (reqHash: BytesLike, worker: string, cid: string, requestID: string) => {
    console.log(`New response submitted for request ${requestID} from ${worker} with CID ${cid}`);

    const state = requestStates.get(requestID);
    if (state) {
      state.responseCount = state.responseCount + 1;
      state.cids.push(cid);
      state.workers.push(worker);

      await processResponses(requestID);

      // Process responses if we have enough
      // debug temporarily one one worker
      // if (state.responseCount == 1) {
      //   await processResponses(requestID);
      // }
    }
  });

  console.log('Aggregator started and listening for events...');
}

// Start the aggregator
startAggregator().catch(console.error); 