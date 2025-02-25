


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

//         // ✅ HANDLE FILE UPLOADS (FIXED FILE BUFFER ISSUE)
//         const filePaths = {};
//         const fileFields = ["aadhaar", "tc", "pupilPhoto", "signature"];

//         for (const key of fileFields) {
//             const file = formData.get(key);
//             if (file && file.name) {
//                 const encodedFileName = encodeURIComponent(file.name);
//                 const filePath = `${baseDirectory}${encodedFileName}`;

//                 console.log(`Uploading to: ${filePath}`);

//                 try {
//                     // ✅ Convert file to Buffer to avoid corruption
//                     const fileBuffer = Buffer.from(await file.arrayBuffer());
                    
//                     await webdavClient.putFileContents(filePath, fileBuffer, { overwrite: true });
                    
//                     filePaths[key] = filePath;
//                     console.log(`✅ File uploaded successfully: ${filePath}`);
//                 } catch (uploadError) {
//                     console.error("❌ Failed to upload file:", uploadError);
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



// export const config = {
//     runtime: "edge", // Optional: Use Edge Functions for faster execution
// };

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

//         // ✅ Return response IMMEDIATELY before background processing
//         const response = NextResponse.json({ message: "✅ Admission submitted, processing in background" }, { status: 202 });

//         // ✅ Run File Upload & Database Operations in Background
//         (async () => {
//             try {
//                 // ✅ Setup WebDAV Client
//                 const webdavClient = createClient(process.env.NEXTCLOUD_URL, {
//                     username: process.env.NEXTCLOUD_USERNAME,
//                     password: process.env.NEXTCLOUD_PASSWORD,
//                     headers: {
//                         "Authorization": `Basic ${Buffer.from(
//                             `${process.env.NEXTCLOUD_USERNAME}:${process.env.NEXTCLOUD_PASSWORD}`
//                         ).toString("base64")}`
//                     }
//                 });

//                 // ✅ Set Upload Directory
//                 const baseDirectory = "/webuploads/";
//                 console.log(`Uploading files to: ${baseDirectory}`);

//                 // ✅ Handle File Uploads
//                 const filePaths = {};
//                 const fileFields = ["aadhaar", "tc", "pupilPhoto", "signature"];

//                 for (const key of fileFields) {
//                     const file = formData.get(key);
//                     if (file && file.name) {
//                         const encodedFileName = encodeURIComponent(file.name);
//                         const filePath = `${baseDirectory}${encodedFileName}`;

//                         console.log(`Uploading to: ${filePath}`);

//                         try {
//                             // ✅ Convert file to Buffer before uploading
//                             const fileBuffer = Buffer.from(await file.arrayBuffer());

//                             await webdavClient.putFileContents(filePath, fileBuffer, { overwrite: true });

//                             filePaths[key] = filePath;
//                             console.log(`✅ File uploaded successfully: ${filePath}`);
//                         } catch (uploadError) {
//                             console.error("❌ Failed to upload file:", uploadError);
//                         }
//                     }
//                 }

//                 // ✅ Connect to MongoDB
//                 const client = await clientPromise;
//                 const db = client.db("admission_management");

//                 // ✅ Assign Role (First User → Admin, Second → Subadmin, Others → User)
//                 const userCount = await db.collection("users").countDocuments();
//                 let role = userCount === 0 ? "admin" : userCount === 1 ? "subadmin" : "user";

//                 // ✅ Create User in Firebase Authentication
//                 let user;
//                 try {
//                     const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//                     user = userCredential.user;
//                     console.log("✅ Firebase User Created:", user.uid);
//                 } catch (firebaseError) {
//                     console.error("❌ Error during Firebase Authentication:", firebaseError);
//                     return;
//                 }

//                 // ✅ Store Admission Data in MongoDB
//                 await db.collection("admissions").insertOne({
//                     uid: user.uid,
//                     name, fatherName, motherName, guardianName, relation,
//                     address, dob, phone, whatsapp, email,
//                     files: filePaths,
//                     createdAt: new Date()
//                 });

//                 // ✅ Store User Data in MongoDB
//                 await db.collection("users").insertOne({
//                     uid: user.uid,
//                     name, email, phone, role,
//                     files: filePaths,
//                     createdAt: new Date()
//                 });

//                 console.log("✅ Admission and user registration processed successfully.");
//             } catch (error) {
//                 console.error("❌ Error Processing Admission in Background:", error);
//             }
//         })();

//         return response;

