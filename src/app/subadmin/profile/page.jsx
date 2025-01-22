// admission-management/src/app/subadmin/profile/page.js
"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LogoutButton from "@/components/LogoutButton";

export default function SubAdminProfile() {
    const { user, role } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!user || role !== "subadmin") {
            router.push("/login");
        }
    }, [user, role]);

    if (!user) return <div className="flex items-center justify-center h-screen">Loading...</div>;

    return (
        <div className="p-6 bg-white shadow-lg rounded-lg">
            <h1 className="text-2xl font-bold">Subadmin Profile</h1>
            <p className="mt-4">Email: {user.email}</p>
            <LogoutButton />
        </div>
    );
}
