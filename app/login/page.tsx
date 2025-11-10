"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { signIn } from "../_lib/data-service";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handlelogin(e: React.FormEvent) {
    e.preventDefault();
    // Implement login functionality here
    try {
      // Example: await signIn(email, password);
      const data = await signIn(email, password);
      if (data.user) {
        console.log("gut gemacht!");
        setEmail("");
        setPassword("");
        router.push("/", { scroll: false });
      }
    } catch (error) {
      // Handle errors here
      console.error("Login failed:", error);
      setError(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    }
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50">
      <div className="bg-white p-10 rounded-2xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Anmelden</h2>
        <form className="flex flex-col gap-4" onSubmit={handlelogin}>
          <input
            type="email"
            placeholder="E-Mail"
            className="border rounded-lg px-4 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Passwort"
            className="border rounded-lg px-4 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button className="bg-amber-600 hover:bg-amber-700 text-white w-full">
            Login
          </Button>
        </form>
        <p className="text-sm text-center mt-4">
          Kein Konto?{" "}
          <Link href="/register" className="text-amber-600 hover:underline">
            Jetzt registrieren
          </Link>
        </p>
        <p className="text-sm text-center mt-4">
          oder züruck{" "}
          <Link href="/" className="text-amber-600 hover:underline">
            zu Startseite
          </Link>
        </p>
        <p className="text-red-600 text-center mt-4">
          {error && <span>{error}</span>}
        </p>
      </div>
    </div>
  );
}
