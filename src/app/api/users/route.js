import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(req) {
    try {
        const url = new URL(req.url);
        const email = url.searchParams.get("email");

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db("admission_management");
        const user = await db.collection("users").findOne({ email });

        if (!user) {
            console.log("❌ User not found in database.");
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        console.log(`✅ User Found: ${user.email}, Role: ${user.role}`);
        return NextResponse.json({ role: user.role }, { status: 200 });

    } catch (error) {
        console.error("❌ Error fetching user:", error);
        return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
    }
}
