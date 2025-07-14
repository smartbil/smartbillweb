"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useClientAuth } from "@/app/hooks/useClientAuth";
import Button from "@/app/components/button"; 
import Link from "next/link";
import LoginInput from "@/app/components/logininput";
import Swal from "sweetalert2";

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login, isAuthenticatedAndHydrated, user, checkSessionExpiry } = useClientAuth();

  // Redirect authenticated users
  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      // Check if user is already authenticated after hydration
      if (isAuthenticatedAndHydrated && user?.token) {
        // Verify the session is still valid
        const sessionValid = checkSessionExpiry();
        if (sessionValid) {
          // Try to verify with server
          try {
            const response = await fetch('/api/auth/verify', {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${user.token}`,
                'Content-Type': 'application/json',
              },
            });

            if (response.ok) {
              // User is authenticated, redirect to home
              router.push('/client/home');
              return;
            }
          } catch {
            // If verification fails, user can stay on sign-in page
            console.log('Session verification failed, staying on sign-in');
          }
        }
      }
    };

    checkAuthAndRedirect();
  }, [isAuthenticatedAndHydrated, user, router, checkSessionExpiry]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email and password cannot be empty.");
      Swal.fire({
        icon: "warning",
        title: "Missing Fields",
        text: "Email and password cannot be empty.",
      });
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: data.message || "Login failed",
        });
        throw new Error(data.message || "Login failed");
      }

      login({
        uid: data.uid,
        email: data.user.email,
        username: data.user.username,
        token: data.token
      });

      await Swal.fire({
        icon: "success",
        title: "Login Successful",
        text: "Welcome back!",
      });

      router.push("/client/home");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: err instanceof Error ? err.message : "Login failed",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-soft px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-2xl border border-gray-200">
        <h2 className="text-3xl font-bold text-primary text-center mb-6">Sign In</h2>
        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          <LoginInput
            label="Email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            
          />
          <LoginInput
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            
          />
          {error && <p className="text-danger text-sm text-center font-medium">{error}</p>}
          <Button
            text={loading ? "Signing In..." : "Sign In"}
            type="submit"
            disabled={loading}
          />
        </form>
        <p className="mt-6 text-sm text-center text-secondary">
          Don&apos;t have an account?{" "}
          <Link href="/client/sign-up" className="text-accent hover:underline font-semibold">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}