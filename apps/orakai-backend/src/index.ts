import { Hono } from "hono";
import { jwt } from 'hono/jwt'
import type { JwtVariables } from 'hono/jwt'

type Bindings = {
	DB: D1Database
	JWT_SECRET: string
}


interface createQueryRequest {
	queryName: string;
	queryDescription: string;
	queryPrompt: string;
	outputType: string;
}

type Variables = JwtVariables

const outputTypes = ["uint256", "string", "bool", "address"] as const
type OutputType = typeof outputTypes[number]
const isOutputType = (value: string): value is OutputType => outputTypes.includes(value as OutputType)

const app = new Hono<{ Bindings: Bindings, Variables: Variables }>();

app.get("/", (c) => {
	return c.json({
		message: "Hello World",
	});
});

// route to get a specific query
app.get("/queries/:id", async (c) => {
	const { id } = c.req.param();
	const { DB } = c.env;
	const query = await DB.prepare("SELECT * FROM queries WHERE queryId = ?").bind(id).first();
	return c.json({
		query,
	});
});

// route to get all queries
app.get("/queries", async (c) => {
	const { DB } = c.env;
	const queries = await DB.prepare("SELECT * FROM queries").bind().all();
	return c.json({
		queries,
	});
});

app.use("/auth/*", async (c, next) => {
	const middleware = jwt({
		secret: c.env.JWT_SECRET,
	});
	return middleware(c, next);
});

// route to create a query - ensure user is authenticated
app.post("/auth/queries", async (c) => {
	const { DB } = c.env;
	const payload = c.get('jwtPayload');
	const userId = payload.user;
	const req = await c.req.json<createQueryRequest>();
	if (!isOutputType(req.outputType)) {
		return c.json({
			error: "Invalid output type",
		}, 400);
	}
	if (req.queryName.length === 0 || req.queryDescription.length === 0 || req.queryPrompt.length === 0) {
		return c.json({
			error: "Query name, description, and prompt are required",
		}, 400);
	}
	const query = await DB.prepare("INSERT INTO queries (userId, queryName, queryDescription, queryPrompt, outputType) VALUES (?, ?, ?, ?, ?)")
		.bind(userId, req.queryName, req.queryDescription, req.queryPrompt, req.outputType).run();
	return c.json({
		query,
	});
});

// route to delete a query - ensure user is authenticated
app.delete("/auth/queries/:id", async (c) => {
	// allow only query owner to delete the query	
	const { id } = c.req.param();
	const { DB } = c.env;
	const payload = c.get('jwtPayload');
	const userId = payload.user;
	const query = await DB.prepare("DELETE FROM queries WHERE queryId = ? AND userId = ?").bind(id, userId).run();
	return c.json({
		query,
	});
});

export default app;
