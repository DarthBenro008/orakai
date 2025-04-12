import { ethers } from 'ethers';
import OpenAI from 'openai';
import * as Client from '@web3-storage/w3up-client';
import { StoreMemory } from '@web3-storage/w3up-client/stores/memory';
import { Signer } from '@web3-storage/w3up-client/principal/ed25519';
import * as Proof from '@web3-storage/w3up-client/proof';

// Environment variables
const PRIVATE_KEY = Bun.env.PRIVATE_KEY;
const OPENAI_API_KEY = Bun.env.OPENAI_API_KEY;
const ORACLE_CONTRACT_ADDRESS = Bun.env.ORACLE_CONTRACT_ADDRESS;
const RPC_URL = Bun.env.RPC_URL;
const DELEGATION_PROOF = "mAYIEAMogEaJlcm9vdHOAZ3ZlcnNpb24B1QYBcRIg9yzJQ/VtA/z3e+nra9ubOxWFmh46m/MbAEZisUAH8H6oYXNYRO2hA0DFt9REZ7WN2gSUtnQVD7XMmPT+jZoK+OzhWyWuMESH3GmsXfRDHpT9LGHu1hITsqv0Q0ccuOGD2jvyJfyUfhQEYXZlMC45LjFjYXR0iKJjY2FuZ3NwYWNlLypkd2l0aHg4ZGlkOmtleTp6Nk1rb2syYUNxckd2U1N4eHlSZmh5THdUd2RaV3FvVnMzSmQ5RXhNVkQ4akZWVleiY2NhbmZibG9iLypkd2l0aHg4ZGlkOmtleTp6Nk1rb2syYUNxckd2U1N4eHlSZmh5THdUd2RaV3FvVnMzSmQ5RXhNVkQ4akZWVleiY2NhbmdpbmRleC8qZHdpdGh4OGRpZDprZXk6ejZNa29rMmFDcXJHdlNTeHh5UmZoeUx3VHdkWldxb1ZzM0pkOUV4TVZEOGpGVlZXomNjYW5nc3RvcmUvKmR3aXRoeDhkaWQ6a2V5Ono2TWtvazJhQ3FyR3ZTU3h4eVJmaHlMd1R3ZFpXcW9WczNKZDlFeE1WRDhqRlZWV6JjY2FuaHVwbG9hZC8qZHdpdGh4OGRpZDprZXk6ejZNa29rMmFDcXJHdlNTeHh5UmZoeUx3VHdkWldxb1ZzM0pkOUV4TVZEOGpGVlZXomNjYW5oYWNjZXNzLypkd2l0aHg4ZGlkOmtleTp6Nk1rb2syYUNxckd2U1N4eHlSZmh5THdUd2RaV3FvVnMzSmQ5RXhNVkQ4akZWVleiY2NhbmpmaWxlY29pbi8qZHdpdGh4OGRpZDprZXk6ejZNa29rMmFDcXJHdlNTeHh5UmZoeUx3VHdkWldxb1ZzM0pkOUV4TVZEOGpGVlZXomNjYW5ndXNhZ2UvKmR3aXRoeDhkaWQ6a2V5Ono2TWtvazJhQ3FyR3ZTU3h4eVJmaHlMd1R3ZFpXcW9WczNKZDlFeE1WRDhqRlZWV2NhdWRYIu0B450yFol0a4zPlfugSqh+7lvR9VLNyln6wXSYGZ7uF4BjZXhwGmnbm1tjZmN0gaFlc3BhY2WhZG5hbWVmb3Jha2FpY2lzc1gi7QGKBNKzjv6z8Ltl3ryorGvbaDtxawM9aMydoY9lpjEvlWNwcmaA1QYBcRIg9yzJQ/VtA/z3e+nra9ubOxWFmh46m/MbAEZisUAH8H6oYXNYRO2hA0DFt9REZ7WN2gSUtnQVD7XMmPT+jZoK+OzhWyWuMESH3GmsXfRDHpT9LGHu1hITsqv0Q0ccuOGD2jvyJfyUfhQEYXZlMC45LjFjYXR0iKJjY2FuZ3NwYWNlLypkd2l0aHg4ZGlkOmtleTp6Nk1rb2syYUNxckd2U1N4eHlSZmh5THdUd2RaV3FvVnMzSmQ5RXhNVkQ4akZWVleiY2NhbmZibG9iLypkd2l0aHg4ZGlkOmtleTp6Nk1rb2syYUNxckd2U1N4eHlSZmh5THdUd2RaV3FvVnMzSmQ5RXhNVkQ4akZWVleiY2NhbmdpbmRleC8qZHdpdGh4OGRpZDprZXk6ejZNa29rMmFDcXJHdlNTeHh5UmZoeUx3VHdkWldxb1ZzM0pkOUV4TVZEOGpGVlZXomNjYW5nc3RvcmUvKmR3aXRoeDhkaWQ6a2V5Ono2TWtvazJhQ3FyR3ZTU3h4eVJmaHlMd1R3ZFpXcW9WczNKZDlFeE1WRDhqRlZWV6JjY2FuaHVwbG9hZC8qZHdpdGh4OGRpZDprZXk6ejZNa29rMmFDcXJHdlNTeHh5UmZoeUx3VHdkWldxb1ZzM0pkOUV4TVZEOGpGVlZXomNjYW5oYWNjZXNzLypkd2l0aHg4ZGlkOmtleTp6Nk1rb2syYUNxckd2U1N4eHlSZmh5THdUd2RaV3FvVnMzSmQ5RXhNVkQ4akZWVleiY2NhbmpmaWxlY29pbi8qZHdpdGh4OGRpZDprZXk6ejZNa29rMmFDcXJHdlNTeHh5UmZoeUx3VHdkWldxb1ZzM0pkOUV4TVZEOGpGVlZXomNjYW5ndXNhZ2UvKmR3aXRoeDhkaWQ6a2V5Ono2TWtvazJhQ3FyR3ZTU3h4eVJmaHlMd1R3ZFpXcW9WczNKZDlFeE1WRDhqRlZWV2NhdWRYIu0B450yFol0a4zPlfugSqh+7lvR9VLNyln6wXSYGZ7uF4BjZXhwGmnbm1tjZmN0gaFlc3BhY2WhZG5hbWVmb3Jha2FpY2lzc1gi7QGKBNKzjv6z8Ltl3ryorGvbaDtxawM9aMydoY9lpjEvlWNwcmaA1QYBcRIg9yzJQ/VtA/z3e+nra9ubOxWFmh46m/MbAEZisUAH8H6oYXNYRO2hA0DFt9REZ7WN2gSUtnQVD7XMmPT+jZoK+OzhWyWuMESH3GmsXfRDHpT9LGHu1hITsqv0Q0ccuOGD2jvyJfyUfhQEYXZlMC45LjFjYXR0iKJjY2FuZ3NwYWNlLypkd2l0aHg4ZGlkOmtleTp6Nk1rb2syYUNxckd2U1N4eHlSZmh5THdUd2RaV3FvVnMzSmQ5RXhNVkQ4akZWVleiY2NhbmZibG9iLypkd2l0aHg4ZGlkOmtleTp6Nk1rb2syYUNxckd2U1N4eHlSZmh5THdUd2RaV3FvVnMzSmQ5RXhNVkQ4akZWVleiY2NhbmdpbmRleC8qZHdpdGh4OGRpZDprZXk6ejZNa29rMmFDcXJHdlNTeHh5UmZoeUx3VHdkWldxb1ZzM0pkOUV4TVZEOGpGVlZXomNjYW5nc3RvcmUvKmR3aXRoeDhkaWQ6a2V5Ono2TWtvazJhQ3FyR3ZTU3h4eVJmaHlMd1R3ZFpXcW9WczNKZDlFeE1WRDhqRlZWV6JjY2FuaHVwbG9hZC8qZHdpdGh4OGRpZDprZXk6ejZNa29rMmFDcXJHdlNTeHh5UmZoeUx3VHdkWldxb1ZzM0pkOUV4TVZEOGpGVlZXomNjYW5oYWNjZXNzLypkd2l0aHg4ZGlkOmtleTp6Nk1rb2syYUNxckd2U1N4eHlSZmh5THdUd2RaV3FvVnMzSmQ5RXhNVkQ4akZWVleiY2NhbmpmaWxlY29pbi8qZHdpdGh4OGRpZDprZXk6ejZNa29rMmFDcXJHdlNTeHh5UmZoeUx3VHdkWldxb1ZzM0pkOUV4TVZEOGpGVlZXomNjYW5ndXNhZ2UvKmR3aXRoeDhkaWQ6a2V5Ono2TWtvazJhQ3FyR3ZTU3h4eVJmaHlMd1R3ZFpXcW9WczNKZDlFeE1WRDhqRlZWV2NhdWRYIu0B450yFol0a4zPlfugSqh+7lvR9VLNyln6wXSYGZ7uF4BjZXhwGmnbm1tjZmN0gaFlc3BhY2WhZG5hbWVmb3Jha2FpY2lzc1gi7QGKBNKzjv6z8Ltl3ryorGvbaDtxawM9aMydoY9lpjEvlWNwcmaA1QYBcRIg9yzJQ/VtA/z3e+nra9ubOxWFmh46m/MbAEZisUAH8H6oYXNYRO2hA0DFt9REZ7WN2gSUtnQVD7XMmPT+jZoK+OzhWyWuMESH3GmsXfRDHpT9LGHu1hITsqv0Q0ccuOGD2jvyJfyUfhQEYXZlMC45LjFjYXR0iKJjY2FuZ3NwYWNlLypkd2l0aHg4ZGlkOmtleTp6Nk1rb2syYUNxckd2U1N4eHlSZmh5THdUd2RaV3FvVnMzSmQ5RXhNVkQ4akZWVleiY2NhbmZibG9iLypkd2l0aHg4ZGlkOmtleTp6Nk1rb2syYUNxckd2U1N4eHlSZmh5THdUd2RaV3FvVnMzSmQ5RXhNVkQ4akZWVleiY2NhbmdpbmRleC8qZHdpdGh4OGRpZDprZXk6ejZNa29rMmFDcXJHdlNTeHh5UmZoeUx3VHdkWldxb1ZzM0pkOUV4TVZEOGpGVlZXomNjYW5nc3RvcmUvKmR3aXRoeDhkaWQ6a2V5Ono2TWtvazJhQ3FyR3ZTU3h4eVJmaHlMd1R3ZFpXcW9WczNKZDlFeE1WRDhqRlZWV6JjY2FuaHVwbG9hZC8qZHdpdGh4OGRpZDprZXk6ejZNa29rMmFDcXJHdlNTeHh5UmZoeUx3VHdkWldxb1ZzM0pkOUV4TVZEOGpGVlZXomNjYW5oYWNjZXNzLypkd2l0aHg4ZGlkOmtleTp6Nk1rb2syYUNxckd2U1N4eHlSZmh5THdUd2RaV3FvVnMzSmQ5RXhNVkQ4akZWVleiY2NhbmpmaWxlY29pbi8qZHdpdGh4OGRpZDprZXk6ejZNa29rMmFDcXJHdlNTeHh5UmZoeUx3VHdkWldxb1ZzM0pkOUV4TVZEOGpGVlZXomNjYW5ndXNhZ2UvKmR3aXRoeDhkaWQ6a2V5Ono2TWtvazJhQ3FyR3ZTU3h4eVJmaHlMd1R3ZFpXcW9WczNKZDlFeE1WRDhqRlZWV2NhdWRYIu0B450yFol0a4zPlfugSqh+7lvR9VLNyln6wXSYGZ7uF4BjZXhwGmnbm1tjZmN0gaFlc3BhY2WhZG5hbWVmb3Jha2FpY2lzc1gi7QGKBNKzjv6z8Ltl3ryorGvbaDtxawM9aMydoY9lpjEvlWNwcmaA2gUBcRIgPWIIP35VCw3Tp/lAwWBupSLD1R136z+6XSlQdgDcBOuoYXNYRO2hA0CO7GzdZjDQ26ncjWhpbxwQA94u9o57o+nZzBtrjQu5SSZAdqilmVyvA7MTSHHwiwAW15gVh+l84d1tP/wUiLMEYXZlMC45LjFjYXR0hKJjY2FubnNwYWNlL2Jsb2IvYWRkZHdpdGh4OGRpZDprZXk6ejZNa29rMmFDcXJHdlNTeHh5UmZoeUx3VHdkWldxb1ZzM0pkOUV4TVZEOGpGVlZXomNjYW5vc3BhY2UvaW5kZXgvYWRkZHdpdGh4OGRpZDprZXk6ejZNa29rMmFDcXJHdlNTeHh5UmZoeUx3VHdkWldxb1ZzM0pkOUV4TVZEOGpGVlZXomNjYW5uZmlsZWNvaW4vb2ZmZXJkd2l0aHg4ZGlkOmtleTp6Nk1rb2syYUNxckd2U1N4eHlSZmh5THdUd2RaV3FvVnMzSmQ5RXhNVkQ4akZWVleiY2Nhbmp1cGxvYWQvYWRkZHdpdGh4OGRpZDprZXk6ejZNa29rMmFDcXJHdlNTeHh5UmZoeUx3VHdkWldxb1ZzM0pkOUV4TVZEOGpGVlZXY2F1ZFgi7QGis2sw0qIIbO0gHsvP8wHgUUZuOXthxnC/9FCV7Wi4R2NleHD2Y2ZjdIGhZXNwYWNloWRuYW1lZm9yYWthaWNpc3NYIu0B450yFol0a4zPlfugSqh+7lvR9VLNyln6wXSYGZ7uF4BjcHJmhNgqWCUAAXESIPcsyUP1bQP893vp62vbmzsVhZoeOpvzGwBGYrFAB/B+2CpYJQABcRIg9yzJQ/VtA/z3e+nra9ubOxWFmh46m/MbAEZisUAH8H7YKlglAAFxEiD3LMlD9W0D/Pd76etr25s7FYWaHjqb8xsARmKxQAfwftgqWCUAAXESIPcsyUP1bQP893vp62vbmzsVhZoeOpvzGwBGYrFAB/B+";
const BACKEND_URL = Bun.env.BACKEND_URL || 'http://localhost:3000';

