import { NextRequest, NextResponse } from "next/server";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/firebase";
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    const { username, email, password } = await req.json();

    if (!username || !email || !password) {
      return NextResponse.json(
        { success: false, message: "Required fields are missing." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const usersCollection = collection(db, "users");
    await addDoc(usersCollection, {
      username,
      email,
      password: hashedPassword, 
      createdAt: new Date(),
    });

    return NextResponse.json(
      { success: true, message: "User registered successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Failed to register user." },
      { status: 500 }
    );
  }
}
