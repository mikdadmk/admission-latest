// import { NextResponse } from "next/server";
// import path from "path";
// import fs from "fs/promises";
// import clientPromise from "@/lib/mongodb";
// import { auth, createUserWithEmailAndPassword } from "@/lib/firebase";
// import archiver from "archiver";

// export async function POST(request) {
//     try {
//         const formData = await request.formData();
//         console.log("📤 Received Admission Data");

//         // Extract fields from FormData
//         const extractedData = {};
//         for (const [key, value] of formData.entries()) {
//             extractedData[key] = value;
//         }

//         const { name, fatherName, motherName, guardianName, relation, address, dob, phone, whatsapp, email, password } = extractedData;

//         // Ensure required fields are filled
//         if (!name || !fatherName || !motherName || !guardianName || !relation || !address || !dob || !phone || !whatsapp || !email || !password) {
//             return NextResponse.json({ error: "❌ Missing required fields" }, { status: 400 });
//         }

//         // Handle File Uploads
//         const uploadFolder = path.join(process.cwd(), "public/uploads", email);
//         await fs.mkdir(uploadFolder, { recursive: true });

//         const filePaths = {};
//         const fileFields = ["aadhaar", "tc", "pupilPhoto", "signature"];

//         for (const key of fileFields) {
//             const file = formData.get(key);
//             if (file && file.name) {
//                 const filePath = path.join(uploadFolder, file.name);
//                 const fileBuffer = await file.arrayBuffer();
//                 await fs.writeFile(filePath, Buffer.from(new Uint8Array(fileBuffer)));
//                 filePaths[key] = `/uploads/${email}/${file.name}`; // ✅ Fix file paths
//             }
//         }

//         // Connect to MongoDB
//         const client = await clientPromise;
//         const db = client.db("admission_management");

//         // Assign Role (First User → Admin, Second → Subadmin, Others → User)
//         const userCount = await db.collection("users").countDocuments();
//         let role = userCount === 0 ? "admin" : userCount === 1 ? "subadmin" : "user";

//         // Create user in Firebase Authentication
//         let user;
//         try {
//             const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//             user = userCredential.user;
//             console.log("✅ Firebase User Created:", user.uid);
//         } catch (firebaseError) {
//             return NextResponse.json({ error: firebaseError.message }, { status: 500 });
//         }

//         // ✅ Store Admission Data in MongoDB
//         await db.collection("admissions").insertOne({
//             uid: user.uid,
//             name, fatherName, motherName, guardianName, relation,
//             address, dob, phone, whatsapp, email,
//             files: filePaths, // ✅ Store file paths
//             createdAt: new Date()
//         });

//         // ✅ Store User Data in MongoDB
//         await db.collection("users").insertOne({
//             uid: user.uid,
//             name, email, phone, role,
//             files: filePaths, // ✅ Store file paths
//             createdAt: new Date()
//         });

//         return NextResponse.json({ message: "✅ Admission and user registration successful", role }, { status: 201 });

//     } catch (error) {
//         console.error("❌ Error Processing Admission:", error);
//         return NextResponse.json({ error: "❌ Internal server error" }, { status: 500 });
//     }
// }



// import { NextResponse } from "next/server";
// import { createClient } from "webdav";
// import clientPromise from "@/lib/mongodb";
// import { auth, createUserWithEmailAndPassword } from "@/lib/firebase";

// export async function POST(request) {
//     try {
//         const formData = await request.formData();
//         console.log("📤 Received Admission Data");

//         // Extract fields from FormData
//         const extractedData = {};
//         for (const [key, value] of formData.entries()) {
//             extractedData[key] = value;
//         }

//         const { name, fatherName, motherName, guardianName, relation, address, dob, phone, whatsapp, email, password } = extractedData;

//         // Ensure required fields are filled
//         if (!name || !fatherName || !motherName || !guardianName || !relation || !address || !dob || !phone || !whatsapp || !email || !password) {
//             return NextResponse.json({ error: "❌ Missing required fields" }, { status: 400 });
//         }

//         // Setup Nextcloud WebDAV Client
//         const webdavClient = createClient(
//             process.env.NEXTCLOUD_URL, {
//                 username: process.env.NEXTCLOUD_USERNAME,
//                 password: process.env.NEXTCLOUD_PASSWORD
//             }
//         );

//         // Handle File Uploads to Nextcloud
//         const filePaths = {};
//         const fileFields = ["aadhaar", "tc", "pupilPhoto", "signature"];

//         for (const key of fileFields) {
//             const file = formData.get(key);
//             if (file && file.name) {
//                 const filePath = `/webuploads/${email}/${file.name}`; // Path on Nextcloud
//                 console.log(`Uploading to: ${filePath}`);
//                 await webdavClient.putFileContents(filePath, file.stream(), {
//                     overwrite: true,
//                     contentLength: file.size
//                 });
//                 filePaths[key] = filePath; // Store WebDAV path instead of local path
//             }
//         }

