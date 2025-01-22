import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import clientPromise from "@/lib/mongodb";

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const email = searchParams.get("email");

        if (!email) {
            return NextResponse.json({ error: "❌ Email is required" }, { status: 400 });
        }

        console.log(`📥 Generating Application PDF for: ${email}`);

        // ✅ Connect to MongoDB
        const client = await clientPromise;
        const db = client.db("admission_management");

        // ✅ Fetch user details
        const user = await db.collection("admissions").findOne({ email });

        if (!user) {
            console.error(`❌ User not found for email: ${email}`);
            return NextResponse.json({ error: "❌ User not found" }, { status: 404 });
        }

        console.log("✅ User Data Found:", user);

        // ✅ Define PDF Path
        const userFolder = path.join(process.cwd(), "public/uploads", email);
        await fs.mkdir(userFolder, { recursive: true });

        const pdfPath = path.join(userFolder, "application_form.pdf");

        // ✅ Create a New PDF Document
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([600, 850]);

        // ✅ Load Fonts
        const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

        // ✅ Add Application Title
        page.drawText("ADMISSION APPLICATION FORM", {
            x: 150,
            y: 800,
            size: 18,
            font,
            color: rgb(0, 0.2, 0.8), // Blue title
        });

        // ✅ Profile Photo (Only Pupil's Photo)
        let profileImage;
        if (user.files?.pupilPhoto) {
            try {
                const photoPath = path.join(process.cwd(), "public", user.files.pupilPhoto);
                const photoBytes = await fs.readFile(photoPath);
                profileImage = await pdfDoc.embedJpg(photoBytes).catch(() => pdfDoc.embedPng(photoBytes));

                page.drawImage(profileImage, {
                    x: 450,
                    y: 700,
                    width: 100,
                    height: 100,
                });
            } catch (error) {
                console.warn("⚠️ Error embedding profile photo:", error);
            }
        }

        // ✅ Add User Information
        let yPosition = 750;
        const textSize = 12;
        const lineHeight = 22;

        const addText = (label, value) => {
            yPosition -= lineHeight;
            page.drawText(`${label}:`, { x: 50, y: yPosition, size: textSize, font, color: rgb(0, 0, 0) });
            page.drawText(value || "N/A", { x: 200, y: yPosition, size: textSize, color: rgb(0, 0, 0) });
        };

        addText("Name", user.name);
        addText("Father's Name", user.fatherName);
        addText("Mother's Name", user.motherName);
        addText("Guardian Name", user.guardianName);
        addText("Relation", user.relation);
        addText("Address", user.address);
        addText("Date of Birth", user.dob);
        addText("Phone", user.phone);
        addText("WhatsApp", user.whatsapp);
        addText("Email", user.email);
        addText("Date", new Date().toLocaleDateString());

        // ✅ Save the PDF
        const pdfBytes = await pdfDoc.save();
        await fs.writeFile(pdfPath, pdfBytes);

        console.log(`✅ PDF Saved at: ${pdfPath}`);

        return NextResponse.json({
            message: "✅ PDF Generated Successfully",
            pdfUrl: `/uploads/${email}/application_form.pdf`,
        }, { status: 201 });

    } catch (error) {
        console.error("❌ Error generating PDF:", error);
        return NextResponse.json({ error: "❌ Internal server error" }, { status: 500 });
    }
}
