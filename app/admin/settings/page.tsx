"use client";

import { useEffect, useState } from "react";
import type { CheckoutMode, SiteSettings } from "@/lib/types";
import { useAdminData } from "@/components/admin/admin-data";

export default function AdminSettingsPage() {
  const { data, save } = useAdminData();
  const [form, setForm] = useState<SiteSettings | null>(null);
  const [note, setNote] = useState("");

  useEffect(() => {
    if (data) {
      setForm({
        ...data.settings,
        razorpayWebhookSecret: data.settings.razorpayWebhookSecret ?? "",
        onesignalAppId: data.settings.onesignalAppId ?? "",
        onesignalRestApiKey: data.settings.onesignalRestApiKey ?? "",
      });
    }
  }, [data]);

  if (!form) return <p className="text-muted">Loading settings…</p>;

  function set<K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) {
    setForm((current) => (current ? { ...current, [key]: value } : current));
  }

  return (
    <div>
      <h1 className="font-display text-3xl">Settings</h1>
      <p className="text-muted text-sm mt-1">These details appear across fancynumbershop.com and control payments.</p>
      <form
        className="mt-6 grid sm:grid-cols-2 gap-4"
        onSubmit={async (e) => {
          e.preventDefault();
          const ok = await save({ settings: form });
          setNote(ok ? "Settings saved." : "Save failed.");
        }}
      >
        <Field label="Shop name" value={form.name} onChange={(v) => set("name", v)} />
        <Field label="Legal name" value={form.legalName} onChange={(v) => set("legalName", v)} />
        <Field label="Tagline" value={form.tagline} onChange={(v) => set("tagline", v)} />
        <Field label="Domain" value={form.domain} onChange={(v) => set("domain", v)} />
        <Field label="Phone display" value={form.phone} onChange={(v) => set("phone", v)} />
        <Field label="Phone tel link" value={form.phoneHref} onChange={(v) => set("phoneHref", v)} />
        <Field label="WhatsApp number (with country code)" value={form.whatsapp} onChange={(v) => set("whatsapp", v)} />
        <Field label="Email" value={form.email} onChange={(v) => set("email", v)} />
        <Field label="Trust line" value={form.trustLine ?? ""} onChange={(v) => set("trustLine", v)} />
        <Field label="Hours" value={form.hours} onChange={(v) => set("hours", v)} />
        <Field label="Address line 1" value={form.addressLine1} onChange={(v) => set("addressLine1", v)} />
        <Field label="Address line 2" value={form.addressLine2} onChange={(v) => set("addressLine2", v)} />
        <label className="sm:col-span-2 text-sm">
          Description
          <textarea value={form.description} onChange={(e) => set("description", e.target.value)} className="mt-1 w-full h-24 rounded-xl border border-line p-3" />
        </label>
        <label className="text-sm">
          Default buy mode for new numbers
          <select value={form.defaultCheckout} onChange={(e) => set("defaultCheckout", e.target.value as CheckoutMode)} className="mt-1 w-full h-11 rounded-xl border border-line px-3 bg-white">
            <option value="whatsapp">WhatsApp</option>
            <option value="razorpay">Razorpay</option>
          </select>
        </label>
        <Field label="Ticker (comma separated)" value={form.ticker.join(", ")} onChange={(v) => set("ticker", v.split(",").map((part) => part.trim()).filter(Boolean))} />
        <Field label="Razorpay Key ID" value={form.razorpayKeyId} onChange={(v) => set("razorpayKeyId", v)} />
        <Field label="Razorpay Key Secret" value={form.razorpayKeySecret} onChange={(v) => set("razorpayKeySecret", v)} type="password" />
        <Field label="Razorpay webhook secret" value={form.razorpayWebhookSecret} onChange={(v) => set("razorpayWebhookSecret", v)} type="password" />
        <p className="sm:col-span-2 text-xs text-muted -mt-2">
          In Razorpay Dashboard → Webhooks, add <span className="font-mono">{form.domain.replace(/\/$/, "")}/api/checkout/webhook</span> for
          events <span className="font-mono">payment.captured</span> and <span className="font-mono">order.paid</span>.
        </p>
        <Field label="OneSignal App ID" value={form.onesignalAppId} onChange={(v) => set("onesignalAppId", v)} />
        <Field label="OneSignal REST API key" value={form.onesignalRestApiKey} onChange={(v) => set("onesignalRestApiKey", v)} type="password" />
        <p className="sm:col-span-2 text-xs text-muted -mt-2">
          After saving, tap <strong>Alerts</strong> in the admin bar and allow notifications on this browser. Use the test
          button below.
        </p>
        <Field label="Admin username" value={form.adminUser} onChange={(v) => set("adminUser", v)} />
        <Field label="Admin password" value={form.adminPassword} onChange={(v) => set("adminPassword", v)} type="password" />
        <div className="sm:col-span-2 flex flex-col sm:flex-row gap-2">
          {note && <p className="text-sm text-azure mb-3 sm:mb-0 sm:mr-auto">{note}</p>}
          <button className="btn-primary">Save settings</button>
          <button
            type="button"
            className="h-11 px-4 rounded-xl border border-line text-sm font-semibold"
            onClick={async () => {
              const res = await fetch("/api/admin/notify-test", { method: "POST" });
              const body = await res.json();
              setNote(body.ok ? "Test notification sent. Check this browser." : body.error || "Notification failed.");
            }}
          >
            Send test notification
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({
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
    <label className="text-sm">
      {label}
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 w-full h-11 rounded-xl border border-line px-3" />
    </label>
  );
}