//         // Connect to MongoDB
//         const client = await clientPromise;
//         const db = client.db("admission_management");

//         // Assign Role (First User → Admin, Second → Subadmin, Others → User)
//         const userCount = await db.collection("users").countDocuments();
//         let role = userCount === 0 ? "admin" : userCount === 1 ? "subadmin" : "user";

//         // Create user in Firebase Authentication
//         let user;
//         try {
//             const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//             user = userCredential.user;
//             console.log("✅ Firebase User Created:", user.uid);
//         } catch (firebaseError) {
//             return NextResponse.json({ error: firebaseError.message }, { status: 500 });
//         }

//         // Store Admission Data in MongoDB
//         await db.collection("admissions").insertOne({
//             uid: user.uid,
//             name, fatherName, motherName, guardianName, relation,
//             address, dob, phone, whatsapp, email,
//             files: filePaths, // Store Nextcloud file paths
//             createdAt: new Date()
//         });

//         // Store User Data in MongoDB
//         await db.collection("users").insertOne({
//             uid: user.uid,
//             name, email, phone, role,
//             files: filePaths, // Store Nextcloud file paths
//             createdAt: new Date()
//         });

//         return NextResponse.json({ message: "✅ Admission and user registration successful", role }, { status: 201 });

//     } catch (error) {
//         console.error("❌ Error Processing Admission:", error);
//         return NextResponse.json({ error: "❌ Internal server error" }, { status: 500 });
//     }
// }



// import { NextResponse } from "next/server";
// import { createClient } from "webdav";
// import clientPromise from "@/lib/mongodb";
// import { auth, createUserWithEmailAndPassword } from "@/lib/firebase";

// export async function POST(request) {
//     try {
//         const formData = await request.formData();
//         console.log("📤 Received Admission Data");

//         // Extract user data
//         const extractedData = {};
//         for (const [key, value] of formData.entries()) {
//             extractedData[key] = value;
//         }

//         const { name, fatherName, motherName, guardianName, relation, address, dob, phone, whatsapp, email, password } = extractedData;

//         if (!name || !fatherName || !motherName || !guardianName || !relation || !address || !dob || !phone || !whatsapp || !email || !password) {
//             return NextResponse.json({ error: "❌ Missing required fields" }, { status: 400 });
//         }

//         // ✅ WebDAV CLIENT (WITH EXPLICIT AUTH)
//         const webdavClient = createClient(process.env.NEXTCLOUD_URL, {
//             username: process.env.NEXTCLOUD_USERNAME,
//             password: process.env.NEXTCLOUD_PASSWORD,
//             headers: {
//                 "Authorization": `Basic ${Buffer.from(
//                     `${process.env.NEXTCLOUD_USERNAME}:${process.env.NEXTCLOUD_PASSWORD}`
//                 ).toString("base64")}`
//             }
//         });
        
//         // ✅ FIXED UPLOAD DIRECTORY
//         const baseDirectory = "/webuploads/";

//         console.log(`Uploading files to: ${baseDirectory}`);

//         // ✅ HANDLE FILE UPLOADS
//         const filePaths = {};
//         const fileFields = ["aadhaar", "tc", "pupilPhoto", "signature"];

//         for (const key of fileFields) {
//             const file = formData.get(key);
//             if (file && file.name) {
//                 const encodedFileName = encodeURIComponent(file.name);
//                 const filePath = `${baseDirectory}${encodedFileName}`;

//                 console.log(`Uploading to: ${filePath}`);

//                 try {
//                     await webdavClient.putFileContents(filePath, file.stream(), {
//                         overwrite: true,
//                         contentLength: file.size
//                     });
//                     filePaths[key] = filePath;
//                     console.log(`✅ File uploaded successfully: ${filePath}`);
//                 } catch (uploadError) {
//                     console.error("❌ Failed to upload file:", uploadError);
//                     console.error("❌ Error Status:", uploadError.response?.status);
//                     console.error("❌ Error Message:", uploadError.response?.data);
//                     return NextResponse.json({ error: "❌ File upload failed", details: uploadError.message }, { status: 401 });
//                 }
//             }
//         }

//         // ✅ CONNECT TO MONGODB
//         const client = await clientPromise;
//         const db = client.db("admission_management");

//         // ✅ ASSIGN ROLE BASED ON USER COUNT
//         const userCount = await db.collection("users").countDocuments();
//         let role = userCount === 0 ? "admin" : userCount === 1 ? "subadmin" : "user";

//         // ✅ CREATE USER IN FIREBASE AUTHENTICATION
//         let user;
//         try {
//             const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//             user = userCredential.user;
//             console.log("✅ Firebase User Created:", user.uid);
//         } catch (firebaseError) {
//             console.error("❌ Error during Firebase Authentication:", firebaseError);
//             return NextResponse.json({ error: firebaseError.message }, { status: 500 });
//         }