// Initialize OpenAI client
const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: OPENAI_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": "https://orakai.xyz",
    "X-Title": "Orakai",
  },
});

// Initialize ethers provider and wallet
const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY!, provider);

// Initialize web3.storage client
let storageClient: Client.Client | null = null;

async function initializeStorageClient() {
  const principal = Signer.parse(Bun.env.KEY ?? "");
  const store = new StoreMemory();
  const client = await Client.create({ principal, store });
  const proof = await Proof.parse(DELEGATION_PROOF!);
  const space = await client.addSpace(proof);
  await client.setCurrentSpace(space.did());
  return client;
}

// Load contract ABI and create contract instance
const oracleABI = [{"type":"constructor","inputs":[{"name":"_aggregator","type":"address","internalType":"address"}],"stateMutability":"nonpayable"},{"type":"function","name":"aggregator","inputs":[],"outputs":[{"name":"","type":"address","internalType":"address"}],"stateMutability":"view"},{"type":"function","name":"finaliseResponse","inputs":[{"name":"requestID","type":"string","internalType":"string"},{"name":"validIndexes","type":"uint256[]","internalType":"uint256[]"},{"name":"randSeed","type":"uint256","internalType":"uint256"},{"name":"finalAnswer","type":"bytes","internalType":"bytes"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"getRequest","inputs":[{"name":"requestID","type":"string","internalType":"string"}],"outputs":[{"name":"","type":"tuple","internalType":"struct OrakaiOracle.Request","components":[{"name":"requester","type":"address","internalType":"address"},{"name":"queryID","type":"string","internalType":"string"},{"name":"requestID","type":"string","internalType":"string"},{"name":"callbackAddress","type":"address","internalType":"address"},{"name":"timestamp","type":"uint256","internalType":"uint256"},{"name":"finalized","type":"bool","internalType":"bool"}]}],"stateMutability":"view"},{"type":"function","name":"getResponses","inputs":[{"name":"requestID","type":"string","internalType":"string"}],"outputs":[{"name":"","type":"tuple[]","internalType":"struct OrakaiOracle.Response[]","components":[{"name":"worker","type":"address","internalType":"address"},{"name":"cid","type":"string","internalType":"string"}]}],"stateMutability":"view"},{"type":"function","name":"hasResponded","inputs":[{"name":"","type":"bytes32","internalType":"bytes32"},{"name":"","type":"address","internalType":"address"}],"outputs":[{"name":"","type":"bool","internalType":"bool"}],"stateMutability":"view"},{"type":"function","name":"requestQuery","inputs":[{"name":"queryID","type":"string","internalType":"string"},{"name":"requestID","type":"string","internalType":"string"},{"name":"callbackAddress","type":"address","internalType":"address"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"requestTimeout","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"requests","inputs":[{"name":"","type":"bytes32","internalType":"bytes32"}],"outputs":[{"name":"requester","type":"address","internalType":"address"},{"name":"queryID","type":"string","internalType":"string"},{"name":"requestID","type":"string","internalType":"string"},{"name":"callbackAddress","type":"address","internalType":"address"},{"name":"timestamp","type":"uint256","internalType":"uint256"},{"name":"finalized","type":"bool","internalType":"bool"}],"stateMutability":"view"},{"type":"function","name":"responses","inputs":[{"name":"","type":"bytes32","internalType":"bytes32"},{"name":"","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"worker","type":"address","internalType":"address"},{"name":"cid","type":"string","internalType":"string"}],"stateMutability":"view"},{"type":"function","name":"submitResponse","inputs":[{"name":"requestID","type":"string","internalType":"string"},{"name":"cid","type":"string","internalType":"string"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"updateAggregator","inputs":[{"name":"newAggregator","type":"address","internalType":"address"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"event","name":"Finalised","inputs":[{"name":"reqHash","type":"bytes32","indexed":true,"internalType":"bytes32"},{"name":"queryID","type":"string","indexed":false,"internalType":"string"},{"name":"winner","type":"address","indexed":false,"internalType":"address"},{"name":"answer","type":"bytes","indexed":false,"internalType":"bytes"}],"anonymous":false},{"type":"event","name":"RequestCreated","inputs":[{"name":"reqHash","type":"bytes32","indexed":true,"internalType":"bytes32"},{"name":"requester","type":"address","indexed":false,"internalType":"address"},{"name":"queryID","type":"string","indexed":false,"internalType":"string"},{"name":"requestID","type":"string","indexed":false,"internalType":"string"}],"anonymous":false},{"type":"event","name":"ResponseSubmitted","inputs":[{"name":"reqHash","type":"bytes32","indexed":true,"internalType":"bytes32"},{"name":"worker","type":"address","indexed":false,"internalType":"address"},{"name":"cid","type":"string","indexed":false,"internalType":"string"},{"name":"requestID","type":"string","indexed":false,"internalType":"string"}],"anonymous":false}]

const oracleContract = new ethers.Contract(ORACLE_CONTRACT_ADDRESS!, oracleABI, wallet);

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

// Function to format output based on type
function formatOutput(value: string, outputType: string): string {
  switch (outputType) {
    case "uint256":
      return ethers.toBigInt(value).toString();
    case "string":
      return value;
    case "bool":
      return value.toLowerCase() === "true" ? "true" : "false";
    case "address":
      return ethers.getAddress(value);
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

// Function to process a request
async function processRequest(requestID: string) {
  try {
    // Get request details from contract
    const [requester, queryID, _, callbackAddress, timestamp, finalized] =
      await oracleContract.getRequest(requestID);

    if (finalized) {
      console.log(`Request ${requestID} already finalized`);
      return;
    }

    // Fetch query details from backend
    const queryDetails = await fetchQueryDetails(queryID);
    const { queryPrompt, outputType } = queryDetails;

    // Get response from OpenAI
    const completion = await openai.chat.completions.create({
      model: 'google/gemini-2.5-pro-exp-03-25:free',
      messages: [
        {
          role: 'system',
          content: `You are a strict data formatter. You must respond with ONLY the answer in the exact format required. The output type is ${outputType}. Do not include any explanation or additional text.`
        },
        {
          role: 'user',
          content: queryPrompt
        }
      ],
    });

    const rawResponse = completion.choices[0].message.content?.trim() || '';

    // Validate and format the response
    if (!validateOutputType(rawResponse, outputType)) {
      throw new Error(`Response "${rawResponse}" is not a valid ${outputType}`);
    }

    const formattedResponse = formatOutput(rawResponse, outputType);

    // Create response object
    const responseObj = {
      requestID,
      queryID,
      response: formattedResponse,
      rawData: completion,
      outputType,
      timestamp: new Date().toISOString(),
      worker: wallet.address
    };

    // Initialize storage client if not already done
    if (!storageClient) {
      console.log("initialising storage client.")
      storageClient = await initializeStorageClient();
    }

    // Upload to web3.storage
    const buffer = Buffer.from(JSON.stringify(responseObj));
    const file = new File([buffer], `${requestID}.json`);
    const upload = await storageClient!.uploadFile(file);
    const cid = upload.toString();

    // Submit response to contract
    const tx = await oracleContract.submitResponse(requestID, cid);
    await tx.wait();

    console.log(`Successfully processed request ${requestID} with CID ${cid}`);
  } catch (error) {
    console.error(`Error processing request ${requestID}:`, error);
  }
}

// Main function to start the worker
async function startWorker() {
  console.log('Starting Orakai worker...');

  // Initialize storage client
  storageClient = await initializeStorageClient();

  // Listen for QueryRequested events
  oracleContract.on("RequestCreated", async (reqHash: string, requester: string, queryID: string, requestID: string) => {
    console.log(`New query requested: ${queryID} with requestID: ${requestID} from ${requester}`);
    await processRequest(requestID);
  });

  console.log('Worker started and listening for events...');
}

// Start the worker
startWorker().catch(console.error);
