
import { auth } from "@/auth";
import { D1Database } from "@auth/d1-adapter";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { NextResponse } from "next/server";

// get a specific query
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    const db = getCloudflareContext().env.DB as D1Database;
    // also get the user data of who created the query from the foreign key
    const query = await db.prepare("SELECT * FROM queries WHERE id = ?")
        .bind(id)
        .first();
    const user = await db.prepare("SELECT * FROM users WHERE id = ?")   
        .bind(query.userId)
        .first();
    return NextResponse.json({ message: "Query fetched", query, user }, { status: 200 })
}


// need to be authenticated
export const DELETE = auth(async function POST(req: any, { params }: { params: Promise<{ id: string }> }) {
    if (!req.auth) return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    const { id } = await params
    const userID = req.auth.user.id;
    const db = getCloudflareContext().env.DB as D1Database;
    const query = await db.prepare("DELETE FROM queries WHERE id = ? AND userId = ?")
        .bind(id, userID)
        .run();
    return NextResponse.json({ message: "Query deleted", query }, { status: 200 })
})