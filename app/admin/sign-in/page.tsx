"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAdminAuthStore } from "@/app/store/adminAuthStore";
import Button from "@/app/components/button"; 
import LoginInput from "@/app/components/logininput";
import Swal from "sweetalert2";

export default function SignIn() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login, logout } = useAdminAuthStore();

  useEffect(() => {
    // Clear any existing authentication
    const clearAuth = async () => {
      await logout();
      
      // Clear admin auth cookie
      document.cookie = 'admin-auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    };
    
    clearAuth();
    
    // Handle error messages from URL parameters
    const urlError = searchParams.get('error');
    if (urlError) {
      let errorMessage = '';
      switch (urlError) {
        case 'unauthorized':
          errorMessage = 'You do not have admin privileges to access this area.';
          break;
        case 'invalid-token':
          errorMessage = 'Your session has expired. Please sign in again.';
          break;
        case 'verification-failed':
          errorMessage = 'Unable to verify your admin access. Please try again.';
          break;
        default:
          errorMessage = 'An error occurred. Please sign in again.';
      }
      
      setError(errorMessage);
      Swal.fire({
        icon: 'warning',
        title: 'Access Required',
        text: errorMessage,
      });
    }
  }, [logout, searchParams]);

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

      // Check if user has admin privileges
      if (!data.user.isAdmin) {
        Swal.fire({
          icon: "error",
          title: "Access Denied",
          text: "You do not have admin privileges to access this dashboard.",
        });
        throw new Error("Admin access required");
      }

      // Store admin auth token in cookie for middleware
      document.cookie = `admin-auth-token=${data.token}; path=/; secure; samesite=strict; max-age=${7 * 24 * 60 * 60}`; // 7 days

      login({
        uid: data.uid,
        email: data.user.email,
        username: data.user.username,
        token: data.token,
        isAdmin: data.user.isAdmin || false,
      });

      await Swal.fire({
        icon: "success",
        title: "Login Successful",
        text: "Welcome to the admin dashboard!",
      });

      router.push("/admin/dashboard");
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
      </div>
    </div>
  );
}