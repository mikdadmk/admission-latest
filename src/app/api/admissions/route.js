import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import clientPromise from "@/lib/mongodb";
import { auth, createUserWithEmailAndPassword } from "@/lib/firebase";
import archiver from "archiver";

export async function POST(request) {
    try {
        const formData = await request.formData();
        console.log("📤 Received Admission Data");

        // Extract fields from FormData
        const extractedData = {};
        for (const [key, value] of formData.entries()) {
            extractedData[key] = value;
        }

        const { name, fatherName, motherName, guardianName, relation, address, dob, phone, whatsapp, email, password } = extractedData;

        // Ensure required fields are filled
        if (!name || !fatherName || !motherName || !guardianName || !relation || !address || !dob || !phone || !whatsapp || !email || !password) {
            return NextResponse.json({ error: "❌ Missing required fields" }, { status: 400 });
        }

        // Handle File Uploads
        const uploadFolder = path.join(process.cwd(), "public/uploads", email);
        await fs.mkdir(uploadFolder, { recursive: true });

        const filePaths = {};
        const fileFields = ["aadhaar", "tc", "pupilPhoto", "signature"];

        for (const key of fileFields) {
            const file = formData.get(key);
            if (file && file.name) {
                const filePath = path.join(uploadFolder, file.name);
                const fileBuffer = await file.arrayBuffer();
                await fs.writeFile(filePath, Buffer.from(new Uint8Array(fileBuffer)));
                filePaths[key] = `/uploads/${email}/${file.name}`; // ✅ Fix file paths
            }
        }

        // Connect to MongoDB
        const client = await clientPromise;
        const db = client.db("admission_management");

        // Assign Role (First User → Admin, Second → Subadmin, Others → User)
        const userCount = await db.collection("users").countDocuments();
        let role = userCount === 0 ? "admin" : userCount === 1 ? "subadmin" : "user";

        // Create user in Firebase Authentication
        let user;
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            user = userCredential.user;
            console.log("✅ Firebase User Created:", user.uid);
        } catch (firebaseError) {
            return NextResponse.json({ error: firebaseError.message }, { status: 500 });
        }

        // ✅ Store Admission Data in MongoDB
        await db.collection("admissions").insertOne({
            uid: user.uid,
            name, fatherName, motherName, guardianName, relation,
            address, dob, phone, whatsapp, email,
            files: filePaths, // ✅ Store file paths
            createdAt: new Date()
        });

        // ✅ Store User Data in MongoDB
        await db.collection("users").insertOne({
            uid: user.uid,
            name, email, phone, role,
            files: filePaths, // ✅ Store file paths
            createdAt: new Date()
        });

        return NextResponse.json({ message: "✅ Admission and user registration successful", role }, { status: 201 });

    } catch (error) {
        console.error("❌ Error Processing Admission:", error);
        return NextResponse.json({ error: "❌ Internal server error" }, { status: 500 });
    }
}