//     } catch (error) {
//         console.error("❌ Error Processing Admission:", error);
//         return NextResponse.json({ error: "❌ Internal server error", details: error.message }, { status: 500 });
//     }
// }



export const config = {
    runtime: "edge",
};

import { NextResponse } from "next/server";
import { createClient } from "webdav";
import clientPromise from "@/lib/mongodb";
import { auth, createUserWithEmailAndPassword } from "@/lib/firebase";

export async function POST(request) {
    try {
        const formData = await request.formData();
        console.log("📤 Received Admission Data");

        // ✅ Convert FormData to JSON (Fix MongoDB issue)
        const extractedData = {};
        for (const [key, value] of formData.entries()) {
            extractedData[key] = value;
        }

        const { name, fatherName, motherName, guardianName, relation, address, dob, phone, whatsapp, email, password } = extractedData;

        if (!name || !fatherName || !motherName || !guardianName || !relation || !address || !dob || !phone || !whatsapp || !email || !password) {
            return NextResponse.json({ error: "❌ Missing required fields" }, { status: 400 });
        }

        // ✅ Return Response Before Uploading to Prevent Timeout
        const response = NextResponse.json({ message: "✅ Admission submitted, processing in background" }, { status: 202 });

        // ✅ Run Upload & Database Operations in Background
        (async () => {
            try {
                // ✅ Fix MongoDB Connection Issue
                const client = await clientPromise;
                const db = client.db("admission_management");

                // ✅ Setup WebDAV Client (Fix 423 Locked Error)
                const webdavClient = createClient(process.env.NEXTCLOUD_URL, {
                    username: process.env.NEXTCLOUD_USERNAME,
                    password: process.env.NEXTCLOUD_PASSWORD,
                    headers: {
                        "Authorization": `Basic ${Buffer.from(
                            `${process.env.NEXTCLOUD_USERNAME}:${process.env.NEXTCLOUD_PASSWORD}`
                        ).toString("base64")}`
                    }
                });

                // ✅ Set Upload Directory
                const baseDirectory = "/webuploads/";
                console.log(`Uploading files to: ${baseDirectory}`);

                // ✅ Handle File Uploads (Fix 423 Locked Error)
                const filePaths = {};
                const fileFields = ["aadhaar", "tc", "pupilPhoto", "signature"];

                for (const key of fileFields) {
                    const file = formData.get(key);
                    if (file && file.name) {
                        const encodedFileName = encodeURIComponent(file.name);
                        const filePath = `${baseDirectory}${encodedFileName}`;

                        console.log(`Uploading to: ${filePath}`);

                        try {
                            // ✅ Convert file to Buffer before uploading
                            const fileBuffer = Buffer.from(await file.arrayBuffer());

                            // ✅ Fix 423 Locked Error by ensuring overwrite
                            await webdavClient.putFileContents(filePath, fileBuffer, {
                                overwrite: true,
                                onError: (error) => {
                                    console.error(`❌ WebDAV Upload Failed: ${error}`);
                                }
                            });

                            filePaths[key] = filePath;
                            console.log(`✅ File uploaded successfully: ${filePath}`);
                        } catch (uploadError) {
                            console.error("❌ Failed to upload file:", uploadError);
                        }
                    }
                }

                // ✅ Assign Role (First User → Admin, Second → Subadmin, Others → User)
                const userCount = await db.collection("users").countDocuments();
                let role = userCount === 0 ? "admin" : userCount === 1 ? "subadmin" : "user";

                // ✅ Ensure Firebase Authentication Completes
                let user;
                try {
                    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                    user = userCredential.user;
                    console.log("✅ Firebase User Created:", user.uid);
                } catch (firebaseError) {
                    console.error("❌ Firebase Authentication Failed:", firebaseError);
                    return;
                }

                // ✅ Store Admission Data in MongoDB
                await db.collection("admissions").insertOne({
                    uid: user.uid,
                    name, fatherName, motherName, guardianName, relation,
                    address, dob, phone, whatsapp, email,
                    files: filePaths,
                    createdAt: new Date()
                });

                // ✅ Store User Data in MongoDB
                await db.collection("users").insertOne({
                    uid: user.uid,
                    name, email, phone, role,
                    files: filePaths,
                    createdAt: new Date()
                });

                console.log("✅ Admission and user registration processed successfully.");
            } catch (error) {
                console.error("❌ Error Processing Admission in Background:", error);
            }
        })();

        return response;

    } catch (error) {
        console.error("❌ Error Processing Admission:", error);
        return NextResponse.json({ error: "❌ Internal server error", details: error.message }, { status: 500 });
    }
}
