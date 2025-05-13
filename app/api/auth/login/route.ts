import { NextRequest, NextResponse } from "next/server";
import { collection, query, where, getDocs } from "firebase/firestore";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from "@/firebase";

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json(
                { success: false, message: "Required fields are missing." },
                { status: 400 }
            );
        }

        const usersCollection = collection(db, "users");
        const q = query(usersCollection, where("email", "==", email));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return NextResponse.json(
                { success: false, message: "Invalid email or password." },
                { status: 400 }
            );
        }

        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();

        const isPasswordValid = await bcrypt.compare(password, userData.password);

        if (!isPasswordValid) {
            return NextResponse.json(
                { success: false, message: "Invalid email or password." },
                { status: 400 }
            );
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: _, ...userWithoutPassword } = userData;

        const jwtSecret = process.env.JWT_SECRET
        if (!jwtSecret) {
            throw new Error("JWT secret is not defined.");
        }

        const token = jwt.sign(
            { email: userWithoutPassword.email, id: userDoc.id },
            jwtSecret,
            { expiresIn: "2h" }
        );

        return NextResponse.json(
            {
                success: true,
                message: "User logged in successfully.",
                id: userDoc.id,
                user: userWithoutPassword,
                token,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error during login:", error);
        return NextResponse.json(
            { success: false, message: "Failed to log in the user." },
            { status: 500 }
        );
    }
}
