"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useStore } from "@/lib/store";

export function AuthModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { user, login, logout, register, settings } = useStore();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [note, setNote] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button className="absolute inset-0 bg-ink/40" onClick={onClose} />
      <aside className="absolute right-0 top-0 h-full w-full max-w-md bg-paper p-8 overflow-auto">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted">{settings.name}</p>
            <h2 className="font-display text-4xl mt-1">
              {user ? `Hello, ${user.name}` : mode === "register" ? "Create account" : "Login"}
            </h2>
          </div>
          <button onClick={onClose} aria-label="Close">
            <X />
          </button>
        </div>

        {user ? (
          <div className="mt-10">
            <p className="text-muted">{user.phone}</p>
            <button
              onClick={() => {
                logout();
                onClose();
              }}
              className="mt-6 text-sm font-semibold text-azure"
            >
              Sign out
            </button>
          </div>
        ) : (
          <form
            className="mt-8 space-y-4"
            onSubmit={async (e) => {
              e.preventDefault();
              if (phone.replace(/\D/g, "").length < 10) {
                setNote("Enter a valid 10-digit mobile number.");
                return;
              }
              if (mode === "register") {
                const error = await register({ name: name || "Customer", phone, email, password });
                if (error) {
                  setNote(error);
                  return;
                }
                onClose();
                return;
              }
              login({ name: name || "Customer", phone, email });
              onClose();
            }}
          >
            {mode === "register" && <Input label="Full name" value={name} onChange={setName} />}
            <Input label="Phone number *" value={phone} onChange={setPhone} />
            {mode === "register" && <Input label="Email" value={email} onChange={setEmail} />}
            <Input label="Password *" value={password} onChange={setPassword} type="password" />
            {note && <p className="text-sm text-danger">{note}</p>}
            <button className="btn-primary w-full">{mode === "register" ? "Create account" : "Continue"}</button>
            <button type="button" onClick={() => setMode(mode === "login" ? "register" : "login")} className="block text-sm text-muted">
              {mode === "login" ? "No account yet? Create account" : "Already with us? Login"}
            </button>
          </form>
        )}
      </aside>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wider text-muted">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full h-12 rounded-xl border border-line px-3 bg-white"
      />
    </label>
  );
}
