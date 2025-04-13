import { auth } from "@/auth"
import { NextResponse } from "next/server"
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { D1Database } from "@auth/d1-adapter";


const outputTypes = ["uint256", "string", "bool", "address"] as const
type OutputType = typeof outputTypes[number]
const isOutputType = (value: string): value is OutputType => outputTypes.includes(value as OutputType)

export interface createQueryRequest {
	queryName: string;
	queryDescription: string;
	queryPrompt: string;
	outputType: string;
}

// need to be authenticated
export const POST = auth(async function POST(req: any) {
    if (!req.auth) return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    const db = getCloudflareContext().env.DB as D1Database;
    const userID = req.auth.user.id;
    const body = await req.json() as createQueryRequest;
    if (!isOutputType(body.outputType)) {
        return NextResponse.json({ message: "Invalid output type" }, { status: 400 })
    }
    console.log("body", body)
    console.log("userID", userID)
    const query = await db.prepare("INSERT INTO queries (queryName, queryDescription, queryPrompt, outputType, userId, createdAt) VALUES (?, ?, ?, ?, ?, ?)")
        .bind(body.queryName, body.queryDescription, body.queryPrompt, body.outputType, userID, new Date().toISOString())
        .run();
    return NextResponse.json({ message: "Query created", query }, { status: 200 })
})

// list all queries
export async function GET(req: any) {
    const db = getCloudflareContext().env.DB as D1Database;
    const queries = await db.prepare("SELECT q.id AS queryId, q.queryName, q.queryDescription, q.queryPrompt, q.outputType, q.createdAt, u.id AS userId, u.name AS userName, u.email AS userEmail FROM queries q JOIN users u ON q.userId = u.id")
        .bind()
        .all();
    return NextResponse.json({ message: "Queries fetched", queries: queries.results }, { status: 200 })
}