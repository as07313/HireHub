// app/auth/verify/page.tsx
// app/auth/verify/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EmailVerificationPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [token, setToken] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  useEffect(() => {
    // Retrieve email and token from localStorage
    const storedEmail = localStorage.getItem("verifyEmail");
    const storedToken = localStorage.getItem("verifyToken");
    if (storedEmail) {
      setEmail(storedEmail);
    }
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  async function handleVerification() {
    setIsVerifying(true);
    try {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, code })
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message || "Email verified and account created successfully!");
        // Clear temporary storage
        localStorage.removeItem("verifyEmail");
        localStorage.removeItem("verifyToken");
        // Redirect to login page after a short delay
        setTimeout(() => {
          router.push("/candidate/auth/login");
        }, 2000);
      } else {
        setMessage(data.error || "Verification failed");
      }
    } catch (error) {
      setMessage("An error occurred");
    } finally {
      setIsVerifying(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-6">
      <h1 className="text-2xl font-bold">Verify Your Email</h1>
      <p>
        A 6-digit code was sent to <strong>{email}</strong>. Please enter it below:
      </p>
      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="6-digit code"
        className="border p-2 rounded"
      />
      <button
        onClick={handleVerification}
        disabled={isVerifying}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {isVerifying ? "Verifying..." : "Verify"}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
}