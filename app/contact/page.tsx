"use client";

import { useState } from "react";
import { faqs } from "@/lib/content";
import { useStore } from "@/lib/store";

export default function ContactPage() {
  const { settings } = useStore();
  const [sent, setSent] = useState(false);
  const [choice, setChoice] = useState(false);
  const [error, setError] = useState("");

  async function submit(kind: "contact" | "choice", form: FormData) {
    setError("");
    const res = await fetch("/api/inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kind,
        name: form.get("name"),
        phone: form.get("phone"),
        email: form.get("email"),
        message: form.get("message"),
      }),
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Could not send.");
      return false;
    }
    return true;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-azure">Talk to us</p>
      <h1 className="font-display text-5xl mt-2">Contact Us</h1>

      <div className="mt-10 grid lg:grid-cols-2 gap-12">
        <div>
          <p className="font-display text-3xl">{settings.phone}</p>
          <p className="text-muted mt-1">{settings.hours}</p>
          <p className="mt-4">{settings.email}</p>
          <p className="mt-6 text-muted leading-relaxed">
            {settings.addressLine1}
            <br />
            {settings.addressLine2}
          </p>
          <p className="mt-4 text-xs uppercase tracking-wider text-muted">{settings.trustLine || "Secure UPC in 60 minutes"}</p>

          <div className="mt-10">
            <h2 className="font-display text-3xl">Choice number request</h2>
            <p className="text-sm text-muted mt-2 max-w-md">Tell us the pattern you can hear. We will hunt the closest live match.</p>
            {choice ? (
              <p className="mt-6 text-azure font-semibold">Thank you. The desk will call you shortly.</p>
            ) : (
              <form
                className="mt-6 space-y-3"
                onSubmit={async (e) => {
                  e.preventDefault();
                  const form = new FormData(e.currentTarget);
                  form.set("message", `Choice number: ${form.get("choice")} · Budget: ${form.get("budget")}`);
                  if (await submit("choice", form)) setChoice(true);
                }}
              >
                <input required name="name" placeholder="Your name" className="w-full h-12 rounded-xl border border-line px-3" />
                <input required name="phone" placeholder="Contact number" className="w-full h-12 rounded-xl border border-line px-3" />
                <input required name="choice" placeholder="Choice number / pattern" className="w-full h-12 rounded-xl border border-line px-3" />
                <select name="budget" className="w-full h-12 rounded-xl border border-line px-3 bg-white">
                  <option>Budget doesn’t matter</option>
                  <option>₹0 – 3,000</option>
                  <option>₹3,000 – 7,000</option>
                  <option>₹7,000 – 10,000</option>
                  <option>₹10,000 – 20,000</option>
                  <option>₹20,000+</option>
                </select>
                <button className="btn-primary">Submit request</button>
              </form>
            )}
          </div>
        </div>

        <div className="card-surface p-8">
          <h2 className="font-display text-3xl">Write to us</h2>
          {sent ? (
            <p className="mt-6 text-azure font-semibold">Message received. We reply within the hour during desk hours.</p>
          ) : (
            <form
              className="mt-6 space-y-3"
              onSubmit={async (e) => {
                e.preventDefault();
                if (await submit("contact", new FormData(e.currentTarget))) setSent(true);
              }}
            >
              <input required name="name" placeholder="Name" className="w-full h-12 rounded-xl border border-line px-3" />
              <input required name="phone" placeholder="Mobile" className="w-full h-12 rounded-xl border border-line px-3" />
              <input name="email" placeholder="Email" className="w-full h-12 rounded-xl border border-line px-3" />
              <textarea required name="message" placeholder="How can we help?" className="w-full h-32 rounded-xl border border-line p-3" />
              <button className="btn-primary">Send</button>
            </form>
          )}
          {error && <p className="mt-3 text-sm text-danger">{error}</p>}

          <h3 className="font-display text-2xl mt-12 mb-4">Quick answers</h3>
          <ul className="space-y-4">
            {faqs.slice(0, 3).map((faq) => (
              <li key={faq.q}>
                <p className="text-sm font-medium">{faq.q}</p>
                <p className="text-sm text-muted mt-1">{faq.a}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
