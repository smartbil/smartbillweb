import { NextRequest, NextResponse } from "next/server";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
// import { sendDeletionEmail } from "@/app/utils/sendDeletionEmail";

if (!getApps().length) {
    initializeApp({
        credential: cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        }),
    });
}

const db = getFirestore();

// This function backs up and deletes the user document and its subcollections
async function backupAndDeleteUserData(uid: string) {
    const userRef = db.collection("users").doc(uid);
    const userSnap = await userRef.get();

    if (!userSnap.exists) return;

    // Move main user document
    await db.collection("deletions").doc(uid).set({
        ...userSnap.data(),
        deletedAt: new Date(),
    });

    // List subcollections
    const subcollections = await userRef.listCollections();
    for (const subCol of subcollections) {
        const docs = await subCol.get();
        for (const docSnap of docs.docs) {
            // Backup
            await db
                .collection("deletions")
                .doc(uid)
                .collection(subCol.id)
                .doc(docSnap.id)
                .set(docSnap.data());

            // Delete original
            await docSnap.ref.delete();
        }
    }

    // Delete main user doc
    await userRef.delete();
}

export async function DELETE(req: NextRequest) {
    try {
        const authHeader = req.headers.get("authorization");
        if (!authHeader?.startsWith("Bearer ")) {
            return NextResponse.json({ success: false, message: "Missing token." }, { status: 401 });
        }

        const idToken = authHeader.split("Bearer ")[1];

        const auth = getAuth();
        const decoded = await auth.verifyIdToken(idToken);
        const uid = decoded.uid;
        // const email = decoded.email;

        await backupAndDeleteUserData(uid);

        // Delete the user from Firebase Authentication
        await auth.deleteUser(uid);

        // Log audit event
        await db.collection("audit_logs").add({
            uid,
            action: "delete_account",
            timestamp: new Date(),
            userAgent: req.headers.get("user-agent") || "unknown",
        });

        // Send deletion email
        // if (email) {
        //     await sendDeletionEmail(email, uid);
        // }

        return NextResponse.json({ success: true, message: "User deleted" }, { status: 200 });
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.error("Account deletion error:", err.message);
            return NextResponse.json(
                { success: false, message: err.message },
                { status: 500 }
            );
        }

        console.error("Account deletion error:", err);
        return NextResponse.json(
            { success: false, message: "Failed to delete account" },
            { status: 500 }
        );
    }
}