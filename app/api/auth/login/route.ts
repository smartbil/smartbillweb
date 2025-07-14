import { NextRequest, NextResponse } from "next/server";
import { doc, getDoc } from "firebase/firestore";
import { signInWithEmailAndPassword } from "firebase/auth";
import { FirebaseError } from "firebase/app"; 
import { auth, db } from "@/firebase";

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json(
                { success: false, message: "Required fields are missing." },
                { status: 400 }
            );
        }

        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
            return NextResponse.json(
                { success: false, message: "User data not found." },
                { status: 400 }
            );
        }

        const userData = userDoc.data();
        const token = await user.getIdToken();

        // Create response with secure cookies
        const response = NextResponse.json({
            success: true,
            message: "User logged in successfully.",
            uid: user.uid,
            user: {
                email: userData.email,
                username: userData.username,
                uid: user.uid,
                isAdmin: userData.isAdmin || false
            },
            token,
        }, { status: 200 });

        // Set secure HTTP-only cookie for the token
        response.cookies.set("client-auth-token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: "/",
        });

        return response;

    } catch (error) {
        console.error("Login error:", error);

        if (error instanceof FirebaseError) {
            switch (error.code) {
                case 'auth/user-not-found':
                case 'auth/wrong-password':
                case 'auth/invalid-credential':
                    return NextResponse.json(
                        { success: false, message: "Invalid email or password" },
                        { status: 401 }
                    );
                case 'auth/too-many-requests':
                    return NextResponse.json(
                        { success: false, message: "Too many attempts. Try again later" },
                        { status: 429 }
                    );
                default:
                    return NextResponse.json(
                        { success: false, message: "Authentication error" },
                        { status: 400 }
                    );
            }
        }

        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}