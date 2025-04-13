"use client"
import { useState, useEffect } from 'react'
import { ethers } from 'ethers'

// Configuration - replace these with your values
const CONTRACT_ADDRESS = "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853" // Replace with your deployed contract address
const RPC_URL = "http://localhost:8545" // Anvil default RPC URL
const PRIVATE_KEY = process.env.NEXT_PUBLIC_PRIVATE_KEY // Replace with your private key

export default function ContractInteraction() {
    const [contract, setContract] = useState<any>(null)
    const [latestTranslation, setLatestTranslation] = useState<string>("")
    const [queryId, setQueryId] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string>("")

    useEffect(() => {
        const initContract = async () => {
            try {
                if (!PRIVATE_KEY) {
                    console.error("PRIVATE_KEY is not set")
                }
                console.log("Initializing contract...")
                const provider = new ethers.JsonRpcProvider(RPC_URL)
                const wallet = new ethers.Wallet(PRIVATE_KEY as string ?? "", provider)
                console.log("Wallet address:", wallet.address)

                // Import the contract ABI and create contract instance
                const contract = new ethers.Contract(
                    CONTRACT_ADDRESS,
                    [
                        "function makeQuery(string memory queryID, string memory requestID) external",
                        "function getLatestTranslation() external view returns (string memory)",
                        "function getInitialPhrase() external view returns (string memory)",
                        "event CallbackReceived(string requestID, string translation)"
                    ],
                    wallet
                )

                setContract(contract)
                console.log("Contract initialized successfully")

                // Set up event listener
                contract.on("CallbackReceived", (requestID: string, translation: string) => {
                    console.log("Callback received:", { requestID, translation })
                    setLatestTranslation(translation)
                })

                // Fetch initial translation
                const initialTranslation = await contract.getLatestTranslation()
                setLatestTranslation(initialTranslation)
                console.log("Initial translation:", initialTranslation)

            } catch (err) {
                console.error("Error initializing contract:", err)
                setError("Failed to initialize contract")
            }
        }

        initContract()

        // Cleanup event listener
        return () => {
            if (contract) {
                contract.removeAllListeners("CallbackReceived")
            }
        }
    }, [])

    const handleMakeQuery = async () => {
        if (!contract || !queryId) return
        const requestID = "req-" + Date.now()

        try {
            setLoading(true)
            console.log("Making query with ID:", queryId)
            const tx = await contract.makeQuery(queryId, requestID)
            console.log("Transaction sent:", tx.hash)
            await tx.wait()
            console.log("Transaction confirmed")
        } catch (err) {
            console.error("Error making query:", err)
            setError("Failed to make query")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-4 p-4 bg-white rounded-lg shadow">
            <h2 className="text-xl font-bold">Contract Interaction</h2>
            
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Query ID</label>
                <input
                    type="text"
                    value={queryId}
                    onChange={(e) => setQueryId(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="Enter query ID"
                />
            </div>

            <button
                onClick={handleMakeQuery}
                disabled={loading || !queryId}
                className={`px-4 py-2 rounded-md text-white ${
                    loading || !queryId ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
                }`}
            >
                {loading ? 'Processing...' : 'Make Query'}
            </button>

            <div className="mt-4">
                <h3 className="font-medium">Latest Translation:</h3>
                <p className="mt-2 p-2 bg-gray-100 rounded">{latestTranslation || 'No translation yet'}</p>
            </div>

            {error && (
                <div className="mt-4 p-2 bg-red-100 text-red-700 rounded">
                    {error}
                </div>
            )}
        </div>
    )
} 