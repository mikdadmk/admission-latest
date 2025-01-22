"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "@/components/Sidebar"; // ✅ Import Sidebar

export default function UserLayout({ children }) {
    const { user, role, loading } = useAuth();
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        if (loading) return;

        if (!user || role !== "user") {
            router.push("/login"); // Redirect unauthorized users
        } else {
            setAuthorized(true);
        }
    }, [user, role, loading]);

    if (loading || !authorized) {
        return <div className="flex items-center justify-center h-screen">Loading...</div>;
    }

    return (
        <div className="flex min-h-screen">
            {/* ✅ Sidebar stays constant */}
            <Sidebar />

            {/* ✅ Dynamic content updates here */}
            <div className="flex-1 p-6">
                {children}
            </div>
        </div>
    );
}
