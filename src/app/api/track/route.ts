// Expected: Internal secure POST endpoint. Receives NIN, calls backend server-to-server, stores session, redirects.
import { NextResponse } from "next/server";

import { trackingRequestSchema } from "../../../features/tracking/schemas/tracking.schema";

// ─── In-memory rate limiter ───────────────────────────────────────────────────
// Resets on server restart. Use Redis/Upstash for production persistence.

const RATE_LIMIT = 5; // max requests
const WINDOW_MS = 60_000; // per 1 minute

type RateBucket = { count: number; resetAt: number };
const buckets = new Map<string, RateBucket>();

function getClientIp(req: Request): string {
	// Trust x-forwarded-for only in production behind a trusted proxy.
	// For dev/standalone this returns a safe fallback.
	const forwarded = req.headers.get("x-forwarded-for");
	return forwarded ? forwarded.split(",")[0].trim() : "unknown";
}

function checkRateLimit(ip: string): boolean {
	const now = Date.now();
	const bucket = buckets.get(ip);

	if (!bucket || now >= bucket.resetAt) {
		buckets.set(ip, { count: 1, resetAt: now + WINDOW_MS });
		return true; // allowed
	}

	if (bucket.count >= RATE_LIMIT) {
		return false; // blocked
	}

	bucket.count += 1;
	return true; // allowed
}

// ─── Handler ─────────────────────────────────────────────────────────────────

export async function POST(request: Request) {
	const ip = getClientIp(request);

	if (!checkRateLimit(ip)) {
		return NextResponse.json(
			{ status: "rate_limited" },
			{
				status: 429,
				headers: { "Retry-After": "60" },
			},
		);
	}

	const body = await request.json();
	const parsed = trackingRequestSchema.safeParse(body);

	if (!parsed.success) {
		return NextResponse.json(
			{ code: "INVALID_NIN", message: "Invalid NIN" },
			{ status: 400 },
		);
	}

	const { nin } = parsed.data;

	const backendUrl =
		process.env.NEXT_PUBLIC_BACKEND_API_URL ?? "http://localhost:3001/api";
	let result: { status: string; availableAt?: string };
	try {
		const backendRes = await fetch(
			`${backendUrl}/cin/status?nin=${encodeURIComponent(nin)}`,
		);
		if (!backendRes.ok) {
			result = { status: "not_found" };
		} else {
			result = (await backendRes.json()) as {
				status: string;
				availableAt?: string;
			};
		}
	} catch {
		result = { status: "not_found" };
	}

	return NextResponse.json(result, { status: 200 });
}
