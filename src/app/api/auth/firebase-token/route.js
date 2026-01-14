import { auth } from "@/auth";
import { adminAuth } from "@/lib/firebase-admin";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Use email as the uid for Firebase (sanitize for Firebase uid requirements)
    const uid = session.user.email.replace(/[.#$[\]]/g, "_");

    // Create custom token with additional claims
    const customToken = await adminAuth.createCustomToken(uid, {
      email: session.user.email,
      name: session.user.name,
      picture: session.user.image,
    });

    return NextResponse.json({ token: customToken });
  } catch (error) {
    console.error("Error creating Firebase token:", error);
    return NextResponse.json(
      { error: "Failed to create token" },
      { status: 500 }
    );
  }
}
