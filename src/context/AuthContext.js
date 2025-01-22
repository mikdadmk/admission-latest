"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
            if (authUser) {
                try {
                    console.log("✅ Authenticated User:", authUser.email);

                    const res = await fetch(`/api/users?email=${authUser.email}`);
                    const data = await res.json();

                    if (data?.role) {
                        setUser(authUser);
                        setRole(data.role);
                    } else {
                        setUser(authUser);
                        setRole("user");
                    }
                } catch (error) {
                    console.error("❌ Error fetching user role:", error);
                    setUser(null);
                    setRole(null);
                }
            } else {
                setUser(null);
                setRole(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user, role, setUser, setRole, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
