"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { signUp, setUserName } from "../_lib/data-service";
import { useState } from "react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registered, setRegistered] = useState(false);
  const [errors, setErrors] = useState<string | null>(null);

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    try {
      const { user } = await signUp(email, password);
      if (user) {
        await setUserName(user.id, name, "customer");
        setRegistered(true);
        setErrors(null);
        setName("");
        setEmail("");
        setPassword("");
      }
    } catch (error) {
      setErrors(String(error));
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50">
      <div className="bg-white p-10 rounded-2xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Registrieren</h2>
        <form className="flex flex-col gap-4" onSubmit={handleSignUp}>
          <input
            type="text"
            placeholder="Name"
            className="border rounded-lg px-4 py-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
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
            Konto erstellen
          </Button>
        </form>
        <p className="text-sm text-center mt-4">
          Bereits registriert?{" "}
          <Link href="/login" className="text-amber-600 hover:underline">
            Jetzt anmelden
          </Link>
        </p>
        <p className="text-sm text-center mt-4">
          oder züruck{" "}
          <Link href="/" className="text-amber-600 hover:underline">
            zu Startseite
          </Link>
        </p>
        {registered ? (
          <div className="text-center py-4">
            <p className="mb-4 text-green-900">
              Sie haben eine Registrierungsemail bekommen. bitte bestätigen Sie
              Ihre E-Mail und dann melde Sie sich an.
            </p>
          </div>
        ) : null}
        {errors ? (
          <div className="mt-4 text-red-600 text-center">{errors}</div>
        ) : null}
      </div>
    </div>
  );
}