//         // ✅ STORE ADMISSION DATA IN MONGODB
//         await db.collection("admissions").insertOne({
//             uid: user.uid,
//             name, fatherName, motherName, guardianName, relation,
//             address, dob, phone, whatsapp, email,
//             files: filePaths,
//             createdAt: new Date()
//         });

//         // ✅ STORE USER DATA IN MONGODB
//         await db.collection("users").insertOne({
//             uid: user.uid,
//             name, email, phone, role,
//             files: filePaths,
//             createdAt: new Date()
//         });

//         return NextResponse.json({ message: "✅ Admission and user registration successful", role }, { status: 201 });

//     } catch (error) {
//         console.error("❌ Error Processing Admission:", error);
//         return NextResponse.json({ error: "❌ Internal server error", details: error.message }, { status: 500 });
//     }
// }



import { NextResponse } from "next/server";
import { createClient } from "webdav";
import clientPromise from "@/lib/mongodb";
import { auth, createUserWithEmailAndPassword } from "@/lib/firebase";

export async function POST(request) {
    try {
        const formData = await request.formData();
        console.log("📤 Received Admission Data");

        // Extract user data
        const extractedData = {};
        for (const [key, value] of formData.entries()) {
            extractedData[key] = value;
        }

        const { name, fatherName, motherName, guardianName, relation, address, dob, phone, whatsapp, email, password } = extractedData;

        if (!name || !fatherName || !motherName || !guardianName || !relation || !address || !dob || !phone || !whatsapp || !email || !password) {
            return NextResponse.json({ error: "❌ Missing required fields" }, { status: 400 });
        }

        // ✅ WebDAV CLIENT (WITH EXPLICIT AUTH)
        const webdavClient = createClient(process.env.NEXTCLOUD_URL, {
            username: process.env.NEXTCLOUD_USERNAME,
            password: process.env.NEXTCLOUD_PASSWORD,
            headers: {
                "Authorization": `Basic ${Buffer.from(
                    `${process.env.NEXTCLOUD_USERNAME}:${process.env.NEXTCLOUD_PASSWORD}`
                ).toString("base64")}`
            }
        });

        // ✅ FIXED UPLOAD DIRECTORY
        const baseDirectory = "/webuploads/";

        console.log(`Uploading files to: ${baseDirectory}`);

        // ✅ HANDLE FILE UPLOADS (FIXED FILE BUFFER ISSUE)
        const filePaths = {};
        const fileFields = ["aadhaar", "tc", "pupilPhoto", "signature"];

        for (const key of fileFields) {
            const file = formData.get(key);
            if (file && file.name) {
                const encodedFileName = encodeURIComponent(file.name);
                const filePath = `${baseDirectory}${encodedFileName}`;

                console.log(`Uploading to: ${filePath}`);

                try {
                    // ✅ Convert file to Buffer to avoid corruption
                    const fileBuffer = Buffer.from(await file.arrayBuffer());
                    
                    await webdavClient.putFileContents(filePath, fileBuffer, { overwrite: true });
                    
                    filePaths[key] = filePath;
                    console.log(`✅ File uploaded successfully: ${filePath}`);
                } catch (uploadError) {
                    console.error("❌ Failed to upload file:", uploadError);
                    return NextResponse.json({ error: "❌ File upload failed", details: uploadError.message }, { status: 401 });
                }
            }
        }

        // ✅ CONNECT TO MONGODB
        const client = await clientPromise;
        const db = client.db("admission_management");

        // ✅ ASSIGN ROLE BASED ON USER COUNT
        const userCount = await db.collection("users").countDocuments();
        let role = userCount === 0 ? "admin" : userCount === 1 ? "subadmin" : "user";

        // ✅ CREATE USER IN FIREBASE AUTHENTICATION
        let user;
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            user = userCredential.user;
            console.log("✅ Firebase User Created:", user.uid);
        } catch (firebaseError) {
            console.error("❌ Error during Firebase Authentication:", firebaseError);
            return NextResponse.json({ error: firebaseError.message }, { status: 500 });
        }

        // ✅ STORE ADMISSION DATA IN MONGODB
        await db.collection("admissions").insertOne({
            uid: user.uid,
            name, fatherName, motherName, guardianName, relation,
            address, dob, phone, whatsapp, email,
            files: filePaths,
            createdAt: new Date()
        });

        // ✅ STORE USER DATA IN MONGODB
        await db.collection("users").insertOne({
            uid: user.uid,
            name, email, phone, role,
            files: filePaths,
            createdAt: new Date()
        });

        return NextResponse.json({ message: "✅ Admission and user registration successful", role }, { status: 201 });

    } catch (error) {
        console.error("❌ Error Processing Admission:", error);
        return NextResponse.json({ error: "❌ Internal server error", details: error.message }, { status: 500 });
    }
}
