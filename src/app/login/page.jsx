"use client";
import { useState, useEffect } from "react";
import { auth, signInWithEmailAndPassword } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const router = useRouter();
    const { user, role, setUser, setRole, loading } = useAuth();

    useEffect(() => {
        if (!loading && user && role) {
            const redirectTo = role === "admin" ? "/admin" : role === "subadmin" ? "/subadmin" : "/user";
            router.push(redirectTo);
        }
    }, [user, role, loading]);

    const handleLogin = async () => {
        try {
            setErrorMessage(""); // Reset error message

            if (!email || !password) {
                setErrorMessage("❌ Please fill in all fields.");
                return;
            }

            // ✅ Check Firebase connection
            console.log("📡 Connecting to Firebase...");
            
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const loggedUser = userCredential.user;

            console.log("✅ Firebase Authenticated:", loggedUser.email);

            const response = await fetch(`/api/users?email=${loggedUser.email}`);
            const userData = await response.json();

            if (userData?.role) {
                setUser(loggedUser);
                setRole(userData.role);
                router.push(userData.role === "admin" ? "/admin" : userData.role === "subadmin" ? "/subadmin" : "/user");
            } else {
                setErrorMessage("Role not found. Please contact support.");
            }
        } catch (error) {
            console.error("❌ Firebase Auth Error:", error.message);
            setErrorMessage(`❌ ${error.message}`);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-green-500 to-blue-500 px-4">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h1 className="text-3xl font-bold mb-6 text-center">Login</h1>
                {errorMessage && <p className="text-red-500 text-center mb-4">{errorMessage}</p>}
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 mb-4 border rounded" />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 mb-4 border rounded" />
                <button onClick={handleLogin} className="w-full bg-green-600 text-white p-3 rounded">Login</button>
            </div>
        </div>
    );
}
