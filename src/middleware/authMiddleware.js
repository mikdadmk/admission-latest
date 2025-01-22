import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function middleware(req) {
    const { pathname } = req.nextUrl;
    const authToken = req.cookies.get("authToken"); // Firebase session cookie

    if (!authToken && ["/login", "/register", "/admission"].includes(pathname)) {
        return NextResponse.next();
    }

    if (!authToken) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    try {
        const client = await clientPromise;
        const db = client.db("admission_management");

        // Fetch user by Firebase UID
        const user = await db.collection("users").findOne({ uid: authToken });

        if (!user) {
            return NextResponse.redirect(new URL("/login", req.url));
        }

        // Role-based access control
        if (pathname.startsWith("/admin") && user.role !== "admin") {
            return NextResponse.redirect(new URL("/login", req.url));
        }
        if (pathname.startsWith("/subadmin") && user.role !== "subadmin") {
            return NextResponse.redirect(new URL("/login", req.url));
        }
        if (pathname.startsWith("/user") && user.role !== "user") {
            return NextResponse.redirect(new URL("/login", req.url));
        }

        return NextResponse.next();
    } catch (error) {
        console.error("Middleware Error:", error);
        return NextResponse.redirect(new URL("/login", req.url));
    }
}

export const config = {
    matcher: ["/admin/:path*", "/subadmin/:path*", "/user/:path*"],
};
