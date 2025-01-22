import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(req) {
    try {
        const client = await clientPromise;
        const db = client.db("admission_management");

        // Fetch all users and include their file paths
        const users = await db.collection("users").find({}, { projection: { _id: 1, name: 1, email: 1, phone: 1, role: 1, files: 1 } }).toArray();

        if (!users || users.length === 0) {
            return NextResponse.json({ error: "No users found" }, { status: 404 });
        }

        return NextResponse.json(users, { status: 200 });

    } catch (error) {
        console.error("❌ Error fetching users:", error);
        return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }
}
