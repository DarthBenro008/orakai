# Orakai: Decentralized AI Oracle Platform

## Overview
Orakai is a decentralized AI-powered oracle network that enables smart contracts to access AI-generated insights through a trustless, on-chain interface. It leverages components like OpenRouter.ai (for LLM querying), Storacha (for decentralized data storage), and Randamu (for verifiable randomness) to build a complete AI oracle pipeline.

Orakai is designed for composability with EVM-compatible smart contracts and uses the Checker Subnet to maintain node reputation, governance, and sybil resistance.

---

## Key Components

### 1. Orakai Smart Contract
The on-chain entry point for interacting with the Orakai network.

**Functions:**
- `requestQuery(queryId)`: Called by consumer contracts to initiate a query request. Emits `QueryRequested` event.
- `submitResponse(requestId, CID, signature)`: Called by worker bots to submit their response.
- `finalize(requestId, finalResult, proof)`: Called by aggregator after quorum. Calls consumer contract with result.

**Events:**
- `QueryRequested(queryId, requestId, sender)`
- `ResponseSubmitted(requestId, worker, CID)`
- `ResultFinalized(requestId, finalResult)`

### 2. Orakai Backend
The centralized backend used for orchestration, developer access, and metadata management.

**Responsibilities:**
- User signup and project creation
- Query creation: `queryId` is generated with prompt, output type, and metadata
- Stores query data and makes it available to workers
- Worker registration

**Endpoints:**
- `POST /create-query`
- `GET /fetch-query/:queryId`
- `POST /register-worker`

### 3. Orakai Aggregator
An off-chain trusted node responsible for:
- Listening to `submitResponse` events
- Pulling data from Storacha using submitted CID
- Validating worker signatures
- Establishing consensus/quorum from worker responses
- Submitting the finalized result to the smart contract
- Maintaining reputation scores for workers

**Optional Future Upgrade:** Aggregator quorum (multi-aggregator network)

### 4. Orakai Worker (Bot)
A downloadable CLI binary that anyone can run to earn rewards.

**Workflow:**
- Listens for new `requestId`s
- Fetches `queryId` metadata from backend
- Sends prompt to LLM provider (OpenRouter.ai)
- Casts response to expected output type
- Signs result and uploads to Storacha → gets CID
- Submits CID + signature to smart contract

**Configurable Options:**
- OpenRouter Key
- LLM model (e.g., GPT-4, Claude, Mixtral)
- Worker private key

### 5. Orakai Subnet (Checker Network)
Provides decentralized governance, reputation scoring, and validator consensus:
- Workers are verified via Checker Subnet
- Can slash bad actors, boost high-performing workers
- Provides periodic signed attestations to the aggregator
- Helps weight votes in quorum logic

---

## Query Lifecycle

1. **Query Creation**
   - User registers a new query via the Orakai backend
   - A `queryId` is returned, which stores prompt, outputType, etc.

2. **Request Initiation**
   - Consumer smart contract calls `requestQuery(queryId)`
   - Smart contract emits a new `requestId` (unique per call)

3. **Worker Response**
   - Workers listen for new `requestId`s
   - Fetch query details from backend
   - Execute prompt with OpenRouter.ai
   - Cast response to expected type, sign, upload to Storacha
   - Call `submitResponse(requestId, CID, sig)` on Orakai contract

4. **Quorum + Finalization**
   - Aggregator listens to `submitResponse`
   - Aggregator pulls data from Storacha, validates signatures
   - Checks for quorum (e.g., 3 of 5 matching answers)
   - Uses Randamu to pick canonical response among matches
   - Calls `finalize(requestId, result)`

5. **Callback**
   - Orakai contract calls back the consumer with the final answer

---

## Consensus & Randamu
- Randamu is used to inject verifiable randomness into quorum selection
- Use-case: Picking one canonical response out of multiple identical ones for reward attribution
- Randamu also helps load-balancing workers, pseudo-random audits

---

## Reputation System
- Aggregator maintains local scores for each worker
- Based on:
  - Match frequency
  - Response time
  - Accuracy (as judged by subnet or aggregator)
- Checker Subnet cross-verifies and enforces penalties/boosts

---

## Considerations
- Each `requestQuery` generates a new `requestId`
- Multiple contracts can use the same `queryId`
- Smart contracts only need to handle callbacks and expected type parsing
- Output types are strictly typed to avoid hallucination errors

---

## Worker Participation
- Worker binary can be open-sourced
- Runs on any machine with an API key and wallet
- Gas fees can be reimbursed or workers can submit only off-chain
- Can run as a service or scheduled cron jobs

---

## Future Improvements
- Multiple aggregators (aggregator DAO)
- Fully decentralized query registry (queryId as NFT?)
- zkProofs for LLM inference using zkML
- Token incentive layer for staking, slashing, and payments

---

## Dependencies
- [OpenRouter.ai](https://openrouter.ai) — LLM Gateway
- [Storacha](https://github.com/filecoin/storacha) — Decentralized data store (returns CID)
- [Randamu](https://github.com/cryptonetlab/randamu) — On-chain randomness
- [Checker Network](https://checker.network) — Decentralized reputation/subnet

---

## Summary
Orakai provides a complete decentralized AI Oracle protocol — from prompt creation to on-chain finalization — using verifiable data, quorum consensus, decentralized workers, and off-chain execution. The design is modular, extensible, and community-first.

The system encourages openness, verifiability, and transparency — making it ideal for use cases in prediction markets, governance tooling, autonomous agents, and dApp AI tooling.

---