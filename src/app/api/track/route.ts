// Expected: Internal secure POST endpoint. Receives NIN, calls backend server-to-server, stores session, redirects.
import { NextResponse } from "next/server";

import { trackingRequestSchema } from "../../../features/tracking/schemas/tracking.schema";

export async function POST(request: Request) {
  // Read JSON sent by the tracking form (modern fetch submit).
  const body = await request.json();

  // Validate request payload with Zod. safeParse never throws.
  const parsed = trackingRequestSchema.safeParse(body);

  if (!parsed.success) {
    // Invalid input: return a typed client error for UI handling.
    return NextResponse.json(
      { code: "INVALID_NIN", message: "Invalid NIN" },
      { status: 400 }
    );
  }

  // Next step: call backend + persist session + return final response shape.
  // TODO: call backend, persist result in session, then redirect to /track/result.
  return NextResponse.json({ ok: true }, { status: 200 });
}