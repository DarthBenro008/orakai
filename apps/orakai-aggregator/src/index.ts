import { ethers } from 'ethers';
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
const oracleABI = [
  "function requestQuery(string queryID, string requestID, address callbackAddress) external",
  "function submitResponse(string requestID, string cid) external",
  "function finaliseResponse(string requestID, uint256[] validIndexes, uint256 randSeed, bytes calldata) external",
  "function getRequest(string requestID) external view returns (address, string, string, address, uint256, bool)",
  "function getResponses(string requestID) external view returns (address[] workers, string[] cids)",
  "event QueryRequested(string indexed queryID, string indexed requestID, address indexed sender)",
  "event ResponseSubmitted(string indexed requestID, address indexed worker, string indexed cid)"
];

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
    const response = await fetch(`${IPFS_GATEWAY}${cid}`);
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
  const state = requestStates.get(requestID);
  if (!state || state.responseCount < 2) {
    return;
  }

  try {
    // Get query details
    const queryDetails = await fetchQueryDetails(state.queryID);
    const { outputType } = queryDetails;

    // Fetch and validate all responses
    const validResponses: { cid: string; response: any }[] = [];
    for (const cid of state.cids) {
      const response = await fetchResponseFromIPFS(cid);
      if (response && validateOutputType(response.response, outputType)) {
        validResponses.push({ cid, response });
      }
    }

    if (validResponses.length === 0) {
      console.log(`No valid responses found for request ${requestID}`);
      return;
    }

    // Pick a random response
    const randomIndex = Math.floor(Math.random() * validResponses.length);
    const selectedResponse = validResponses[randomIndex];

    // Encode the response
    const calldata = encodeResponse(selectedResponse.response.response, outputType);

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

  // Listen for QueryRequested events
  oracleContract.on("QueryRequested", async (queryID: string, requestID: string, sender: string) => {
    console.log(`New query requested: ${queryID} with requestID: ${requestID} from ${sender}`);
    
    // Initialize request state
    const [requester, _, __, callbackAddress] = await oracleContract.getRequest(requestID);
    requestStates.set(requestID, {
      queryID,
      callbackAddress,
      responseCount: 0,
      cids: [],
      workers: []
    });
  });

  // Listen for ResponseSubmitted events
  oracleContract.on("ResponseSubmitted", async (requestID: string, worker: string, cid: string) => {
    console.log(`New response submitted for request ${requestID} from ${worker} with CID ${cid}`);
    
    const state = requestStates.get(requestID);
    if (state) {
      state.responseCount++;
      state.cids.push(cid);
      state.workers.push(worker);
      
      // Process responses if we have enough
      // debug temporarily one one worker
      if (state.responseCount === 1) {
        await processResponses(requestID);
      }
    }
  });

  console.log('Aggregator started and listening for events...');
}

// Start the aggregator
startAggregator().catch(console.error); 